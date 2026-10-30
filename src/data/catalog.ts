export type SeriesId = 'xenogears' | 'xenosaga' | 'xenoblade';
export interface Source { title: string; url: string }
export interface Series {
  id: SeriesId; name: string; korean: string; number: string;
  tagline: string; description: string; motif: string;
}
export interface Work {
  id: string; series: SeriesId; title: string; english: string; japanese: string;
  aliases: string[]; kind: '본편' | '외전' | '확장 콘텐츠' | '재구성' | '영상';
  summary: string; features: string[]; related: string[]; sources: Source[];
  image?: { src: string; alt: string; source: Source };
}
export interface Edition {
  id: string; workId: string; name: string; platform: string; region: string;
  releaseDate: string | null; korean: 'supported' | 'unsupported' | 'unverified';
  note?: string; sources: Source[];
}
export const monolith: Source = { title: 'MONOLITHSOFT 공식 작품 목록 (일본 발매 정보)', url: 'https://www.monolithsoft.co.jp/games/' };
const squareArchive: Source = { title: 'SQUARE ENIX 제노기어스 아카이브 (일본 발매 정보)', url: 'https://www.jp.square-enix.com/archive/xenogears/' };
const nintendo = (code: string, title: string): Source => ({ title, url: `https://www.nintendo.com/kr/switch/${code}/index.html` });

export const series: Series[] = [
  { id: 'xenogears', name: 'Xenogears', korean: '제노기어스', number: '01', tagline: '모든 이야기의 시작', description: '거대한 기어와 인간의 기억이 교차하는 세계. 제노기어스의 작품 정보와 한글패치, 관련 기록을 살펴보세요.', motif: 'GEAR / ORIGIN' },
  { id: 'xenosaga', name: 'Xenosaga', korean: '제노사가', number: '02', tagline: '별의 바다를 건너는 서사', description: '우주를 무대로 펼쳐지는 제노사가. 에피소드와 외전, 그리고 에피소드 II와 III 사이의 미싱 이어를 만나보세요.', motif: 'SPACE / MEMORY' },
  { id: 'xenoblade', name: 'Xenoblade', korean: '제노블레이드', number: '03', tagline: '새로운 세계를 향한 여정', description: '끝없이 펼쳐지는 대지, 그 위를 살아가는 사람들. 제노블레이드의 본편과 확장 콘텐츠, 여러 판본을 둘러보세요.', motif: 'WORLD / FUTURE' },
];

