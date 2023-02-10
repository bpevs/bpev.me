// Configuration that doesn't need to be in .env
export default {
  URL_BLOG_LOCAL: './local_notes/',
  URL_STATIC: 'https://static.bpev.me/',

  // What is live on `bpev.me`
  // Override via `.env` (`.env` is not imported by islands)
  FEATURE: {
    B2: true,
    DASHBOARD: true,
  },
}
