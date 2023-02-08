import { crypto } from '$std/crypto/mod.ts'
import { toHashString } from '$std/crypto/to_hash_string.ts'
import { encode } from '$std/encoding/base64.ts'
import {
  B2_APPLICATION_KEY,
  B2_BLOG_BUCKET_ID as bucketId,
  B2_KEY_ID,
} from '../constants.ts'

interface File {
  action: string
  contentLength: number
  contentMd5: string | null
  contentSha1: string | null
  contentType: string | null
  fileName: string
  uploadTimestamp: number
}

interface Upload {
  uploadUrl: string
  authorizationToken: string
}

const POST = 'POST'
let apiUrl: Promise<string>
let authorizationToken: Promise<string>

export async function getNotes() {
  const body = { delimiter: '/' }
  const url = '/b2api/v2/b2_list_file_names'
  return (await basicReq<{ files: Array<File> }>(url, body)).files
}

export async function listImages(bodyInput?: { bucketId?: string }) {
  const body = { prefix: 'notes/', maxFileCount: 10000, ...bodyInput }
  const url = '/b2api/v2/b2_list_file_names'
  return (await basicReq<{ files: Array<File> }>(url, body))
}

export async function listCachedImages(bodyInput: { bucketId?: string }) {
  const body = { prefix: 'cache/', maxFileCount: 10000, ...bodyInput }
  const url = '/b2api/v2/b2_list_file_names'
  return (await basicReq<{ files: Array<File> }>(url, body))
}

export async function postNote(note: { body: string; path: string }) {
  const upload = await basicReq<Upload>('/b2api/v2/b2_get_upload_url')
  const { uploadUrl, authorizationToken: Authorization } = upload
  const body = new TextEncoder().encode(note.body)
  const hash = toHashString(await crypto.subtle.digest('SHA-1', body))
  const headers = new Headers({
    Authorization,
    'X-Bz-File-Name': encodeURI(note.path),
    'Content-Type': 'text/markdown',
    'Content-Length': String(body.length + hash.length),
    'X-Bz-Content-Sha1': hash,
  })
  return (await fetch(uploadUrl, { headers, body, method: POST })).json()
}

const EXPIRED_AUTH = 401
async function basicReq<T>(path: string, body = {}): Promise<T> {
  try {
    if (!apiUrl) await authorize()
    const response = await (await fetch((await apiUrl) + path, {
      method: POST,
      headers: new Headers({ Authorization: await authorizationToken }),
      body: JSON.stringify({ bucketId, ...body }),
    })).json()
    return response
  } catch (e) {
    if (e.status === EXPIRED_AUTH) {
      await authorize()
      return (await fetch((await apiUrl) + path, {
        method: POST,
        headers: new Headers({ Authorization: await authorizationToken }),
        body: JSON.stringify({ bucketId, ...body }),
      })).json()
    } else {
      throw new Error(e)
    }
  }
}

async function authorize(): Promise<{
  apiUrl: string
  authorizationToken: string
}> {
  console.log('B2 AUTH')
  const AUTH_URL = 'https://api.backblazeb2.com/b2api/v2/b2_authorize_account'
  const Authorization = `Basic ${encode(B2_KEY_ID + ':' + B2_APPLICATION_KEY)}`
  let apiResolve: (arg: string) => void
  let authTokenResolve: (arg: string) => void
  apiUrl = new Promise((resolve) => apiResolve = resolve)
  authorizationToken = new Promise((resolve) => authTokenResolve = resolve)
  const response = await (await fetch(AUTH_URL, {
    method: 'GET',
    headers: new Headers({ Authorization }),
    credentials: 'include',
  })).json()
  apiResolve!(response.apiUrl)
  authTokenResolve!(response.authorizationToken)
  return response
}

export async function cacheImage(
  cachePath: string,
  contentType: string,
  imgArray: Uint8Array,
  inputBody = {},
) {
  // console.log('CACHING', cachePath)
  const body = typedArrayToBuffer(imgArray)
  const hash = toHashString(await crypto.subtle.digest('SHA-1', body))

  const upload = await basicReq<Upload>(
    '/b2api/v2/b2_get_upload_url',
    inputBody,
  )
  const { uploadUrl, authorizationToken: Authorization } = upload

  const headers = new Headers({
    Authorization,
    'X-Bz-File-Name': encodeURI(cachePath),
    'Content-Type': contentType,
    'Content-Length': String(body.byteLength + hash.length),
    'X-Bz-Content-Sha1': hash,
  })
  const result = await fetch(uploadUrl, { headers, body, method: POST })
  if (!result.ok) {
    console.error(result)
    throw new Error('failed to cache image')
  }
  return result
}

function typedArrayToBuffer(arr: Uint8Array): ArrayBuffer {
  return arr.buffer.slice(arr.byteOffset, arr.byteLength + arr.byteOffset)
}
