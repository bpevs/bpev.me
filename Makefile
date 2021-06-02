start:
	deno run --watch --allow-read --allow-write --unstable ./src/main.tsx "../../../10-19 Writing/10 Blog" build

run:
	deno run --allow-read --allow-write --unstable ./src/main.tsx "../../../10-19 Writing/10 Blog" build

serve:
	deno run --allow-net --allow-read https://deno.land/std@0.97.0/http/file_server.ts ./build

test:
	deno fmt
	deno test

watch:
	deno run --watch --allow-read --allow-write  --unstable ./src/main.tsx "../../../10-19 Writing/10 Blog" build

