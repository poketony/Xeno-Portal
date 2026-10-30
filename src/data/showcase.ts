import { series } from './catalog';

export interface ShowcaseImage { src: string; alt: string; width: number; height: number }

const gears = series.find((item) => item.id === 'xenogears')!;
const saga = series.find((item) => item.id === 'xenosaga')!;

// 새 배경 이미지를 slides에 추가하면 6초 간격으로 자동 전환합니다.
export const showcases = {
  xenogears: {
    logo: { src: '/images/xenogears-title-logo.png', width: 1260, height: 1500 },
    slides: [gears.artwork!],
    patchUrl: 'https://blog.naver.com/hyunjun0803jun/224086745609',
  },
  xenosaga: {
    logo: saga.logo,
    slides: [saga.artwork!],
  },
};

export const workPatchLinks: Partial<Record<string, string>> = {
  xenogears: showcases.xenogears.patchUrl,
  'xenosaga-1': 'https://blog.naver.com/hyunjun0803jun/224373974665',
  'xenosaga-pied-piper': 'https://blog.naver.com/hyunjun0803jun/224290122622',
};
