import type { Chapter } from '../data/missing-year';

interface RuffleAPI {
  load(options: Record<string, unknown>): Promise<void>;
  suspend(): void; resume(): void; volume: number;
}
interface RuffleElement extends HTMLElement { ruffle(): RuffleAPI }
interface RuffleGlobal { config?: Record<string, unknown>; newest?: () => { createPlayer(): RuffleElement } }
declare global { interface Window { RufflePlayer?: RuffleGlobal } }

const root = document.querySelector<HTMLElement>('[data-missing-year]');
if (root) init(root);

function init(root: HTMLElement) {
  const find = <T extends HTMLElement>(selector: string) => root.querySelector<T>(selector)!;
  const chapters: Chapter[] = JSON.parse(find('[data-chapter-data]').textContent!);
  const select = find<HTMLSelectElement>('#chapter-select');
  const theater = find<HTMLElement>('[data-theater]');
  const host = find<HTMLElement>('[data-player-host]');
  const overlay = find<HTMLElement>('[data-player-overlay]');
  const title = find<HTMLElement>('[data-player-title]');
  const status = find<HTMLElement>('[data-player-status]');
  const start = find<HTMLButtonElement>('[data-start]');
  const pause = find<HTMLButtonElement>('[data-pause]');
  const restart = find<HTMLButtonElement>('[data-restart]');
  const previous = find<HTMLButtonElement>('[data-previous]');
  const next = find<HTMLButtonElement>('[data-next]');
  const fullscreen = find<HTMLButtonElement>('[data-fullscreen]');
  const volume = find<HTMLInputElement>('[data-volume]');
  const last = find<HTMLButtonElement>('[data-last]');
  const download = find<HTMLAnchorElement>('[data-download]');
  const storageKey = 'xeno-series:missing-year:last-chapter';
  const asset = (path: string) => /^https?:\/\//.test(path) ? path : `${root.dataset.base}${path.replace(/^\/+/, '')}`;
  let index = 0;
  let player: RuffleElement | null = null;
  let paused = false;
  let generation = 0;
  let request: AbortController | null = null;
  let rufflePromise: Promise<void> | null = null;
  let lastId: string | null = null;

  function dispose() {
    generation++;
    request?.abort();
    request = null;
    try { player?.ruffle().suspend(); } catch { /* 이미 제거된 플레이어도 정리합니다. */ }
    // 고정 배포본의 disconnectedCallback이 내부 실행과 오디오를 destroy합니다.
    player?.remove();
    player = null;
    host.replaceChildren();
    paused = false;
    pause.textContent = '일시정지';
    pause.disabled = restart.disabled = volume.disabled = true;
    fullscreen.disabled = !document.fullscreenEnabled;
    start.disabled = false;
  }

  function choose(newIndex: number, updateUrl = true) {
    dispose();
    index = newIndex;
    const chapter = chapters[index];
    select.value = chapter.id;
    theater.style.aspectRatio = `${chapter.width} / ${chapter.height}`;
    find('[data-selected-chapter]').textContent = chapter.title;
    previous.disabled = index === 0;
    next.disabled = index === chapters.length - 1;
    download.hidden = !chapter.allowDownload;
    if (chapter.allowDownload) download.href = asset(chapter.file);
    overlay.hidden = false;
    title.textContent = chapter.title;
    status.textContent = '감상 시작을 누르면 원본 자료를 불러옵니다.';
    start.hidden = false;
    start.textContent = '감상 시작 →';
    try { localStorage.setItem(storageKey, chapter.id); } catch { /* 저장이 막혀 있어도 감상할 수 있습니다. */ }
    if (updateUrl) {
      const url = new URL(location.href);
      url.searchParams.set('chapter', chapter.id);
      history.replaceState(null, '', url);
    }
  }

  function loadRuffle() {
    if (window.RufflePlayer?.newest) return Promise.resolve();
    if (rufflePromise) return rufflePromise;
    window.RufflePlayer = { config: { publicPath: root.dataset.ruffleBase, polyfills: false } };
    rufflePromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = root.dataset.ruffleUrl!;
      const timeout = window.setTimeout(() => fail(), 30000);
      function fail() {
        clearTimeout(timeout);
        script.remove();
        rufflePromise = null;
        reject(new Error('Ruffle 실행 파일을 불러오지 못했습니다. 연결 상태를 확인하고 다시 시도해 주세요.'));
      }
      script.onload = () => { clearTimeout(timeout); window.RufflePlayer?.newest ? resolve() : fail(); };
      script.onerror = fail;
      document.head.append(script);
    });
    return rufflePromise;
  }

  async function play() {
    dispose();
    const token = generation;
    const chapter = chapters[index];
    request = new AbortController();
    const signal = request.signal;
    const file = asset(chapter.file);
    title.textContent = '자료를 불러오는 중입니다';
    status.textContent = '원본 파일과 플레이어를 확인하고 있습니다.';
    overlay.hidden = false;
    start.disabled = true;
    let timer = 0;
    try {
      await Promise.race([
        (async () => {
          // GitHub Pages의 HTML 404 응답도 구분하기 위해 SWF 서명을 확인합니다.
          const response = await fetch(file, { signal, headers: { Range: 'bytes=0-2' } });
          if (!response.ok) throw new Error(response.status === 404 ? 'SWF 파일을 찾을 수 없습니다. 파일이 등록되었는지 확인해 주세요.' : `자료를 불러오지 못했습니다 (HTTP ${response.status}).`);
          const reader = response.body?.getReader();
          if (!reader) throw new Error('이 브라우저에서 원본 파일을 확인할 수 없습니다.');
          let signature = '';
          try {
            while (signature.length < 3) {
              const { value, done } = await reader.read();
              if (done) break;
              signature += new TextDecoder('ascii').decode(value.slice(0, 3 - signature.length));
            }
          } finally { await reader.cancel(); }
          if (!['FWS', 'CWS', 'ZWS'].includes(signature)) throw new Error('등록된 주소가 SWF 파일이 아닙니다. 파일 경로를 확인해 주세요.');
          await loadRuffle();
          if (token !== generation) return;
          player = window.RufflePlayer!.newest!().createPlayer();
          player.setAttribute('title', chapter.title);
          host.append(player);
          await player.ruffle().load({
            url: new URL(file, location.origin).href,
            publicPath: root.dataset.ruffleBase,
            base: new URL(asset(chapter.resourceBase), location.origin).href,
            autoplay: 'on', letterbox: 'on', scale: 'showAll',
            allowFullscreen: true, allowScriptAccess: false,
            showSwfDownload: chapter.allowDownload,
            parameters: chapter.parameters ?? {},
            fontSources: (chapter.fontSources ?? []).map(asset),
            backgroundExecutionMode: 'none',
          });
          if (token !== generation || !player) return;
          player.ruffle().volume = Number(volume.value);
        })(),
        new Promise<never>((_, reject) => { timer = window.setTimeout(() => reject(new Error('불러오기에 시간이 오래 걸립니다. 연결 상태를 확인하고 다시 시도해 주세요.')), 45000); }),
      ]);
      if (token !== generation) return;
      overlay.hidden = true;
      pause.disabled = restart.disabled = volume.disabled = false;
      status.textContent = '자료를 불러왔습니다.';
    } catch (error) {
      if (token !== generation) return;
      dispose();
      overlay.hidden = false;
      title.textContent = '자료를 불러오지 못했습니다';
      status.textContent = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';
      start.hidden = false;
      start.textContent = '다시 시도 →';
    } finally { clearTimeout(timer); }
  }

  if (!chapters.length) return;
  try { lastId = localStorage.getItem(storageKey); } catch { /* 저장 기능은 선택 사항입니다. */ }
  last.hidden = !chapters.some((chapter) => chapter.id === lastId);
  const requested = new URLSearchParams(location.search).get('chapter');
  const requestedIndex = chapters.findIndex((chapter) => chapter.id === requested);
  choose(requestedIndex >= 0 ? requestedIndex : 0, false);
  if (requested && requestedIndex < 0) status.textContent = '요청한 장을 찾을 수 없습니다. 아래 장 선택에서 다시 골라 주세요.';
  select.addEventListener('change', () => choose(chapters.findIndex((chapter) => chapter.id === select.value)));
  start.addEventListener('click', () => void play());
  restart.addEventListener('click', () => void play());
  previous.addEventListener('click', () => { if (index > 0) choose(index - 1); });
  next.addEventListener('click', () => { if (index < chapters.length - 1) choose(index + 1); });
  last.addEventListener('click', () => { const saved = chapters.findIndex((chapter) => chapter.id === lastId); if (saved >= 0) choose(saved); });
  pause.addEventListener('click', () => {
    if (!player) return;
    if (paused) player.ruffle().resume(); else player.ruffle().suspend();
    paused = !paused;
    pause.textContent = paused ? '재개' : '일시정지';
  });
  volume.addEventListener('input', () => { if (player) player.ruffle().volume = Number(volume.value); });
  fullscreen.addEventListener('click', () => {
    const action = document.fullscreenElement ? document.exitFullscreen() : theater.requestFullscreen();
    void action.catch(() => { find('[data-selected-chapter]').textContent = '이 브라우저에서는 전체 화면을 사용할 수 없습니다.'; });
  });
  window.addEventListener('pagehide', dispose);
  window.addEventListener('pageshow', (event) => { if (event.persisted) choose(index, false); });
}
