import { crypto } from "$std/crypto/mod.ts";
import { toHashString } from "$std/crypto/to_hash_string.ts";
import { encode } from "$std/encoding/base64.ts";
import {
  B2_APPLICATION_KEY,
  B2_BLOG_BUCKET_ID as bucketId,
  B2_KEY_ID,
  FEATURE,
} from "../constants.ts";

const POST = "POST";
const { apiUrl, authorizationToken } = FEATURE.B2 ? await authorize() : {};

const headers = new Headers({ Authorization: authorizationToken });
let upload;

export async function getNotes() {
  return (await basicReq<>("/b2api/v2/b2_list_file_names")).files;
}

export async function postNote(note: Note) {
  if (!upload) upload = await basicReq("/b2api/v2/b2_get_upload_url");
  const { uploadUrl, authorizationToken: Authorization } = upload;

  const body = new TextEncoder().encode(note.body);
  const hash = toHashString(await crypto.subtle.digest("SHA-1", body));
  const headers = new Headers({
    Authorization,
    "X-Bz-File-Name": encodeURI(note.path),
    "Content-Type": "text/markdown",
    "Content-Length": body.length + hash.length,
    "X-Bz-Content-Sha1": hash,
  });
  return (await fetch(url, { headers, body, method: POST })).json();
}

const EXPIRED_AUTH = 401;
async function basicReq<T>(path: string): Promise<T> {
  const options = { method: POST, headers, body: JSON.stringify({ bucketId }) };
  try {
    if (!apiUrl) await authorize();
    return (await fetch(apiUrl + path, options)).json();
  } catch (e) {
    if (e.status === EXPIRED_AUTH) {
      await authorize();
      return (await fetch(apiUrl + path, options)).json();
    } else {
      throw new Error(e);
    }
  }
}

let AUTH_TTL = 24 * 60 * 60;
async function authorize(): Promise<any> {
  const AUTH_URL = "https://api.backblazeb2.com/b2api/v2/b2_authorize_account";
  const Authorization = `Basic ${encode(B2_KEY_ID + ":" + B2_APPLICATION_KEY)}`;

  const response = await (await fetch(AUTH_URL, {
    method: "GET",
    headers: new Headers({ Authorization }),
    withCredentials: true,
    credentials: "include",
  })).json();
  return response;
}
