const SAVE_KEY = 'shapeSummonerSave_v3';

const defaultSave = {
  className: null,
  level: 1,
  xp: 0,
  xpToNext: 100,
};

export function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return { ...defaultSave };
    const data = JSON.parse(raw);
    return { ...defaultSave, ...data };
  } catch {
    return { ...defaultSave };
  }
}

export function saveProgress(saveData) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
}
