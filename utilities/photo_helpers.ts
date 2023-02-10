import type { Entity, Format, ImageMeta } from './photo_constants.ts'

import { join, parse } from '$std/path/mod.ts'
import { Image } from 'https://deno.land/x/imagescript@1.2.15/mod.ts'
import { ImageMagick, initializeImageMagick } from 'imagemagick'
import { URL_STATIC } from '@/constants.ts'
import { DIMENSIONS, FORMAT, FORMAT_MAP, SIZE } from './photo_constants.ts'

initializeImageMagick()

const cachedBufferResponses: { [url: string]: Promise<ArrayBuffer> } = {}

export function fetchBuffer(entity: Entity): Promise<ArrayBuffer> {
  const url = URL_STATIC + entity.downloadPath
  if (!cachedBufferResponses[url]) {
    cachedBufferResponses[url] = fetch(url).then((resp) => resp.arrayBuffer())
  }
  return cachedBufferResponses[url]
}

export async function parseBufferData(
  bufferArr: Uint8Array,
): Promise<{ [size: string]: ImageMeta }> {
  const image = await Image.decode(bufferArr)
  const averageColor = Image.colorToRGBA(image.averageColor())
  return new Promise((resolve) => {
    ImageMagick.read(bufferArr, (image) => {
      const imageMeta: { [size: string]: ImageMeta } = {}
      Object.keys(SIZE).forEach((size) => {
        const [x, y] = DIMENSIONS[size] || [0, 0]
        if (x || y) image.resize(x, y)
        image.autoOrient()
        const { height, width } = image
        imageMeta[size] = { averageColor, height, width }
      })
      resolve(imageMeta)
    })
  })
}

export function formatBuffer(
  bufferArr: Uint8Array,
  entity: Entity,
): Promise<Uint8Array> {
  const [x, y] = DIMENSIONS[entity.uploadSize] || [0, 0]
  return new Promise((resolve) => {
    ImageMagick.read(bufferArr, (image) => {
      if (x || y) image.resize(x, y)
      image.autoOrient()
      image.write((imgArray: Uint8Array) => {
        resolve(imgArray)
      }, FORMAT_MAP[entity.uploadFormat])
    })
  })
}

export function createUploadEntities(downloadPath: string): Entity[] {
  const { ext, dir, name } = parse(downloadPath)
  const downloadFormat = getFormatFromUrl(ext)

  const entities: Entity[] = []
  Object.keys(FORMAT).forEach((uploadFormat) => {
    if (uploadFormat === FORMAT.PNG && downloadFormat === FORMAT.JPG) return
    if (uploadFormat === FORMAT.JPG && downloadFormat === FORMAT.PNG) return
    const file = `${name}.${uploadFormat}`

    Object.keys(SIZE).forEach((uploadSize) => {
      entities.push({
        downloadPath,
        downloadFormat,
        uploadPath: join('cache', uploadSize.toLowerCase(), dir, file),
        uploadFormat,
        uploadSize,
      })
    })
  })
  return entities
}

function getFormatFromUrl(ext: string): Format {
  if (/\.(jpg|jpeg)$/i.test(ext)) return FORMAT.JPG
  if (/\.(png)$/i.test(ext)) return FORMAT.PNG
  if (/\.(webp)$/i.test(ext)) return FORMAT.WEBP
  throw new Error(`bad format: ${ext}`)
}
