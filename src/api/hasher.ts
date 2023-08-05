import { pbkdf2, randomBytes } from "crypto";

const makeSalt = (salt: string | undefined) => new Promise<Buffer | undefined>((res) => {
  if (salt) return res(Buffer.from(salt, "base64"));
  randomBytes(64, (err, buf) => {
    if (err) return res(undefined);
    return res(buf);
  })
});

export const hasher = (pw: string, salt: string | undefined) => new Promise<{ salt?: string; hash?: string; }>(async (res) => {
  const saltBuffer = await makeSalt(salt);
  if (saltBuffer === undefined) return res({ salt: undefined });
  pbkdf2(pw, saltBuffer, 10000, 128, "sha1", (err, hash) => {
    if (err) return res({ salt: saltBuffer.toString("base64"), hash: undefined });
    return res({ salt: saltBuffer.toString("base64"), hash: hash.toString("base64") });
  });
});