import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";

const password = "password";

const hash = await bcrypt.hash(password);
console.log(hash);

const comparison = await bcrypt.compare(password, hash);
console.log(comparison);

const wrongPassword = "wrong-test";

comparison = await bcrypt.compare(wrongPassword, hash);
console.log(comparison);
