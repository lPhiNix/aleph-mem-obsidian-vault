function _esc(attr = "") {
  return attr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function _attrStartPattern(attributeName = "") {
  return "^\\s*" + _esc(attributeName) + "\\s*:";
}

function isExist(text = "", attributeName = "") {
  if (!attributeName) return false;
  const re = new RegExp(_attrStartPattern(attributeName), "m");
  return re.test(text);
}

function insert(tR = "", attributeName = "", attributeValue = "") {
  const withoutTrailing = tR.trimEnd();
  const separator = withoutTrailing.length ? "\n\n" : "";
  return withoutTrailing + separator + `${attributeName}: ${attributeValue}`;
}

function weakInsert(text = "", attributeName = "", attributeValue = "") {
  if (!attributeName) return text;
  if (isExist(text, attributeName)) return text;
  return insert(text, attributeName, attributeValue);
}

function drop(text = "", attributeName = "", removeAll = false) {
  if (!attributeName) return text;
  const flags = removeAll ? "mg" : "m";
  const re = new RegExp(_attrStartPattern(attributeName) + ".*\\r?\\n?", flags);
  return text.replace(re, "").trimEnd();
}

function update(text = "", attributeName = "", attributeValue = "", updateAll = false) {
  const esc = _esc(attributeName);
  const flags = updateAll ? "mg" : "m";
  const re = new RegExp("^(\\s*)" + esc + "(\\s*:\\s*).*(\\r?\\n?)", flags);
  return text.replace(re, (match, leading, colonAndSpaces, newline) => {
    return `${leading}${attributeName}${colonAndSpaces}${attributeValue}${newline}`;
  });
}

function get(text = "", attributeName = "") {
  if (!attributeName) return null;
  const re = new RegExp(_attrStartPattern(attributeName) + "\\s*(.*)$", "m");
  const m = re.exec(text);
  if (!m) return null;
  return m[1].replace(/\r$/, "").trim();
}

function upsert(text = "", attributeName = "", attributeValue = "", updateAll = false) {
  if (isExist(text, attributeName)) {
    return update(text, attributeName, attributeValue, updateAll);
  }
  return insert(text, attributeName, attributeValue);
}

function rename(text = "", oldName = "", newName = "", renameAll = false) {
  if (!oldName || !newName) return text;
  const escOld = _esc(oldName);
  const flags = renameAll ? "mg" : "m";
  const re = new RegExp("^(\\s*)" + escOld + "(\\s*:\\s*)", flags);
  return text.replace(re, (match, leading, colonAndSpaces) => {
    return `${leading}${newName}${colonAndSpaces}`;
  });
}

function parseToObject(text = "") {
  const re = /^\s*([^:\r\n]+?)\s*:\s*(.*)$/mg;
  const obj = {};
  let m;
  while ((m = re.exec(text)) !== null) {
    const key = m[1].trim();
    const value = m[2].replace(/\r$/, "").trim();
    obj[key] = value;
  }
  return obj;
}

function serializeFromObject(obj = {}) {
  return Object.keys(obj)
    .map(k => `${k}: ${obj[k]}`)
    .join("\n");
}

module.exports = {
  isExist,
  insert,
  weakInsert,
  drop,
  update,
  get,
  upsert,
  rename,
  parseToObject,
  serializeFromObject,
};