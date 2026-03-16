module.exports = async (_tp) => {
  const max = 10n ** 18n;
  let value;

  // Rejection sampling
  do {
    const bytes = crypto.getRandomValues(new Uint8Array(8));
    value = 0n;
    for (const b of bytes) {
      value = (value << 8n) | BigInt(b);
    }
  } while (value >= (2n ** 64n - (2n ** 64n % max)));

  const key = (value % max).toString().padStart(16, '0');
  return `key: "${key}"`;
};
