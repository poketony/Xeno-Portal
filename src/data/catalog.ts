import { seriesText, workText, lineupText, koreanSupportText } from './content.mjs';

export type SeriesId = 'xenogears' | 'xenosaga' | 'xenoblade';
export interface Source { title: string; url: string }
export interface Series {
  id: SeriesId; name: string; korean: string; number: string;
  tagline: string; description: string; motif: string;
  logo: { src: string; width: number; height: number };
  artwork?: { src: string; alt: string; width: number; height: number };
}
export interface Work {
  id: string; series: SeriesId; title: string; english: string; japanese: string;
  aliases: string[]; kind: '본편' | '외전' | '확장 콘텐츠' | '재구성' | '영상';
  summary: string; features: string[]; related: string[]; sources: Source[];
  image?: { src: string; alt: string; source: Source };
}
export interface Edition {
  id: string; workId: string; name: string; platform: string; region: string;
  // YYYY-MM-DD, 공개월만 확인한 경우 YYYY-MM. 미확인은 null.
  releaseDate: string | null; korean: 'supported' | 'unsupported' | 'unverified';
  note?: string; sources: Source[];
}
export const monolith: Source = { title: 'MONOLITHSOFT 공식 작품 목록 (일본 발매 정보)', url: 'https://www.monolithsoft.co.jp/games/' };
const squareArchive: Source = { title: 'SQUARE ENIX 제노기어스 아카이브 (일본 발매 정보)', url: 'https://www.jp.square-enix.com/archive/xenogears/' };
const piedPiperSource: Source = { title: 'GAME Watch: 파이드 파이퍼 최초 배포 보도 (2004-07-14)', url: 'https://game.watch.impress.co.jp/docs/20040714/xeno.htm' };
const missingYearSource: Source = { title: 'Eiwigkeit: 미싱 이어 공개 당시 기록 (2006년 5월)', url: 'https://xenoonline.com/archives/1878' };
const nintendo = (code: string, title: string): Source => ({ title, url: `https://www.nintendo.com/kr/switch/${code}/index.html` });

export const series: Series[] = [
  { id: 'xenogears', ...seriesText['xenogears'], logo: { src: '/images/xenogears-logo-v2.png', width: 1500, height: 452 }, artwork: { src: '/images/xenogears-art.png', alt: seriesText['xenogears'].artworkAlt, width: 1086, height: 1448 } },
  { id: 'xenosaga', ...seriesText['xenosaga'], logo: { src: '/images/xenosaga-logo-v2.png', width: 1500, height: 452 }, artwork: { src: '/images/xenosaga-art.webp', alt: seriesText['xenosaga'].artworkAlt, width: 1000, height: 681 } },
  { id: 'xenoblade', ...seriesText['xenoblade'], logo: { src: '/images/xenoblade-logo-v2.png', width: 1500, height: 452 }, artwork: { src: '/images/xenoblade-art.jpg', alt: seriesText['xenoblade'].artworkAlt, width: 640, height: 839 } },
];

export const works: Work[] = [
  { id: 'xenogears', series: 'xenogears', ...workText['xenogears'], kind: '본편', related: [], sources: [squareArchive] },
  { id: 'xenosaga-1', series: 'xenosaga', ...workText['xenosaga-1'], kind: '본편', related: ['xenosaga-2', 'xenosaga-1-2'], sources: [monolith] },
  { id: 'xenosaga-freaks', series: 'xenosaga', ...workText['xenosaga-freaks'], kind: '외전', related: ['xenosaga-1'], sources: [monolith] },
  { id: 'xenosaga-2', series: 'xenosaga', ...workText['xenosaga-2'], kind: '본편', related: ['xenosaga-1', 'missing-year', 'xenosaga-3'], sources: [monolith] },
  { id: 'xenosaga-1-2', series: 'xenosaga', ...workText['xenosaga-1-2'], kind: '재구성', related: ['xenosaga-1', 'xenosaga-2'], sources: [monolith] },
  { id: 'xenosaga-pied-piper', series: 'xenosaga', ...workText['xenosaga-pied-piper'], kind: '외전', related: ['xenosaga-2', 'xenosaga-3'], sources: [piedPiperSource] },
  { id: 'missing-year', series: 'xenosaga', ...workText['missing-year'], kind: '영상', related: ['xenosaga-2', 'xenosaga-3'], sources: [missingYearSource] },
  { id: 'xenosaga-3', series: 'xenosaga', ...workText['xenosaga-3'], kind: '본편', related: ['xenosaga-2', 'missing-year'], sources: [monolith] },
  { id: 'xenoblade', series: 'xenoblade', ...workText['xenoblade'], kind: '본편', related: [], sources: [monolith, nintendo('aubqa', '한국닌텐도: 디피니티브 에디션')] },
  { id: 'xenoblade-x', series: 'xenoblade', ...workText['xenoblade-x'], kind: '본편', related: [], sources: [monolith, nintendo('bas6a', '한국닌텐도: 크로스 디피니티브 에디션')] },
  { id: 'xenoblade-2', series: 'xenoblade', ...workText['xenoblade-2'], kind: '본편', related: ['torna'], sources: [monolith] },
  { id: 'torna', series: 'xenoblade', ...workText['torna'], kind: '확장 콘텐츠', related: ['xenoblade-2'], sources: [monolith] },
  { id: 'xenoblade-3', series: 'xenoblade', ...workText['xenoblade-3'], kind: '본편', related: ['future-redeemed'], sources: [monolith, nintendo('az3ha', '한국닌텐도: 제노블레이드 크로니클스 3')] },
  { id: 'future-redeemed', series: 'xenoblade', ...workText['future-redeemed'], kind: '확장 콘텐츠', related: ['xenoblade-3'], sources: [monolith] },
];

// 본편 사이의 배치는 운영자 지정. 각 외전 묶음은 최초 발매·공개 순입니다.
export const xenosagaLineup = [
  { mainId: 'xenosaga-1', episode: 'I', subtitle: lineupText.I, sideIds: ['xenosaga-freaks'], between: lineupText.beforeII },
  { mainId: 'xenosaga-2', episode: 'II', subtitle: lineupText.II, sideIds: ['xenosaga-pied-piper', 'xenosaga-1-2', 'missing-year'], between: lineupText.beforeIII },
  { mainId: 'xenosaga-3', episode: 'III', subtitle: lineupText.III, sideIds: [], between: '' },
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
  { id: 'pied-piper-vodafone', workId: 'xenosaga-pied-piper', name: 'Vodafone live! 최초 배포판', platform: '휴대전화', region: '일본', releaseDate: '2004-07-14', korean: 'unverified', sources: [piedPiperSource] },
  { id: 'missing-year-web', workId: 'missing-year', name: 'Flash 웹 공개본', platform: '웹 / Flash', region: '일본', releaseDate: '2006-05', korean: 'unverified', sources: [missingYearSource], note: '당시 공개 기록을 근거로 공개월만 표시합니다. 정확한 최초 공개일과 원본 파일 구성은 추가 확인이 필요합니다.' },
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

export const koreanLabels = koreanSupportText;
export const workEditions = (id: string) => editions.filter((edition) => edition.workId === id);
