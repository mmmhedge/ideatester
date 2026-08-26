export function checkPassphrase(provided: string | null): boolean {
  const expected = process.env.ADMIN_PASSPHRASE || "letmein";
  return !!provided && provided === expected;
}