export const works: Work[] = [
  { id: 'xenogears', series: 'xenogears', title: '제노기어스', english: 'Xenogears', japanese: 'ゼノギアス', aliases: ['제노 기어스'], kind: '본편', summary: '소년 페이의 여정과 거대 인간형 병기 기어를 중심으로 펼쳐지는 RPG입니다.', features: ['인물과 기어를 오가는 전투', '기억과 세계의 비밀을 따라가는 이야기'], related: [], sources: [squareArchive] },
  { id: 'xenosaga-1', series: 'xenosaga', title: '제노사가 에피소드 I', english: 'Xenosaga Episode I: Der Wille zur Macht', japanese: 'ゼノサーガ エピソードI 力への意志', aliases: ['힘에의 의지', '힘으로의 의지', '제노사가 1', 'KOS-MOS'], kind: '본편', summary: '시온과 KOS-MOS를 중심으로 시작되는 제노사가의 첫 번째 에피소드입니다.', features: ['우주를 배경으로 한 RPG', '에피소드로 이어지는 이야기'], related: ['xenosaga-2', 'xenosaga-1-2'], sources: [monolith] },
  { id: 'xenosaga-freaks', series: 'xenosaga', title: '제노사가 프릭스', english: 'Xenosaga Freaks', japanese: 'ゼノサーガ フリークス', aliases: ['프리크스'], kind: '외전', summary: '제노사가의 세계와 등장인물을 다루는 버라이어티 소프트웨어입니다.', features: ['본편과 별도로 즐기는 외전'], related: ['xenosaga-1'], sources: [monolith] },
  { id: 'xenosaga-2', series: 'xenosaga', title: '제노사가 에피소드 II', english: 'Xenosaga Episode II: Jenseits von Gut und Böse', japanese: 'ゼノサーガ エピソードII 善悪の彼岸', aliases: ['선악의 피안', '제노사가 2'], kind: '본편', summary: '에피소드 I의 이야기를 잇는 두 번째 에피소드입니다.', features: ['이전 에피소드에서 이어지는 서사'], related: ['xenosaga-1', 'missing-year', 'xenosaga-3'], sources: [monolith] },
  { id: 'xenosaga-1-2', series: 'xenosaga', title: '제노사가 I·II', english: 'Xenosaga I & II', japanese: 'ゼノサーガI・II', aliases: ['제노사가 DS', 'Xenosaga 1 2'], kind: '재구성', summary: '에피소드 I과 II를 Nintendo DS에서 만날 수 있는 별도 작품입니다.', features: ['Nintendo DS용 작품', '에피소드 I·II와 구분되는 판본 정보'], related: ['xenosaga-1', 'xenosaga-2'], sources: [monolith] },
  { id: 'missing-year', series: 'xenosaga', title: '제노사가 미싱 이어', english: 'Xenosaga Episode II to III: A Missing Year', japanese: '', aliases: ['미싱이어', 'A Missing Year', '미씽 이어'], kind: '영상', summary: '에피소드 II와 III 사이를 잇는 이야기입니다. 전용 감상 페이지에서 장별로 감상할 수 있도록 준비했습니다.', features: ['에피소드 II 이후의 내용을 다룹니다', 'Flash 원본 자료를 위한 전용 감상 화면'], related: ['xenosaga-2', 'xenosaga-3'], sources: [] },
  { id: 'xenosaga-3', series: 'xenosaga', title: '제노사가 에피소드 III', english: 'Xenosaga Episode III: Also sprach Zarathustra', japanese: 'ゼノサーガ エピソードIII ツァラトゥストラはかく語りき', aliases: ['차라투스트라는 이렇게 말했다', '제노사가 3'], kind: '본편', summary: '에피소드 I과 II에서 이어진 이야기를 마무리하는 세 번째 에피소드입니다.', features: ['제노사가 세 에피소드의 마지막 작품'], related: ['xenosaga-2', 'missing-year'], sources: [monolith] },
  { id: 'xenoblade', series: 'xenoblade', title: '제노블레이드 크로니클스', english: 'Xenoblade Chronicles', japanese: 'ゼノブレイド', aliases: ['제노블레이드 1', '제노블레이드 DE', '이어지는 미래', '디피니티브 에디션', '모나드'], kind: '본편', summary: '신의 검 모나드를 손에 든 슈르크가 거신과 기신의 세계를 여행합니다. 디피니티브 에디션에는 추가 이야기 「이어지는 미래」가 수록되어 있습니다.', features: ['거신과 기신 위에 펼쳐진 세계', '디피니티브 에디션의 추가 이야기'], related: [], sources: [monolith, nintendo('aubqa', '한국닌텐도: 디피니티브 에디션')] },
  { id: 'xenoblade-x', series: 'xenoblade', title: '제노블레이드 크로니클스 크로스', english: 'Xenoblade Chronicles X', japanese: 'ゼノブレイドクロス', aliases: ['제노블레이드 X', '제노블레이드 크로스', '미라'], kind: '본편', summary: '미지의 행성 미라에 도착한 인류가 새로운 삶의 터전을 개척합니다.', features: ['미지의 행성 탐색', '인간형 병기 돌을 활용한 모험'], related: [], sources: [monolith, nintendo('bas6a', '한국닌텐도: 크로스 디피니티브 에디션')] },
  { id: 'xenoblade-2', series: 'xenoblade', title: '제노블레이드 크로니클스 2', english: 'Xenoblade Chronicles 2', japanese: 'ゼノブレイド2', aliases: ['제노블레이드2', '렉스', '호무라'], kind: '본편', summary: '제노블레이드 시리즈의 두 번째 넘버링 작품입니다. 본편과 「황금의 나라 이라」의 정보를 구분해 살펴볼 수 있습니다.', features: ['블레이드와 함께하는 RPG'], related: ['torna'], sources: [monolith] },
  { id: 'torna', series: 'xenoblade', title: '황금의 나라 이라', english: 'Xenoblade Chronicles 2: Torna – The Golden Country', japanese: 'ゼノブレイド2 黄金の国イーラ', aliases: ['황금의 나라 이라', '토르나', '이ー라'], kind: '확장 콘텐츠', summary: '제노블레이드 크로니클스 2의 세계를 다루는 추가 이야기입니다. 다운로드 콘텐츠와 패키지 판본이 있습니다.', features: ['제노블레이드 2의 추가 이야기', '별도의 패키지 판본'], related: ['xenoblade-2'], sources: [monolith] },
  { id: 'xenoblade-3', series: 'xenoblade', title: '제노블레이드 크로니클스 3', english: 'Xenoblade Chronicles 3', japanese: 'ゼノブレイド3', aliases: ['제노블레이드3', '노아', '미오'], kind: '본편', summary: '광대한 세계에서 동료들과 함께 여행하는 제노블레이드의 세 번째 넘버링 작품입니다.', features: ['동료와 연계하는 전투', '광대한 세계의 탐색'], related: ['future-redeemed'], sources: [monolith, nintendo('az3ha', '한국닌텐도: 제노블레이드 크로니클스 3')] },
  { id: 'future-redeemed', series: 'xenoblade', title: '새로운 미래', english: 'Xenoblade Chronicles 3: Future Redeemed', japanese: 'ゼノブレイド3 新たなる未来', aliases: ['제노블레이드 3 DLC', '새미래'], kind: '확장 콘텐츠', summary: '제노블레이드 크로니클스 3의 유료 추가 콘텐츠로 제공되는 이야기입니다.', features: ['제노블레이드 3의 추가 이야기'], related: ['xenoblade-3'], sources: [monolith] },
];

