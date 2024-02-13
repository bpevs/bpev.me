# bpev.me

This is a repository for:

- `bpev.me` homepage
- `*.bpev.me` microapps

# bpev.me

Usage:

```sh
cd www
deno task start --dev
```

# Routes

| Path             | Purpose                       |
| ---------------- | ----------------------------- |
| `/`              | Homepage                      |
| `/notes`         | List of Notes                 |
| `/notes/:id`     | Note                          |
| `/notes/:id.txt` | Note in unformatted plaintext |
| `/notes/:id.md`  | Note in markdown              |
| `/rss`           | RSS Feed of Notes             |
| `/projects`      | Static Project page           |

# Scripts

| Script           | Purpose                                               |
| ---------------- | ----------------------------------------------------- |
| `blog_images.sh` | Format small, mid, and big images in og format + webp |
