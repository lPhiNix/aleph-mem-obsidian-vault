const src = app.vault.adapter.basePath;

const PATHS = require(src + "/Meta/config/paths.json");

function join(...segments) {
  return segments
    .map(s => String(s).replace(/^\/|\/$/g, ""))
    .filter(Boolean)
    .join("/");
}

function inthima() {
  return "";
}

function memorium() {
  const root = PATHS.ROOT;
  const memoriumObj = PATHS.MEMORIUM;      
  const memoriumRoot = memoriumObj.ROOT;    
  const journalRoot = memoriumObj.JOURNAL.ROOT;
  const journals = memoriumObj.JOURNAL.JOURNALS;

  return {
    daily: join(root, memoriumRoot, journalRoot, journals.DAILY),
    weekly: join(root, memoriumRoot, journalRoot, journals.WEEKLY),
    monthly: join(root, memoriumRoot, journalRoot, journals.MONTHLY),
    quarterly: join(root, memoriumRoot, journalRoot, journals.QUARTERLY),
    yearly: join(root, memoriumRoot, journalRoot, journals.YEARLY)
  };
}

module.exports = {
  inthima,
  memorium
};
