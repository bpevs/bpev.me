start:
	deno run --watch --allow-net --allow-read --unstable ./source/server.tsx

run-build:
	deno run --allow-read --unstable --allow-write ./src/main.tsx "../../../10-19 Writing/10 Blog" build
