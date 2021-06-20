start:
	deno run --watch --allow-read --allow-write --allow-env --unstable ./src/main.tsx fs dist

test:
	deno fmt
	deno test

make build-b2:
	deno run --allow-write --allow-net --allow-read --allow-env --unstable ./src/main.tsx b2 dist

make build-fs:
	deno run --allow-read --allow-write --allow-env --unstable ./src/main.tsx fs dist

make watch-fs:
	deno run --watch --allow-read --allow-write --allow-env --unstable ./src/main.tsx fs dist
