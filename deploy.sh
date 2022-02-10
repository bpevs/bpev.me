# install deno
# Pin version to avoid https://github.com/denoland/deno/issues/13516
echo "[ bpev ] Downloading Deno..."
curl -fsSL https://deno.land/x/install/install.sh | sh -s v1.18.0

# download blog files
echo "[ bpev ] Deploying Site..."
/opt/buildhome/.deno/bin/deno run --allow-write --allow-net --allow-read --allow-env --unstable ./src/main.tsx b2 dist
