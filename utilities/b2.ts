import { crypto } from '$std/crypto/mod.ts'
import { encodeBase64 } from '$std/encoding/base64.ts'
import { encodeHex } from '$std/encoding/hex.ts'
import {
  B2_APPLICATION_KEY,
  B2_BLOG_BUCKET_ID,
  B2_KEY_ID,
  B2_STATIC_BUCKET_ID,
} from '@/constants.ts'

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
const EXPIRED_AUTH = 401

const URL_AUTH = 'https://api.backblazeb2.com/b2api/v2/b2_authorize_account'
const URL_LIST_FILES = '/b2api/v2/b2_list_file_names'
const URL_UPLOAD = '/b2api/v2/b2_get_upload_url'

let apiUrl: Promise<string>
let authorizationToken: Promise<string>

export const listNotes = (): Promise<Array<File>> =>
  basicReq<{ files: Array<File> }>(URL_LIST_FILES, {
    delimiter: '/',
    bucketId: B2_BLOG_BUCKET_ID,
  }).then((resp) => resp.files)

export const listImageNames = (maxCount = 100): Promise<Set<string>> =>
  basicReq<{ files: Array<File> }>(URL_LIST_FILES, {
    prefix: 'notes/',
    maxFileCount: maxCount,
    bucketId: B2_STATIC_BUCKET_ID,
  }).then((resp) => new Set(resp.files.map(({ fileName }) => fileName)))

export const listCachedImageNames = (maxCount = 100): Promise<Set<string>> =>
  basicReq<{ files: Array<File> }>(URL_LIST_FILES, {
    prefix: 'cache/',
    maxFileCount: maxCount,
    bucketId: B2_STATIC_BUCKET_ID,
  }).then((resp) => new Set(resp.files.map(({ fileName }) => fileName)))

export async function uploadFile(
  bucketId: string,
  path: string,
  body: ArrayBuffer,
  headerOverrides: { [key: string]: string },
) {
  const hash = encodeHex(await crypto.subtle.digest('SHA-1', body))
  console.log(hash)
  const upload = await basicReq<Upload>(URL_UPLOAD, { bucketId })

  const headers = new Headers({
    Authorization: upload.authorizationToken,
    'X-Bz-File-Name': encodeURI(path),
    'Content-Length': String(body.byteLength + hash.length),
    'X-Bz-Content-Sha1': hash,
    ...headerOverrides,
  })
  return (await fetch(upload.uploadUrl, { headers, body, method: POST })).json()
}

async function basicReq<T>(path: string, body = {}): Promise<T> {
  try {
    if (!apiUrl) await authorize()
    const response = await (await fetch((await apiUrl) + path, {
      method: POST,
      headers: new Headers({ Authorization: await authorizationToken }),
      body: JSON.stringify(body),
    })).json()
    return response
  } catch (e) {
    if (e.status === EXPIRED_AUTH) {
      await authorize()
      return (await fetch((await apiUrl) + path, {
        method: POST,
        headers: new Headers({ Authorization: await authorizationToken }),
        body: JSON.stringify(body),
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
  const Authorization = `Basic ${
    encodeBase64(B2_KEY_ID + ':' + B2_APPLICATION_KEY)
  }`
  let apiResolve: (arg: string) => void
  let authTokenResolve: (arg: string) => void
  apiUrl = new Promise((resolve) => apiResolve = resolve)
  authorizationToken = new Promise((resolve) => authTokenResolve = resolve)
  const response = await (await fetch(URL_AUTH, {
    method: 'GET',
    headers: new Headers({ Authorization }),
    credentials: 'include',
  })).json()
  apiResolve!(response.apiUrl)
  authTokenResolve!(response.authorizationToken)
  return response
}
