# Xeno Series

제노 시리즈 소개·한글패치·자료를 연결하는 한국어 팬 포털입니다. Astro + TypeScript + CSS로 모든 주요 내용을 정적 HTML로 생성합니다.

- 저장소: https://github.com/poketony/Xeno-Portal
- 현재 작업 및 배포 브랜치: `main`
- 실제 사이트: https://poketony.github.io/Xeno-Portal/index.html
- **GitHub Actions 빌드·Pages 배포 완료.** 초기 빌드 `96a7817`의 설치·타입 검사·테스트·정적 빌드·배포 성공을 확인했습니다. 실제 한글패치와 미싱 이어 원본 SWF는 아직 등록되지 않았습니다.
- 제노기어스는 단일 작품 전용 화면이며, [제노블레이드 3 공식 홈페이지](https://www.nintendo.com/kr/switch/az3ha/)를 비롯한 한국닌텐도 작품 페이지의 큰 이미지와 간결한 소개 구성을 참고했습니다. 게임 상세는 짧은 소개문과 주요 특징, 패치·자료·판본 정보로 구성합니다. 제노사가는 PS2 에피소드 I·II·III를 크게, 본편 사이의 외전은 작은 카드로 배치합니다. 제노블레이드 배너·공통 메뉴는 [한국닌텐도 공식 시리즈 홈페이지](https://www.nintendo.com/kr/xenoblade/index.html)로 바로 연결합니다. 메인은 제공된 스케치의 사선 배너 구도를 유지하며, 제공된 세 게임 이미지를 배치합니다. 시리즈 화면의 “작품 둘러보기” 제목과 검색·필터는 표시하지 않습니다.

## 1. 프로젝트 구성

```text
src/
  data/
    content.mjs       화면 문구 편집: 메인·역사·시리즈·작품·안내·버튼
    site.mjs          이름·소개·실제 Pages 주소·저장소·공식 홈페이지
    catalog.ts        시리즈·작품·판본·출처
    showcase.ts       배경 슬라이드·타이틀 로고·작품별 패치 바로가기
    patches.ts        패치 및 모든 배포 링크의 단일 원본
    resources.ts      관련 자료의 단일 원본
    missing-year.ts   실제 감상 장·SWF·기준 폴더·화면비 설정
  components/         정적 작품 목록과 검색·필터
  layouts/            공통 탐색·메타 정보
  pages/              메인·시리즈·작품·자료·감상·안내·404
  scripts/            필요한 페이지에서만 실행되는 플레이어
  styles/global.css   공통 색상·여백 변수와 반응형 스타일
  styles/titles.css   제노기어스 전용 화면·제노사가 본편/외전 구성
public/
  images/             제공된 로고·게임 이미지와 포털용 SVG 장식
  vendor/ruffle/      빌드 때 공식 패키지 전체 복사 (Git 제외)
scripts/              Ruffle 복사·빌드 결과 검증
tests/                검색·정렬·데이터 연결 검증
.github/workflows/deploy.yml
```

작품 URL은 `/works/작품ID/`, 자료 URL은 `/resources/자료ID/`, 시리즈 URL은 `/series/시리즈ID/`입니다. 제노블레이드 탭은 외부 공식 사이트로 연결하며, 기존 작품 데이터는 전체 검색에서도 참고할 수 있습니다.

`/series/xenogears/`와 `/works/xenogears/`는 같은 단일 작품 소개 컴포넌트를 사용합니다. 작품 목록·검색 필터를 표시하지 않으며 대표 주소는 `/works/xenogears/`로 통일합니다. 패치·판본·자료는 다른 작품과 같은 데이터를 참조합니다.

시리즈 화면 개편: 제노기어스·제노사가는 큰 배경, 짧은 소개와 작품별 한글패치 바로가기를 한 화면에 표시합니다. 제노사가는 설명 아래에 부제를 포함한 본편 라벨 3개를 놓고, 외전은 각 라벨 아래의 작은 직사각형 버튼으로 표시합니다. 라벨 그라데이션은 I Reloaded·II·III의 로마 숫자 색상을 샘플링했으며 출처는 사이트 안내에 기록합니다. 슬라이드쇼는 원본 비율을 유지하면서 이미지 전체가 화면 안에 들어오는 최대 크기로 표시합니다. 관련 자료·기종과 판본·별도 패치 구역을 제거하고 푸터를 숨깁니다. 좌상단 홈 링크는 제공된 Xeno 전체 로고를 사용합니다. 배포는 `main`의 GitHub Pages 워크플로에서 진행합니다.

슬라이드쇼: 저장소 루트의 `제노기어스/` 폴더에서 PNG를, `제노사가1/` 폴더에서 PNG·GIF를 `src/data/showcase.ts`로 불러옵니다. 파일명 오름차순으로 6초마다 전환하고, 이전·다음·일시정지를 제공합니다. GIF는 정지 이미지로 변환하지 않고 원본 애니메이션을 유지합니다. 원본 파일과 이름을 유지하며 빌드된 이미지 URL은 Astro가 생성합니다. 제노사가 1편 이미지는 `/works/xenosaga-1/`에만 사용하고, 제노사가 시리즈 화면과 다른 작품의 배경은 별도로 유지합니다.

파이드 파이퍼: `파이드파이퍼/`의 제공 이미지 6장을 홍보 이미지 → 게임 내 타이틀 → `xenopp-1`~`4` 순으로 표시합니다. 전용 작품 화면에서 소개와 한글패치 바로가기를 왼쪽에, 전체 비율을 유지한 이미지를 오른쪽에 배치합니다. 작은 게임 화면은 최대 2배까지 표시하며 모바일에서는 소개 아래에 놓습니다. 소개 문구는 `content.mjs`의 `workText['xenosaga-pied-piper']`에서 수정합니다.

제노사가 II·III: `제노사가2/`, `제노사가3/`의 PNG를 작품별 배경으로 불러옵니다. 배포 링크가 없는 두 작품은 모래시계가 붙은 비활성 `한글패치 제작 중` 버튼을 표시합니다. 작품 선택 버튼은 왼쪽으로 향한 짙은 파란색 라벨이며, 게임 제목의 부제는 `[` 앞에서 줄바꿈합니다. 소개문에 직접 입력한 줄바꿈도 유지합니다. 시리즈 화면의 본편 라벨은 마우스·키보드 포커스에 맞춰 확대되며 동작 줄이기 설정을 존중합니다.

## 2. 실행 환경

- Node.js **24.19.0** (`.node-version`, Node 24 계열)
- pnpm **11.25.0** (`packageManager`에 고정)
- Astro **7.4.4**, TypeScript **5.9.3**, `@astrojs/check` **0.9.12**
- 공식 `@ruffle-rs/ruffle` **0.7.1**
- `pnpm-lock.yaml`을 커밋해 Windows와 Actions의 Linux에서 같은 버전을 설치합니다. 운영체제별 네이티브 선택 의존성은 pnpm이 처리합니다.

## 3. 설치·실행·검증

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm check
pnpm test
pnpm build
pnpm preview
```

로컬 개발: `http://127.0.0.1:4321/Xeno-Portal/`. 미리보기 주소는 명령 출력의 포트를 따릅니다. `pnpm build`는 Ruffle의 JS·WASM·라이선스·소스맵을 빠짐없이 복사하고 정적 HTML을 생성한 뒤 내부 링크와 자원 경로를 검사합니다. 빌드 전에 로컬 Ruffle 자원이 필요하면 `node scripts/copy-ruffle.mjs`를 한 번 실행합니다.

제한된 환경에서 Astro가 사용자 설정 폴더에 접근하지 못하면 현재 터미널에서 텔레메트리를 끄고 실행합니다.

```powershell
$env:ASTRO_TELEMETRY_DISABLED = '1'
pnpm check
pnpm build
```

## 4. GitHub Pages 배포

1. 변경 내용을 검토한 뒤 `main`에 커밋·푸시합니다.
2. 저장소 **Settings → Pages → Build and deployment → Source → GitHub Actions**를 선택합니다. 이 저장소 설정은 운영자가 직접 변경해야 합니다.
3. `main` 푸시 또는 **Actions → Deploy to GitHub Pages → Run workflow**로 실행합니다.
4. 빌드 작업이 잠금 파일로 설치하고 타입 검사·테스트·정적 빌드를 수행합니다. `dist/`만 업로드합니다.
5. 배포 작업은 `pages: write`, `id-token: write`, `github-pages` 환경으로 배포합니다. 배포 결과 URL은 Actions의 환경 링크에서 확인합니다.

실제 원격 저장소 `poketony/Xeno-Portal`을 확인해 `src/data/site.mjs`에 `origin: https://poketony.github.io`, `base: /Xeno-Portal`을 설정했습니다. Astro 설정과 내부 링크·이미지·Ruffle·SWF는 같은 설정을 참조합니다. 저장소나 도메인을 바꾸면 이 파일을 수정하세요. 모든 내부 페이지는 디렉터리별 `index.html`로 생성하므로 직접 접속·새로고침이 가능합니다. 서버 렌더링이나 별도의 백엔드는 사용하지 않습니다.

워크플로 참고: [Astro 공식 배포 안내](https://docs.astro.build/en/guides/deploy/github/), [GitHub 공식 사용자 지정 워크플로 안내](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages). 저장소 관리·권한·브랜치 보호 설정은 이 작업에서 변경하지 않았습니다.

사용자 지정 도메인이 없다면 **Settings → Pages → Custom domain은 비워 두세요.** 이 칸에 주소를 입력하는 것만으로 도메인이 생성되지는 않습니다. 2026-10-30에 DNS에서 조회되지 않는 `poketony.xeno.portal` 설정을 사용자 승인으로 제거하고, 기본 Pages 주소와 HTTPS 강제 적용을 확인했습니다. 향후 실제 보유한 도메인을 연결할 때는 DNS와 Astro의 `origin`·`base`를 함께 맞춰야 합니다.

## 5. 콘텐츠 갱신

### 화면 문구는 한 파일에서 편집

**`src/data/content.mjs`가 화면 문구의 편집 원본입니다.** 이 파일의 값을 바꾸면 해당 화면에 바로 반영됩니다. 별도로 페이지 파일의 같은 문장을 찾아 수정할 필요가 없습니다.

- `homeText`, `siteText`: 메인 제목·소개·배너 주변 문구와 사이트 설명
- `historyText`: 탄생 연표·제작진·특징·인터뷰/사진 출처
- `seriesText`, `workText`, `lineupText`: 시리즈 소개·작품명·줄거리·주요 특징·제노사가 부제와 DS 라벨
- `aboutText`, `resourceText`, `searchText`, `notFoundText`: 안내·자료·검색·404 화면
- `commonText`, `navigationText`, `catalogText`, `workPageText`, `resourcePageText`: 메뉴·버튼·보조 설명
- `watchText`, `playerText`, `slideshowText`: 미싱 이어 감상과 슬라이드쇼 조작 문구
- `koreanSupportText`, `slideAltText`: 지원 상태 표시와 이미지 대체 설명

따옴표 안의 문장을 수정하고, 왼쪽 키·작품 ID는 유지하세요. `\n`은 제목 줄바꿈이며 `{count}`, `{version}`, `{status}`, `{number}`는 실제 값이 들어갈 자리입니다. 일반 문구에는 HTML을 넣지 않습니다. 출처 링크와 사진 정보도 `historyText` 안에서 함께 관리합니다. 작품 연결·기종·발매일·판본 등 사실 데이터는 계속 `catalog.ts`, 배경 이미지와 패치 주소는 `showcase.ts`에서 관리합니다.

수정 후 `pnpm check`, `pnpm test`, `pnpm build`로 확인합니다. 메인의 역사 구역은 세 시리즈 배너 바로 아래, ABOUT THIS ARCHIVE 바로 위에 있습니다. 공식 인터뷰와 직접 인터뷰 10개를 근거로 작성했으며, 해석에 해당하는 특징 소개는 감상 관점으로 표시했습니다. 인물 사진은 MONOLITHSOFT와 PROCYON STUDIO의 공개 페이지에서 가져왔고 사진 아래 원문을 연결했습니다. 사가 소라야는 신원을 확인할 사진을 찾지 못해 이름 패널을 사용합니다.

### 작품과 판본

새 작품의 문구는 `src/data/content.mjs`의 `workText`에 추가하고, `src/data/catalog.ts`의 `works`에서 같은 ID로 연결합니다. 분류, 관련 작품 ID와 공식 출처는 `catalog.ts`에 추가합니다. 해당 시리즈와 전체 검색 및 상세 페이지에 자동 반영됩니다.

같은 작품의 이식·리마스터는 `editions`에 별도의 ID로 등록합니다. 독립적인 재구성 작품은 별도 작품으로 등록하고 `related`로 연결합니다. 판본마다 `workId`, 기종, 지역, ISO 날짜, 공식 한국어 지원과 출처를 기록합니다. 발매일 미확인은 `null`, 한국어 지원 미확인은 `unverified`로 유지하세요. 한국어 제목이 있다는 이유로 모든 지역·판본에 한국어 지원을 일괄 적용하면 안 됩니다. 출시 정보가 추가 확인된 작품만 등록하며 현재 목록의 완전성을 보장하지 않습니다.

제노사가의 화면 배치는 같은 파일의 `xenosagaLineup`에서 관리합니다. 본편 I 뒤에는 프릭스, II 뒤에는 **파이드 파이퍼 → DS판 I·II → 미싱 이어**, 마지막에 본편 III를 배치합니다. 외전 묶음은 최초 발매·공개 순이며 이후 이식판의 날짜로 순서를 바꾸지 않습니다. 제노사가 안에서 검색·필터를 적용해도 이 계층을 유지하고, 전체 작품 검색에서는 발매일 정렬을 제공합니다.

공개월까지만 확인한 자료는 `releaseDate: 'YYYY-MM'`로 등록할 수 있습니다. 미싱 이어는 당시 공개 기록에 따라 `2006-05`까지만 표시하며 정확한 날짜를 추정하지 않습니다. 파이드 파이퍼의 2004-07-14 최초 배포는 당시 GAME Watch 보도, DS판은 모노리스소프트 공식 목록을 출처로 연결했습니다. 미싱 이어의 공개월은 당시 팬 사이트 Eiwigkeit의 기록을 출처로 구분했습니다.

대표 이미지는 해당 작품 데이터에 `image: { src: 'images/실제파일.webp', alt: '이미지 설명', source: { title: '이미지 출처', url: 'https://실제-출처-주소' } }`를 추가하면 목록과 상세 화면에 함께 반영됩니다. 메인 배너에는 운영자 제공 이미지를 사용합니다. 해당 이미지는 `series`의 `artwork`에 기록하며 제노기어스 소개에서도 재사용합니다. 나머지 작품 목록은 포털용 SVG 장식을 사용합니다. 새 이미지는 `public/images/`에 두고 출처와 권리 정보를 함께 기록합니다.

### 한글패치

`src/data/patches.ts`의 `patches`에 `Patch` 형식으로 등록합니다. `workId`와 `editionIds`를 실제 대상에 맞게 지정하세요. 대상 판본에 기종·지역을 기록하므로 다른 판본용 패치와 혼동하지 않습니다.

```ts
{
  id: '고유-패치-id', workId: 'xenosaga-1', editionIds: ['saga1-jp'],
  name: '실제 패치명', author: '실제 제작자',
  // version, releaseDate, fileSize는 제공된 경우에만 입력
  // distributionUrl, downloadUrl, mirrors는 실제 HTTPS 배포 주소만 입력
  instructions: ['실제 적용 안내'], changes: [], knownIssues: [],
  // originalFiles: [{ name: '원본 파일명', algorithm: 'SHA-256', hash: '제공된 해시' }]
}
```

이 예시는 배포 데이터가 아닙니다. 파일 용량이 크면 GitHub Releases나 기존 배포처에 두고 실제 링크만 입력하세요. 다운로드 링크가 없으면 다운로드 버튼을 표시하지 않습니다. 패치 관련 값·링크는 다른 화면에 복사하지 말고 이 배열에서 참조하세요. 등록된 패치의 `changes`를 갱신하면 작품 상세 변경 사항에 표시됩니다.

### 자료

`src/data/resources.ts`에 제목·설명·관련 작품 ID·유형·썸네일·주소 또는 파일·출처·조작 안내·다운로드 허용 여부를 등록합니다. 파일 경로는 `public/`를 제외하고 지정합니다. `downloadable: false`이면 원본 다운로드를 표시하지 않습니다. 미싱 이어의 작품과 자료는 같은 감상 화면으로 연결됩니다.

### 공통 설정

이름·소개·주소·외부 링크는 `src/data/site.mjs`, 색상·간격은 `src/styles/global.css`의 `:root`에서 수정합니다. 외부 주소는 `https://`를 사용하세요. `withBase()`는 외부 HTTPS 주소를 유지하고 로컬 경로에는 프로젝트 기본 경로를 붙입니다.

## 6. 미싱 이어 SWF 등록

**원본은 아직 제공되지 않았습니다. 장 수나 SWF 수를 추정해 가짜 장을 만들지 않았습니다.**

1. 원본 폴더 전체의 파일 목록을 먼저 확인하세요. 로더·메뉴·추가 SWF·XML·이미지·음성·폰트의 관계와 요청 경로를 조사합니다. 한 장이 여러 파일을 읽거나 하나의 로더가 여러 장을 담당할 수 있습니다.
2. 재배포 가능한 실제 원본을 `public/media/missing-year/` 아래에 두되 **원래 파일명과 디렉터리 관계를 보존**합니다. 대소문자도 보존하세요. Windows에서는 동작해도 Linux/Pages에서는 경로 대소문자가 다르면 실패합니다.
3. 실제 한 장부터 `src/data/missing-year.ts`에 등록합니다.

```ts
// 등록 방법 예시이며 실제 장 제목·파일명·화면 크기가 아닙니다.
{
  id: '실제-장-id', title: '실제 장 제목', order: 1,
  file: 'media/missing-year/원래폴더/실제파일.swf',
  resourceBase: 'media/missing-year/원래폴더/',
  width: 800, height: 600, // 원본 SWF의 실제 크기로 교체
  allowDownload: false,
  parameters: {}, // 로더에 필요한 경우에만 실제 FlashVars 입력
  fontSources: [], // 필요한 경우 배포 가능한 폰트 파일 경로
}
```

4. `/watch/missing-year/?chapter=실제-장-id`로 직접 들어가 `감상 시작`을 누릅니다. 사용자 조작 전에는 Ruffle을 로드하지 않습니다. 문자·버튼·음성·BGM·장면 전환·부속 파일 요청을 먼저 확인한 뒤 나머지 장을 연결하세요.
5. 장 변경·페이지 이동 시 이전 플레이어와 음성이 정리되는지 확인합니다. 장 선택 URL, 이전·다음, 일시정지·재개, 음량, 다시 시작, 전체 화면, 마지막 장 열기를 확인하세요.
6. 한글·일본어가 깨지면 내장 글꼴 여부와 실제 글꼴 이름을 조사하고 `fontSources`로 필요한 폰트를 공급합니다. 정확한 이름 매핑이 필요하면 검증 후 Ruffle의 `defaultFonts` 설정을 추가하세요. 원본이 외부 자원을 참조하면 해당 주소의 접근 가능 여부와 CORS도 확인해야 합니다.

Ruffle 자체 파일은 `/Xeno-Portal/vendor/ruffle/`의 `publicPath`, 원본 부속 파일은 각 장의 `resourceBase`를 전달하는 `base`로 구분합니다. 원본 폴더에는 저장소 기본 경로를 직접 넣지 마세요. 등록 시 실제 화면비를 입력하며 Ruffle `showAll`/letterbox로 비율을 유지합니다. 정확한 장면 복원·재생시간·탐색 막대는 원본의 지원이 확인되지 않아 구현하지 않았습니다. 현재는 마지막으로 연 장 ID만 로컬 저장소에 남깁니다.

## 7. Ruffle 버전과 API 확인

- 고정 버전: **`@ruffle-rs/ruffle@0.7.1`**, 공식 npm 패키지의 자체 호스팅 배포본.
- `scripts/copy-ruffle.mjs`에서 버전을 검사하고 **패키지 전체**를 복사합니다. JS 청크·두 WASM·라이선스가 함께 포함됩니다. 단일 `ruffle.js` 파일만 복사하지 마세요.
- `0.7.1`에 포함된 `ruffle.js.map`의 공식 소스 `public/config/default.js`, `internal/player/impl_v1.js`, `ruffle-player-element.js`에서 실제 API를 확인했습니다.
- 사용 API: `newest().createPlayer()`, `player.ruffle().load()`, `suspend()`, `resume()`, `volume`. 플레이어 DOM 제거 시 `disconnectedCallback()`에서 내부 `destroy()`가 실행됩니다. 공개 API에 없는 `destroy()`를 직접 호출하지 않습니다.
- [공식 JavaScript API](https://ruffle.rs/js-docs/master/), [자체 호스팅 안내](https://github.com/ruffle-rs/ruffle/wiki/Using-Ruffle#web), [공식 저장소](https://github.com/ruffle-rs/ruffle). master 문서는 바뀔 수 있으므로 버전을 올릴 때 해당 패키지의 API도 다시 확인하세요.
- **실제 미싱 이어 한 장 재생 검증: 미실시 (원본 미제공).** 호환성·문자·음성·타이밍·화면비는 확인되지 않았습니다.

## 8. 출처·검증·남은 항목

콘텐츠의 공식 출처는 각 작품과 판본 데이터에 기록하고 화면에서 연결합니다. 제공된 로고는 원본 비율로 사용합니다. 손그림 파일은 저장소에 복사하지 않았습니다. 운영자 제공 게임 이미지 세 장을 원본 그대로 복사해 사용하고, 파일 출처를 사이트 안내에 기록했습니다. 개별 작품 목록의 장식에는 포털용 SVG를 사용합니다. Google Fonts는 외부에서 로드하며 기기 기본 글꼴 대체를 제공합니다.

검증 명령과 관찰 결과는 `docs/verification.md`에서 관리합니다. `pnpm test`는 제목 정규화·필터 조합·미확인 날짜 정렬·데이터 ID와 참조 관계를 검사합니다. 빌드는 생성된 HTML의 모든 내부 링크·이미지·스크립트 경로와 Ruffle 파일 포함 여부를 검사합니다.

남은 자료와 확인 사항:

- 실제 패치 제작자·대상 판본·버전·배포일·용량·다운로드·미러·적용법·문제·해시.
- 미싱 이어 원본 SWF와 모든 부속 파일, 실제 장 구성·원본 화면 크기·배포 허용 범위.
- 작품별 공식 이미지와 사용 출처. 미확인 판본별 한국어 지원 정보.
- 실제 기기에서의 미싱 이어 호환성·폰트·음성·전체 화면·외부 자원 CORS.
- 실제 미싱 이어 원본을 등록한 뒤 GitHub Pages 환경에서 각 장을 재생하는 검증.

실제 배포 여부는 로컬 빌드 성공과 구분해 기록하세요. 빌드 성공만으로 배포 성공을 보고하면 안 됩니다.
