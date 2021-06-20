# install deno
echo "[ bpev ] Downloading Deno..."
curl -fsSL https://deno.land/x/install/install.sh | sh

# download blog files
echo "[ bpev ] Deploying Site..."
/opt/buildhome/.deno/bin/deno run --allow-write --allow-net --allow-read --allow-env --unstable ./src/main.tsx b2 dist
