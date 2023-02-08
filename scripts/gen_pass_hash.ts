/** */

import { assert } from '$std/testing/asserts.ts'
import { compare, hash } from './crypto.ts'

const password = Deno.args[0]
const key = await hash(password)

assert(await compare(key, password) === true)
assert(await compare(key, 'wrong-test') === false)

console.log(key)
