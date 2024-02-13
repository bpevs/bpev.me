import { Image } from 'https://deno.land/x/imagescript@1.2.15/mod.ts'
import { pooledMap } from '$std/async/pool.ts'
import { walk } from '$std/fs/walk.ts'
import { join } from '$std/path/mod.ts'

const localPath = Deno.args[0]

const imageDataMap: { [url: string]: { [url: string]: ImageMeta } } = {}

console.log('Fetching FileNames...')

const imagePaths = new Set()
for await (
  const dirEntry of walk(localPath, {
    exts: ['png', 'jpg', 'jpeg', 'PNG', 'JPG', 'JPEG'],
    includeDirs: false,
    match: [/.*(\/(cache).*)$/],
  })
) {
  const path = 'cache' + dirEntry.path.split('cache')[1]
  imagePaths.add(path)
}
console.log('Images:', imagePaths.size)

const CONCURRENT = 5
const results: AsyncIterableIterator<Result> = await pooledMap(
  CONCURRENT,
  imagePaths,
  async (filePath: string): Promise<Result> => {
    if (imageDataMap[filePath]) return
    const bufferArr: Uint8Array = await Deno.readFile(join(localPath, filePath))
    const image = await Image.decode(bufferArr)
    const [_, quality, shortPath] = filePath.match(
      /(normal\/|fast\/|detailed\/)(.*)/,
    )

    if (!imageDataMap[shortPath]) imageDataMap[shortPath] = {}
    const width = image.width
    const height = image.height
    const averageColor = Image.colorToRGBA(image.averageColor())

    imageDataMap[shortPath][quality.toUpperCase()] = {
      averageColor,
      width,
      height,
    }
    return `${shortPath} ${quality}, w:${width}, h:${height}, rgb:${averageColor}`
  },
)

let count = 0
for await (const filePath of results) {
  console.log(++count, filePath)
}

Deno.writeTextFileSync(
  join(localPath, 'image_data.json'),
  JSON.stringify(imageDataMap),
)
