/**
 * Update Cached Photos
 *
 *   - Fetch jpg and png photos from B2
 *   - Resize to FAST, NORMAL, DETAILED
 *   - Re-upload proessed webp, jpg, png files
 */
import { join, parse } from '$std/path/mod.ts'
import { pooledMap } from '$std/async/pool.ts'
import { cacheImage, listCachedImages, listImages } from '../utilities/b2.ts'
import { FORMAT_MAP, getFormatFromUrl } from '../utilities/process_image.ts'
import { DIMENSIONS, FORMAT, Format, SIZE } from '../utilities/image.ts'
import { B2_STATIC_BUCKET_ID, URL_STATIC } from '../constants.ts'
import { ImageMagick } from 'imagemagick'

interface Entity {
  downloadPath: string
  downloadFormat: Format
  uploadPath: string
  uploadFormat: string
  uploadSize: string
}

const { PNG, JPG } = FORMAT
const bucketId = B2_STATIC_BUCKET_ID
const CONCURRENT = 2

const previouslyCached: Set<string> = new Set(
  (await listCachedImages({ bucketId })).files.map((image) => image.fileName),
)
console.log(`Skipping ${previouslyCached.size} images...`)

const entities: Entity[] = (await listImages({ bucketId })).files
  .filter(({ fileName }) => /\.(jpg|png|jpeg)$/i.test(fileName))
  .map(({ fileName }) =>
    createUploadEntities(fileName)
      .filter((entity) => !previouslyCached.has(entity.uploadPath))
  ).flat()
console.log(`Writing ${entities.length} images...`)

let count = 0
const errors: string[] = []

const prevResponsePromises = new Map()
const statuses: AsyncIterableIterator<string> = await pooledMap(
  CONCURRENT,
  entities,
  async (entity) => {
    const downloadURL = URL_STATIC + entity.downloadPath
    const prevResponse = prevResponsePromises.get(downloadURL)
    const buffer: ArrayBuffer =
      await (prevResponse
        ? prevResponse
        : fetch(downloadURL).then((response) => {
          return response.arrayBuffer()
        }))
    if (!prevResponse) prevResponsePromises.set(downloadURL, buffer)
    try {
      await cacheImage(
        entity.uploadPath,
        `image/${entity.uploadFormat.toLowerCase().replace('jpg', 'jpeg')}`,
        await buildImage(entity, buffer),
        { bucketId },
      )
      return `SUCCESS ${entity.uploadPath}`
    } catch (e) {
      errors.push(entity.uploadPath)
      return `FAILED(BUILD+UPLOAD) ${entity.uploadPath}\n${e}`
    }
  },
)

for await (const status of statuses) {
  count++
  console.log(`${count}/${entities.length} ${status}`)
}
console.log('ERRORS')
errors.forEach((error) => {
  console.log(error)
})

function buildImage(entity: Entity, buffer: ArrayBuffer): Promise<Uint8Array> {
  const [x, y] = DIMENSIONS[entity.uploadSize] || [0, 0]
  return new Promise((resolve) => {
    ImageMagick.read(new Uint8Array(buffer), (image) => {
      if (x || y) image.resize(x, y)
      image.autoOrient()
      image.write((imgArray: Uint8Array) => {
        resolve(imgArray)
      }, FORMAT_MAP[entity.uploadFormat])
    })
  })
}

function createUploadEntities(pathname: string): Entity[] {
  const { ext, dir, name } = parse(pathname)
  const downloadPath = pathname
  const downloadFormat = getFormatFromUrl(ext)

  const entities: Entity[] = []
  Object.keys(FORMAT).forEach((uploadFormat) => {
    if (uploadFormat === PNG && downloadFormat === JPG) return
    if (uploadFormat === JPG && downloadFormat === PNG) return

    Object.keys(SIZE).forEach((uploadSize) => {
      const file = `${name}.${uploadFormat}`
      const uploadPath = join('cache', uploadSize.toLowerCase(), dir, file)
      entities.push({
        downloadPath,
        downloadFormat,
        uploadPath,
        uploadFormat,
        uploadSize,
      })
    })
  })
  return entities
}
