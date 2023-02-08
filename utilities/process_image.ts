import { join, parse } from '$std/path/mod.ts'
import {
  ImageMagick,
  initializeImageMagick,
  Magick,
  MagickFormat,
  Quantum,
} from 'imagemagick'
import { FEATURE, URL_STATIC } from '@/constants.ts'
import { cacheImage } from '@/utilities/b2.ts'
import { DIMENSIONS, FORMAT, Format, SIZE } from './image.ts'

await initializeImageMagick()

console.log(Magick.imageMagickVersion)
console.log('Delegates:', Magick.delegates)
console.log('Features:', Magick.features)
console.log('Quantum:', Quantum.depth)

const imageCache: { [url: string]: ArrayBuffer } = {}

export const FORMAT_MAP: { [value: string]: MagickFormat } = Object.freeze({
  [FORMAT.JPG]: MagickFormat.Jpeg,
  [FORMAT.PNG]: MagickFormat.Png,
  [FORMAT.WEBP]: MagickFormat.Webp,
})

/**
 * Given a url, return an image and resulting headers
 */
export default async function (url: URL): Promise<{
  image: Uint8Array
  headers: Headers
}> {
  const { baseURL, cacheURL, cachePath, format, dimensions } = parseURL(url)
  const contentType = `image/${format.toLowerCase()}`
  const headers = new Headers({ 'Content-Type': contentType })

  const staticResp = await getBestImage(baseURL, cacheURL)
  console.log('IMG', staticResp.url, staticResp.isFromCache)

  if (staticResp.isFromCache) {
    if (staticResp.url !== 'local') {
      imageCache[cacheURL] = staticResp.buffer
    }
    return { headers, image: new Uint8Array(staticResp.buffer) }
  }

  return new Promise((resolve) => {
    ImageMagick.read(new Uint8Array(staticResp.buffer), (image) => {
      if (dimensions?.[0] || dimensions?.[1]) image.resize(...dimensions)
      image.write((imgArray: Uint8Array) => {
        if (FEATURE.B2 && !staticResp.isFromCache) {
          // Parallel async; don't block resp
          cacheImage(cachePath, contentType, imgArray)
            .catch((e) => {
              console.error('Cache failed', e)
            })
        }
        resolve({ headers, image: imgArray })
      }, FORMAT_MAP[format])
    })
  })
}

export function getFormatFromUrl(ext: string): Format {
  if (/\.(jpg|jpeg)$/i.test(ext)) return FORMAT.JPG
  if (/\.(png)$/i.test(ext)) return FORMAT.PNG
  if (/\.(webp)$/i.test(ext)) return FORMAT.WEBP
  throw new Error(`bad format: ${ext}`)
}

/**
 * Fetch JPG, PNG, and the originally requested file
 * Try to pull from backblaze as cached file to save excess processing
 */
type ImgResponse = Promise<
  { url: string; buffer: ArrayBuffer; isFromCache: boolean }
>
async function getBestImage(baseURL: string, cacheURL: string): ImgResponse {
  // If possible, serve from memory cache to avoid any api call at all
  if (imageCache[cacheURL]) {
    return Promise.resolve({
      url: 'local',
      buffer: imageCache[cacheURL],
      isFromCache: true,
    })
  }

  try {
    const cached$ = fetch(cacheURL).then(handleResp)
    return { isFromCache: true, buffer: await cached$, url: cacheURL }
  } catch {
    // Avoid excess api calls by being optimistic about cache;
    // Need to experiment with performance here...
    const urls = [`${baseURL}.${FORMAT.JPG}`, `${baseURL}.${FORMAT.PNG}`]
    const fresh$ = Promise.any(urls.map(async (url: string) => {
      return { url, buffer: await fetch(url).then(handleResp) }
    }))
    return { isFromCache: false, ...(await fresh$) }
  }
}

function handleResp(resp: Response) {
  if (resp.ok) return resp.arrayBuffer()
  else throw new Error('No Image')
}

function parseURL(url: URL): {
  baseURL: string
  cacheURL: string
  cachePath: string
  format: Format
  dimensions: [number, number]
} {
  const { ext, dir, name } = parse(url.pathname)
  const sizeReq = (new URLSearchParams(url.search)).get('size')
  const sizeName = (sizeReq || SIZE.NORMAL).toUpperCase()
  const format = getFormatFromUrl(ext)
  const cachePath = join('cache', sizeName, dir, `${name}.${format}`)
  return {
    baseURL: 'https://' + join('static.bpev.me', dir, name),
    format,
    dimensions: DIMENSIONS[sizeName] || [0, 0],
    cachePath,
    cacheURL: URL_STATIC + cachePath,
  }
}
