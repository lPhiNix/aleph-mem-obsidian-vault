module.exports = async (tp) => {
  // Configuración: Longitud del hash deseada (en caracteres hexadecimales)
  const HASH_LENGTH = 12; // Valores comunes: 12 (por defecto), 16, 24, 32

  // Obtener el archivo de plantilla principal (no el componente actual)
  const templatePath = tp.config.template_file?.path;
  const templateFile = templatePath ? app.vault.getAbstractFileByPath(templatePath) : null;

  if (templateFile) {
    // Leer contenido de la plantilla principal
    let allContent = await app.vault.read(templateFile);

    // Extraer todos los componentes incluidos (con comillas alrededor de [[...]])
    const includeRegex = /tp\.file\.include\(["']\[\[([^\]]+)\]\]["']\)/g;
    const components = [...allContent.matchAll(includeRegex)].map(m => m[1]);

    // Concatenar contenido de todos los componentes
    for (const component of components) {
      const compFile = app.metadataCache.getFirstLinkpathDest(component, templatePath);
      if (compFile) {
        allContent += await app.vault.read(compFile);
      }
    }

    // Generar hash FNV-1a con la longitud especificada
    const fnv1a = (content, seed) => {
      let hash = seed;
      for (let i = 0; i < content.length; i++) {
        hash ^= content.charCodeAt(i);
        hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
      }
      return (hash >>> 0).toString(16).padStart(8, '0');
    };

    // Calcular cuántas pasadas necesitamos (cada pasada genera 8 caracteres)
    const passes = Math.ceil(HASH_LENGTH / 8);
    let fullHash = '';

    // Seeds FNV-1a diferentes para cada pasada
    const seeds = [2166136261, 2166136262, 2166136263, 2166136264];

    for (let i = 0; i < passes; i++) {
      fullHash += fnv1a(allContent, seeds[i % seeds.length]);
    }

    const versionHash = "#" + fullHash.substring(0, HASH_LENGTH);
    return "version: \"" + versionHash + "\"\n";
  } else {
    return "version: unknown\n";
  }
};