import { join, parse } from '$std/path/mod.ts'
import {
  ImageMagick,
  initializeImageMagick,
  Magick,
  MagickFormat,
  Quantum,
} from '@imagemagick/magick-wasm'

await initializeImageMagick()

console.log(Magick.imageMagickVersion)
console.log('Delegates:', Magick.delegates)
console.log('Features:', Magick.features)
console.log('Quantum:', Quantum.depth)

export const FORMAT = {
  JPEG: 'JPEG',
  PNG: 'PNG',
  WEBP: 'WEBP',
}

export const SIZE = {
  FAST: 'FAST',
  NORMAL: 'NORMAL',
  DETAILED: 'DETAILED',
}

export const SIZE_MAP = {
  [SIZE.FAST]: 500,
  [SIZE.NORMAL]: 1200,
}

const FORMAT_MAP = {
  [FORMAT.JPEG]: MagickFormat.Jpeg,
  [FORMAT.PNG]: MagickFormat.Png,
  [FORMAT.WEBP]: MagickFormat.Webp,
}

const imageCache = new Map()

/**
 * Given a url, return an image and resulting headers
 */
export default async function (url: URL): Promise<{
  image: Uint8Array
  headers: Headers
}> {
  const { ext, dir, name } = parse(url.pathname)
  const baseUrl = 'https://' + join('static.bpev.me', dir, name)
  const format = getFormatFromUrl(ext)
  const reqSize = (new URLSearchParams(url.search)).get('size')
  const size = SIZE_MAP[(reqSize || SIZE.NORMAL).toUpperCase()] || 0
  const headers = new Headers({
    'Content-Type': `image/${format.toLowerCase()}`,
  })

  if (imageCache.has(url.href)) {
    return { headers, image: new Uint8Array(imageCache.get(url.href)) }
  }

  const imageData = await getFirstImage(baseUrl)
  return new Promise((resolve) => {
    ImageMagick.read(imageData, (image) => {
      if (size) image.resize(size, size)
      image.write((data) => {
        imageCache.set(url.href, Array.from(data))
        resolve({ headers, image: data })
      }, FORMAT_MAP[format])
    })
  })
}

function getFormatFromUrl(ext: string) {
  if (/\.(jpg|jpeg)$/i.test(ext)) return FORMAT.JPEG
  if (/\.(png)$/i.test(ext)) return FORMAT.PNG
  if (/\.(webp)$/i.test(ext)) return FORMAT.WEBP
  throw new Error(`bad format: ${ext}`)
}

async function getFirstImage(baseUrl: string): Promise<Uint8Array> {
  const image$ = Promise.any([
    fetch(`${baseUrl}.JPG`).then(handleResp),
    fetch(`${baseUrl}.PNG`).then(handleResp),
  ])
  return new Uint8Array(await image$)
}

function handleResp(resp: Response) {
  if (resp.ok) return resp.arrayBuffer()
  else throw new Error('No Image')
}
