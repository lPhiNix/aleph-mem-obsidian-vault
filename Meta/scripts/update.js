module.exports = (text = "", value = "0.0.0") => {
  // Si ya existe una línea "Version: ..." la reemplazamos manteniendo la misma línea
  // (se conserva la indentación y el salto de línea si lo había).
  const replaced = text.replace(/^(\s*Version:\s*).*(\r?\n?)/m, `$1${value}$2`);
  if (replaced !== text) return replaced;

  // Si no existía, lo añadimos al final (manteniendo comportamiento original).
  const withoutTrailing = text.trimEnd();
  const separator = withoutTrailing.length ? "\n\n" : "";
  return withoutTrailing + separator + `Version: ${value}`;
};