// 발매일은 아래 출처의 지역 기준입니다. 확인하지 못한 값은 null / unverified로 남깁니다.
export const editions: Edition[] = [
  { id: 'gears-ps', workId: 'xenogears', name: 'PlayStation 원작', platform: 'PlayStation', region: '일본', releaseDate: '1998-02-11', korean: 'unverified', sources: [squareArchive], note: '공식 한국어 지원 정보는 추가 확인이 필요합니다.' },
  ...[
    ['saga1-jp', 'xenosaga-1', '일본판', '2002-02-28'],
    ['saga1-reloaded', 'xenosaga-1', '에피소드 I 리로디드', '2003-11-20'],
    ['freaks-jp', 'xenosaga-freaks', '일본판', '2004-04-28'],
    ['saga2-jp', 'xenosaga-2', '일본판', '2004-06-24'],
    ['saga3-jp', 'xenosaga-3', '일본판', '2006-07-06'],
  ].map(([id, workId, name, releaseDate]): Edition => ({ id, workId, name, platform: 'PlayStation 2', region: '일본', releaseDate, korean: 'unverified', sources: [monolith] })),
  { id: 'saga12-ds', workId: 'xenosaga-1-2', name: 'Nintendo DS판', platform: 'Nintendo DS', region: '일본', releaseDate: '2006-03-30', korean: 'unverified', sources: [monolith] },
  { id: 'missing-year-web', workId: 'missing-year', name: 'Flash 웹 공개본', platform: '웹 / Flash', region: '미확인', releaseDate: null, korean: 'unverified', sources: [] },
  ...[
    ['blade-wii', 'xenoblade', 'Wii 원작', 'Wii', '2010-06-10'],
    ['blade-3ds', 'xenoblade', 'New Nintendo 3DS 이식판', 'New Nintendo 3DS', '2015-04-02'],
    ['blade-de', 'xenoblade', '디피니티브 에디션', 'Nintendo Switch', '2020-05-29'],
    ['blade-de-switch2', 'xenoblade', '디피니티브 에디션 Nintendo Switch 2 Edition (다운로드)', 'Nintendo Switch 2', '2026-06-10'],
    ['cross-wiiu', 'xenoblade-x', 'Wii U 원작', 'Wii U', '2015-04-29'],
    ['cross-de', 'xenoblade-x', '디피니티브 에디션', 'Nintendo Switch', '2025-03-20'],
    ['cross-switch2', 'xenoblade-x', '디피니티브 에디션 Nintendo Switch 2 Edition (다운로드)', 'Nintendo Switch 2', '2026-02-19'],
    ['blade2-switch', 'xenoblade-2', 'Nintendo Switch판', 'Nintendo Switch', '2017-12-01'],
    ['blade2-switch2', 'xenoblade-2', 'Nintendo Switch 2 Edition (다운로드)', 'Nintendo Switch 2', '2026-07-30'],
    ['torna-dlc', 'torna', '추가 다운로드 콘텐츠', 'Nintendo Switch', '2018-09-14'],
    ['torna-package', 'torna', '패키지판', 'Nintendo Switch', '2018-09-21'],
    ['blade3-switch', 'xenoblade-3', 'Nintendo Switch판', 'Nintendo Switch', '2022-07-29'],
    ['future-dlc', 'future-redeemed', '추가 다운로드 콘텐츠', 'Nintendo Switch', '2023-04-26'],
  ].map(([id, workId, name, platform, releaseDate]): Edition => ({ id, workId, name, platform, region: '일본', releaseDate, korean: 'unverified', sources: [monolith] })),
];

// 한국 정식 발매 판본은 일본판과 별도 등록합니다.
editions.push(
  { id: 'blade-de-kr', workId: 'xenoblade', name: '디피니티브 에디션 한국 발매판', platform: 'Nintendo Switch', region: '한국', releaseDate: '2020-05-29', korean: 'supported', sources: [nintendo('aubqa', '한국닌텐도 공식 소개')] },
  { id: 'blade3-kr', workId: 'xenoblade-3', name: '한국 발매판', platform: 'Nintendo Switch', region: '한국', releaseDate: '2022-07-29', korean: 'supported', sources: [nintendo('az3ha', '한국닌텐도 공식 소개')] },
  { id: 'cross-de-kr', workId: 'xenoblade-x', name: '디피니티브 에디션 한국 발매판', platform: 'Nintendo Switch', region: '한국', releaseDate: '2025-03-20', korean: 'supported', sources: [nintendo('bas6a', '한국닌텐도 공식 소개')] },
);

export const koreanLabels = { supported: '공식 한국어 지원', unsupported: '공식 한국어 미지원', unverified: '공식 한국어 지원 미확인' };
export const workEditions = (id: string) => editions.filter((edition) => edition.workId === id);
