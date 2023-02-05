/**
 * @reference https://gist.github.com/chrisveness/770ee96945ec12ac84f134bf538d89fb
 */
export async function hash(
  password: string,
  iterations = 1e6,
): Promise<string> {
  const saltUint8 = crypto.getRandomValues(new Uint8Array(16)) // get random salt

  const keyArray = await generateKeyArray(password, saltUint8, iterations)
  const saltArray = Array.from(new Uint8Array(saltUint8))

  const iterHex = ('000000' + iterations.toString(16)).slice(-6) // iter’n count as hex
  const iterArray = (iterHex.match(/.{2}/g) || []).map((byte) =>
    parseInt(byte, 16)
  ) // iter’ns as byte array
  const compositeArray = [...saltArray, ...iterArray, ...keyArray] // combined array
  const compositeStr = compositeArray
    .map((byte) => String.fromCharCode(byte)).join('')
  return btoa('v01' + compositeStr)
}
/**
 * Verifies whether the supplied password matches the password previously used to generate the key.
 *
 * @param   {String}  key - Key previously generated with pbkdf2().
 * @param   {String}  password - Password to be matched against previously derived key.
 * @returns {boolean} Whether password matches key.
 *
 * @example
 *   const match = await compare(key, 'pāşšŵōřđ'); // true
 */
export async function compare(key: string, password: string): Promise<boolean> {
  // Composite -> salt, iteration count, and derived key
  const storedCompositeStr = atob(key)
  const version = storedCompositeStr.slice(0, 3) //  3 bytes
  const saltStr = storedCompositeStr.slice(3, 19) // 16 bytes (128 bits)
  const iterStr = storedCompositeStr.slice(19, 22) //  3 bytes
  const keyStr = storedCompositeStr.slice(22, 54) // 32 bytes (256 bits)
  if (version != 'v01') throw new Error('Invalid key')

  // Recover salt & iterations from stored (composite) key
  const saltUint8 = new Uint8Array(
    (saltStr.match(/./g) || []).map((ch) => ch.charCodeAt(0)),
  )
  // note: cannot use TextEncoder().encode(saltStr) as it generates UTF-8
  const iterHex = (iterStr.match(/./g) || [])
    .map((ch) => ch.charCodeAt(0).toString(16))
    .join('')
  const iterations = parseInt(iterHex, 16)

  const keyArray = await generateKeyArray(password, saltUint8, iterations)
  const keyStrNew = keyArray.map((byte) => String.fromCharCode(byte)).join('')
  return keyStrNew == keyStr
}

async function generateKeyArray(
  password: string,
  salt: Uint8Array,
  iterations: number,
) {
  const pwUtf8Key = new TextEncoder().encode(password)
  const pwKey = await crypto.subtle
    .importKey('raw', pwUtf8Key, 'PBKDF2', false, ['deriveBits'])
  const keyBuffer = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
    pwKey,
    256,
  )
  return Array.from(new Uint8Array(keyBuffer))
}
