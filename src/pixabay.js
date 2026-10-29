const KEY = import.meta.env.VITE_PIXABAY_KEY;

// Pixabay 약관: 결과는 24시간 캐시 권장 → localStorage에 하루 저장
const TTL = 24 * 60 * 60 * 1000;

function readCache(q) {
  try {
    const raw = localStorage.getItem("pix:" + q);
    if (!raw) return null;
    const { t, v } = JSON.parse(raw);
    return Date.now() - t < TTL ? v : null;
  } catch { return null; }
}
function writeCache(q, v) {
  try { localStorage.setItem("pix:" + q, JSON.stringify({ t: Date.now(), v })); } catch {}
}

export async function getImage(q) {
  if (!KEY) return null;
  const cached = readCache(q);
  if (cached) return cached;
  try {
    const url = `https://pixabay.com/api/?key=${KEY}&q=${encodeURIComponent(q)}&image_type=photo&orientation=horizontal&safesearch=true&per_page=3`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const hit = (await res.json()).hits?.[0];
    if (!hit) return null;
    const v = { src: hit.webformatURL, user: hit.user, page: hit.pageURL };
    writeCache(q, v);
    return v;
  } catch { return null; }
}
