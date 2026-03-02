<%*
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
    
    // Generar hash FNV-1a sobre todo el contenido (plantilla + componentes)
    let hash = 2166136261;
    for (let i = 0; i < allContent.length; i++) {
        hash ^= allContent.charCodeAt(i);
        hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    
    const versionHash = "#" + (hash >>> 0).toString(16).substring(0, 8);
    tR += "version: \"" + versionHash + "\"\n";
} else {
    tR += "version: unknown\n";
}
%>