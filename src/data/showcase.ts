import type { ImageMetadata } from 'astro';
import { slideAltText } from './content.mjs';
import { series } from './catalog';
import { withBase } from '../lib/paths';

// src는 기본 배포 경로를 포함한 URL입니다.
export interface ShowcaseImage { src: string; alt: string; width: number; height: number }

const saga = series.find((item) => item.id === 'xenosaga')!;
const gearsSlides: ShowcaseImage[] = Object.entries(import.meta.glob<ImageMetadata>('../../제노기어스/*.png', { eager: true, import: 'default' }))
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, image], index) => ({ src: image.src, alt: slideAltText.gears.replace('{number}', String(index + 1)), width: image.width, height: image.height }));
const saga1Slides: ShowcaseImage[] = Object.entries(import.meta.glob<ImageMetadata>('../../제노사가1/*.{png,gif}', { eager: true, import: 'default' }))
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, image], index) => ({ src: image.src, alt: slideAltText.saga.replace('{number}', String(index + 1)), width: image.width, height: image.height }));

// 게임 이미지를 파일명 순서로 불러와 6초 간격으로 전환합니다. GIF는 원본 애니메이션을 유지합니다.
export const showcases = {
  xenogears: {
    logo: { src: '/images/xenogears-title-logo.png', width: 1260, height: 1500 },
    slides: gearsSlides,
    patchUrl: 'https://blog.naver.com/hyunjun0803jun/224086745609',
  },
  xenosaga: {
    logo: saga.logo,
    slides: [{ ...saga.artwork!, src: withBase(saga.artwork!.src) }],
  },
  'xenosaga-1': {
    logo: saga.logo,
    slides: saga1Slides,
  },
};

export const workPatchLinks: Partial<Record<string, string>> = {
  xenogears: showcases.xenogears.patchUrl,
  'xenosaga-1': 'https://blog.naver.com/hyunjun0803jun/224373974665',
  'xenosaga-pied-piper': 'https://blog.naver.com/hyunjun0803jun/224290122622',
};
