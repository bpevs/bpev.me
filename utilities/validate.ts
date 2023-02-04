const base64_to_buf = (b64: string) =>
  Uint8Array.from(atob(b64), (c) => c.charCodeAt(null))

export default async function decryptData(
  password: string = '',
  encryptedData: string,
) {
  try {
    const encryptedDataBuff = base64_to_buf(encryptedData)
    const salt = encryptedDataBuff.slice(0, 16)
    const iv = encryptedDataBuff.slice(16, 16 + 12)
    const data = encryptedDataBuff.slice(16 + 12)
    const passwordKey = await getPasswordKey(password)
    const aesKey = await deriveKey(passwordKey, salt, ['decrypt'])
    const decryptedContent = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      aesKey,
      data,
    )
    return dec.decode(decryptedContent)
  } catch (e) {
    console.log(`Error - ${e}`)
    return ''
  }
}
