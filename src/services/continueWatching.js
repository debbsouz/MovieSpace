const KEY = 'continue_watching';

export function getContinueWatching() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addContinueWatching(item) {
  if (!item?.id) return;

  try {
    const current = getContinueWatching();

    // remove duplicado e coloca no topo (estilo Netflix)
    const next = [
      item,
      ...current.filter((x) => String(x.id) !== String(item.id) || x.media_type !== item.media_type),
    ].slice(0, 10);

    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // se falhar, só ignora
  }
}