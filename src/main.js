import "./style.css";
import { ITEMS, CATEGORIES } from "./data.js";
import { getImage } from "./pixabay.js";
import { supabase, configured } from "./supabase.js";

const app = document.getElementById("app");
const state = { cat: "전체", search: "", user: null, favs: new Set(), onlyFavs: false, authMode: "login" };

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

app.innerHTML = `
  <header class="top">
    <h1>🍊 제주 IP 갤러리</h1>
    <div id="authArea"></div>
  </header>
  <section class="hero"><p>돌하르방부터 해녀, 감귤까지 — 제주를 대표하는 문화 IP 모음</p></section>
  <div class="tools">
    <input id="search" type="search" placeholder="이름·설명 검색" />
    <div id="cats" class="cats"></div>
    <label class="favOnly"><input id="onlyFavs" type="checkbox" /> 내 찜만 보기</label>
  </div>
  <main id="grid" class="grid"></main>
  <footer>이미지 출처: <a href="https://pixabay.com" target="_blank" rel="noopener">Pixabay</a></footer>
  <dialog id="authDlg">
    <form id="authForm" method="dialog">
      <h2 id="authTitle">로그인</h2>
      <input id="email" type="email" placeholder="이메일" required autocomplete="email" />
      <input id="pw" type="password" placeholder="비밀번호 (6자 이상)" minlength="6" required autocomplete="current-password" />
      <p id="authMsg" class="msg"></p>
      <button id="authSubmit" type="submit" class="btn primary">로그인</button>
      <button id="authSwitch" type="button" class="link">계정이 없나요? 회원가입</button>
      <button id="authClose" type="button" class="link">닫기</button>
    </form>
  </dialog>`;

const $ = (id) => document.getElementById(id);

/* ---------- 목록 ---------- */
function visible() {
  const s = state.search.trim().toLowerCase();
  return ITEMS.filter(
    (i) =>
      (state.cat === "전체" || i.category === state.cat) &&
      (!s || i.name.toLowerCase().includes(s) || i.desc.toLowerCase().includes(s)) &&
      (!state.onlyFavs || state.favs.has(i.id))
  );
}

function renderCats() {
  $("cats").innerHTML = CATEGORIES.map((c) => {
    const n = c === "전체" ? ITEMS.length : ITEMS.filter((i) => i.category === c).length;
    return `<button class="chip ${c === state.cat ? "on" : ""}" data-cat="${esc(c)}">${esc(c)} ${n}</button>`;
  }).join("");
}

function renderGrid() {
  const list = visible();
  $("grid").innerHTML = list.length
    ? list
        .map(
          (i) => `
    <article class="card">
      <div class="img" data-q="${esc(i.q)}"><span>${esc(i.name)}</span></div>
      <div class="body">
        <span class="tag">${esc(i.category)}</span>
        <h3>${esc(i.name)}</h3>
        <p>${esc(i.desc)}</p>
        <button class="btn fav ${state.favs.has(i.id) ? "on" : ""}" data-id="${i.id}">${state.favs.has(i.id) ? "♥ 찜함" : "♡ 찜하기"}</button>
      </div>
    </article>`
        )
        .join("")
    : `<p class="empty">조건에 맞는 항목이 없습니다.</p>`;
  document.querySelectorAll(".img").forEach(async (el) => {
    const img = await getImage(el.dataset.q);
    if (!img) return;
    el.innerHTML = `<img src="${esc(img.src)}" alt="${esc(el.dataset.q)}" loading="lazy" /><a class="credit" href="${esc(img.page)}" target="_blank" rel="noopener">© ${esc(img.user)}</a>`;
  });
}

function render() {
  renderCats();
  renderGrid();
}

/* ---------- 인증 ---------- */
function renderAuth() {
  if (!configured) {
    $("authArea").innerHTML = `<span class="note">Supabase 환경변수가 없어 로그인이 꺼져 있습니다</span>`;
    return;
  }
  $("authArea").innerHTML = state.user
    ? `<span class="who">${esc(state.user.email)}</span><button id="logout" class="btn">로그아웃</button>`
    : `<button id="openLogin" class="btn primary">로그인 / 회원가입</button>`;
}

function setAuthMode(mode) {
  state.authMode = mode;
  const login = mode === "login";
  $("authTitle").textContent = login ? "로그인" : "회원가입";
  $("authSubmit").textContent = login ? "로그인" : "가입하기";
  $("authSwitch").textContent = login ? "계정이 없나요? 회원가입" : "이미 계정이 있나요? 로그인";
  $("pw").autocomplete = login ? "current-password" : "new-password";
  $("authMsg").textContent = "";
}

async function loadFavs() {
  state.favs = new Set();
  if (state.user) {
    const { data } = await supabase.from("favorites").select("item_id");
    (data || []).forEach((r) => state.favs.add(r.item_id));
  }
  render();
}

async function onSession(session) {
  state.user = session?.user ?? null;
  renderAuth();
  await loadFavs();
}

$("authForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = $("email").value.trim();
  const password = $("pw").value;
  const msg = $("authMsg");
  msg.textContent = "처리 중...";
  const { data, error } =
    state.authMode === "login"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
  if (error) {
    msg.textContent = error.message;
    return;
  }
  if (state.authMode === "signup" && !data.session) {
    msg.textContent = "가입 완료! 메일함에서 인증 링크를 눌러 주세요.";
    return;
  }
  $("authDlg").close();
});
$("authSwitch").onclick = () => setAuthMode(state.authMode === "login" ? "signup" : "login");
$("authClose").onclick = () => $("authDlg").close();

$("authArea").addEventListener("click", async (e) => {
  if (e.target.id === "openLogin") {
    setAuthMode("login");
    $("authDlg").showModal();
  }
  if (e.target.id === "logout") await supabase.auth.signOut();
});

/* ---------- 이벤트 ---------- */
$("search").addEventListener("input", (e) => {
  state.search = e.target.value;
  renderGrid();
});
$("onlyFavs").addEventListener("change", (e) => {
  state.onlyFavs = e.target.checked;
  renderGrid();
});
$("cats").addEventListener("click", (e) => {
  const b = e.target.closest("[data-cat]");
  if (b) {
    state.cat = b.dataset.cat;
    render();
  }
});
$("grid").addEventListener("click", async (e) => {
  const b = e.target.closest(".fav");
  if (!b) return;
  if (!configured || !state.user) {
    if (!configured) return;
    setAuthMode("login");
    $("authMsg").textContent = "찜하려면 로그인이 필요합니다.";
    $("authDlg").showModal();
    return;
  }
  const id = b.dataset.id;
  if (state.favs.has(id)) {
    const { error } = await supabase.from("favorites").delete().eq("item_id", id);
    if (!error) state.favs.delete(id);
  } else {
    const { error } = await supabase.from("favorites").insert({ item_id: id });
    if (!error) state.favs.add(id);
  }
  renderGrid();
});

/* ---------- 시작 ---------- */
render();
renderAuth();
if (configured) {
  supabase.auth.getSession().then(({ data }) => onSession(data.session));
  supabase.auth.onAuthStateChange((_ev, session) => onSession(session));
}
