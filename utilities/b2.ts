import { crypto } from "$std/crypto/mod.ts";
import { toHashString } from "$std/crypto/to_hash_string.ts"
import { encode } from "$std/encoding/base64.ts";
import { KEY_ID, APPLICATION_KEY, BLOG_BUCKET_ID as bucketId } from "../constants.ts";

const method = "POST";
const auth = await authorize();
const { apiUrl, authorizationToken } = auth;

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
  return (await fetch(url, { headers, body, method })).json();
}

async function basicReq<T>(path: string): Promse<T> {
  if (!apiUrl) await authorize();
  const options = { method, headers, body: JSON.stringify({ bucketId }) }
  return (await fetch(apiUrl + path, options)).json();
}

async function authorize(): Promise<any> {
  const AUTH_URL = "https://api.backblazeb2.com/b2api/v2/b2_authorize_account";
  const Authorization = `Basic ${encode(KEY_ID + ":" + APPLICATION_KEY)}`;

  return (await fetch(AUTH_URL, {
    method: "GET",
    headers: new Headers({ Authorization }),
    withCredentials: true,
    credentials: "include",
  })).json();
}
