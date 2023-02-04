// DO NOT EDIT. This file is generated by fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import config from './deno.json' assert { type: 'json' }
import * as $0 from './routes/_404.tsx'
import * as $1 from './routes/_500.tsx'
import * as $2 from './routes/_middleware.ts'
import * as $3 from './routes/api/login.ts'
import * as $4 from './routes/api/logout.ts'
import * as $5 from './routes/api/note/[slug].tsx'
import * as $6 from './routes/dashboard.tsx'
import * as $7 from './routes/index.tsx'
import * as $8 from './routes/note/[slug].tsx'
import * as $9 from './routes/note/[slug]/edit.tsx'
import * as $10 from './routes/note/new.tsx'
import * as $$0 from './islands/Editor.tsx'
import * as $$1 from './islands/Playlist.tsx'

const manifest = {
  routes: {
    './routes/_404.tsx': $0,
    './routes/_500.tsx': $1,
    './routes/_middleware.ts': $2,
    './routes/api/login.ts': $3,
    './routes/api/logout.ts': $4,
    './routes/api/note/[slug].tsx': $5,
    './routes/dashboard.tsx': $6,
    './routes/index.tsx': $7,
    './routes/note/[slug].tsx': $8,
    './routes/note/[slug]/edit.tsx': $9,
    './routes/note/new.tsx': $10,
  },
  islands: {
    './islands/Editor.tsx': $$0,
    './islands/Playlist.tsx': $$1,
  },
  baseUrl: import.meta.url,
  config,
}

export default manifest
