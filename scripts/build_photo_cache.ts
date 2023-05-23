import { pooledMap } from '$std/async/pool.ts'
import { B2_STATIC_BUCKET_ID } from '@/constants.ts'
import { Entity, ImageMeta } from '@/utilities/photo_constants.ts'
import * as b2 from '@/utilities/b2.ts'
import * as helpers from '@/utilities/photo_helpers.ts'

interface Result {
  entity: Entity
  imageMeta?: { [size: string]: ImageMeta }
  uploadResponse?: Response
  error?: Error
}

const UPLOAD_TO_CACHE = true
const COLLECT_IMAGE_META = false
const CONCURRENT = 12
const MAX_UPLOAD = 10000

console.log('Fetching FileNames...')

const [imageNames, cachedImageNames] = await Promise.all([
  b2.listImageNames(MAX_UPLOAD),
  b2.listCachedImageNames(MAX_UPLOAD),
])

console.log('Images:', imageNames.size)
console.log('Cached:', cachedImageNames.size)

const entities: Entity[] = Array.from(imageNames)
  .filter((fileName) => /\.(jpg|png|jpeg)$/i.test(fileName))
  .map((fileName) => helpers.createUploadEntities(fileName)).flat()

const imageDataMap: { [url: string]: { [url: string]: ImageMeta } } = {}

const results: AsyncIterableIterator<Result> = await pooledMap(
  CONCURRENT,
  entities,
  async (entity: Entity): Promise<Result> => {
    const result: Result = { entity }
    const { downloadPath, uploadFormat, uploadPath } = entity
    try {
      const originalBuffer: ArrayBuffer = await helpers.fetchBuffer(entity)
      const bufferArr: Uint8Array = new Uint8Array(originalBuffer)

      if (COLLECT_IMAGE_META) {
        if (!imageDataMap[downloadPath]) {
          imageDataMap[downloadPath] = await helpers.parseBufferData(bufferArr)
        }
        result.imageMeta = imageDataMap[downloadPath]
      }

      if (UPLOAD_TO_CACHE && !cachedImageNames.has(uploadPath)) {
        if (!B2_STATIC_BUCKET_ID) throw new Error('No Static Bucket ID')

        const type = uploadFormat.toLowerCase().replace('jpg', 'jpeg')
        result.uploadResponse = await b2.uploadFile(
          B2_STATIC_BUCKET_ID,
          uploadPath,
          typedArrayToBuffer(await helpers.formatBuffer(bufferArr, entity)),
          { 'Content-Type': `image/${type}` },
        )
      }
    } catch (error) {
      result.error = error
    }
    return result
  },
)

let count = 0
const errors: [string, Error][] = []

try {
  for await (const { entity, error, imageMeta } of results) {
    if (error) errors.push([entity.uploadPath, error])
    const status = error ? 'FAILURE' : 'SUCCESS'
    const entityCountDigits = String(entities.length).length
    const countLog = String(++count).padStart(entityCountDigits, '0')
    console.log(`${countLog}/${entities.length} ${status} ${entity.uploadPath}`)
    if (COLLECT_IMAGE_META) console.log(imageMeta)
  }
} catch (e) {
  console.error(e)
}

console.log('ERRORS')
console.log(errors)
if (!B2_STATIC_BUCKET_ID) throw new Error('No Static Bucket ID')

const imageDataFileNames = Object.keys(imageDataMap)
const bySlug: {
  [slug: string]: { [fileName: string]: { [size: string]: ImageMeta } }
} = {}
imageDataFileNames.forEach((fileName) => {
  const [_notes, slug] = fileName.split('/')
  if (!bySlug[slug]) bySlug[slug] = {}
  bySlug[slug][fileName] = imageDataMap[fileName]
})

b2.uploadFile(
  B2_STATIC_BUCKET_ID,
  'cache/image_data.json',
  (new TextEncoder().encode(JSON.stringify(imageDataMap))).buffer,
  { 'Content-Type': 'application/json' },
)

function typedArrayToBuffer(arr: Uint8Array): ArrayBuffer {
  return arr.buffer.slice(arr.byteOffset, arr.byteLength + arr.byteOffset)
}
