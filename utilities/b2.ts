import { crypto } from '$std/crypto/mod.ts'
import { toHashString } from '$std/crypto/to_hash_string.ts'
import { encode } from '$std/encoding/base64.ts'
import {
  B2_APPLICATION_KEY,
  B2_BLOG_BUCKET_ID as bucketId,
  B2_KEY_ID,
} from '../constants.ts'

const POST = 'POST'
let upload: {
  uploadUrl: string
  authorizationToken: string
}
let apiUrl: string
let authorizationToken: string

export async function getNotes() {
  return (await basicReq<any>('/b2api/v2/b2_list_file_names')).files
}

export async function postNote(note: any) {
  if (!upload) {
    upload = await basicReq<{
      uploadUrl: string
      authorizationToken: string
    }>('/b2api/v2/b2_get_upload_url')
  }
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
async function basicReq<T>(path: string): Promise<T> {
  try {
    if (!apiUrl) await authorize()
    const response = await (await fetch(apiUrl + path, {
      method: POST,
      headers: new Headers({ Authorization: authorizationToken }),
      body: JSON.stringify({ bucketId }),
    })).json()
    return response
  } catch (e) {
    if (e.status === EXPIRED_AUTH) {
      await authorize()
      return (await fetch(apiUrl + path, {
        method: POST,
        headers: new Headers({ Authorization: authorizationToken }),
        body: JSON.stringify({ bucketId }),
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
  const AUTH_URL = 'https://api.backblazeb2.com/b2api/v2/b2_authorize_account'
  const Authorization = `Basic ${encode(B2_KEY_ID + ':' + B2_APPLICATION_KEY)}`
  const response = await (await fetch(AUTH_URL, {
    method: 'GET',
    headers: new Headers({ Authorization }),
    credentials: 'include',
  })).json()
  apiUrl = response.apiUrl
  authorizationToken = response.authorizationToken
  return response
}
