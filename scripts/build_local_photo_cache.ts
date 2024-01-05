import { pooledMap } from '$std/async/pool.ts'
import { walk } from '$std/fs/walk.ts'
import { join, parse } from '$std/path/mod.ts'
import { ensureDir } from '$std/fs/ensure_dir.ts'
import { Entity, ImageMeta } from '@/utilities/photo_constants.ts'
import * as helpers from '@/utilities/photo_helpers.ts'

interface Result {
  entity: Entity
  imageMeta?: { [size: string]: ImageMeta }
  uploadResponse?: Response
  error?: Error
}
const localPath = Deno.args[0]

const imageDataMap: { [url: string]: { [url: string]: ImageMeta } } = {}
const COLLECT_IMAGE_META = true
const CONCURRENT = 10

console.log('Fetching FileNames...')

const imageNames = new Set()
for await (
  const dirEntry of walk(localPath, {
    exts: ['png', 'jpg', 'jpeg', 'PNG', 'JPG', 'JPEG'],
    includeDirs: false,
    match: [/.*(\/(notes|pages).*)$/],
  })
) {
  const [_, name] = dirEntry?.path?.match(/.*(\/(notes|pages).*)$/) || []
  imageNames.add(name)
}
console.log('Images:', imageNames.size)

const entities: Entity[] = Array.from(imageNames)
  .map((fileName) => helpers.createUploadEntities(fileName, localPath)).flat()

const results: AsyncIterableIterator<Result> = await pooledMap(
  CONCURRENT,
  entities,
  async (entity: Entity): Promise<Result> => {
    const result: Result = { entity }
    const { downloadPath, uploadPath } = entity
    let shouldWrite = false

    try {
      await Deno.lstat(uploadPath)
    } catch {
      // continue
      shouldWrite = true
    }

    try {
      const bufferArr: Uint8Array = await Deno.readFile(downloadPath)
      const [imgArray, imgData] = await Promise.all([
        shouldWrite
          ? helpers.formatBuffer(bufferArr, entity)
          : Promise.resolve(),
        (COLLECT_IMAGE_META && !imageDataMap[downloadPath])
          ? helpers.parseBufferData(bufferArr)
          : Promise.resolve(),
      ])
      if (!shouldWrite) result.skipped = true

      if (imgData) {
        imageDataMap[downloadPath] = imgData
        result.imageMeta = imgData
      }
      if (imgArray) {
        await ensureDir(parse(uploadPath).dir)
        if (!imgArray.length) throw new Error('Invalid array length')
        await Deno.writeFile(uploadPath, imgArray, { createNew: true })
      }
    } catch (error) {
      console.log(error)
      if (error instanceof Deno.errors.AlreadyExists) {
        result.skipped = true
      } else {
        result.error = error
      }
    }

    return result
  },
)

let count = 0
const errors: [string, Error][] = []

try {
  for await (const { entity, error, skipped } of results) {
    if (skipped) {
      count++
      continue
    }
    if (error) errors.push([entity.uploadPath, error])
    const status = error ? 'FAILURE' : 'SUCCESS'

    const entityCountDigits = String(entities.length).length
    const countLog = String(++count).padStart(entityCountDigits, '0')
    console.log(
      `${countLog}/${entities.length} ${status} ${
        entity.uploadPath.replace(
          '/Users/ben/Vault/10-19 Notes/18 bpev.me/13.01 static/cache/',
          '',
        )
      }`,
    )
  }
} catch (e) {
  console.error(e)
}

Deno.writeTextFileSync(
  join(localPath, 'cache/image-data.json'),
  JSON.stringify(imageDataMap),
)

console.log(errors)
