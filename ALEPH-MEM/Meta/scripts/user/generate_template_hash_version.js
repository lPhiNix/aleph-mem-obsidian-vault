module.exports = async (tp) => {
  // Length of the hex fingerprint.
  const HASH_LENGTH = 12;

  const templatePath = tp.config.template_file?.path;
  const templateFile = templatePath ? app.vault.getAbstractFileByPath(templatePath) : null;

  if (!templateFile) return "version: unknown\n";

  // Collect the template and every inlined component, recursively.
  // A path stack prevents cycles without skipping legitimate duplicate includes.
  const stack = new Set();
  const chunks = [];

  async function collect(file) {
    if (stack.has(file.path)) return;
    stack.add(file.path);

    const content = await app.vault.read(file);
    chunks.push(content);

    const includeRegex = /tp\.file\.include\(["']\[\[([^\]]+)\]\]["']\)/g;
    const includes = [...content.matchAll(includeRegex)].map((match) => match[1]);

    for (const include of includes) {
      const included = app.metadataCache.getFirstLinkpathDest(include, file.path);
      if (included) await collect(included);
    }

    stack.delete(file.path);
  }

  await collect(templateFile);
  const allContent = chunks.join("");

  const fnv1a = (content, seed) => {
    let hash = seed;
    for (let i = 0; i < content.length; i++) {
      hash ^= content.charCodeAt(i);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return (hash >>> 0).toString(16).padStart(8, "0");
  };

  const passes = Math.ceil(HASH_LENGTH / 8);
  const seeds = [2166136261, 2166136262, 2166136263, 2166136264];
  let fullHash = "";

  for (let i = 0; i < passes; i++) {
    fullHash += fnv1a(allContent, seeds[i % seeds.length]);
  }

  return `version: "#${fullHash.substring(0, HASH_LENGTH)}"\n`;
};
