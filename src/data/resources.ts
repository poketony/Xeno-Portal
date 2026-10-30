import type { Source } from './catalog';

export interface Resource {
  id: string; workIds: string[]; title: string; description: string;
  type: string; thumbnail?: string; url?: string; file?: string;
  source?: Source; instructions?: string; downloadable: boolean;
}

export const resources: Resource[] = [
  { id: 'missing-year', workIds: ['missing-year', 'xenosaga-2', 'xenosaga-3'], title: '제노사가 미싱 이어', description: '에피소드 II와 III 사이의 이야기. 작품 소개와 장별 감상 화면으로 연결합니다. 원본 SWF는 아직 등록되지 않았습니다.', type: 'Flash 영상', url: '/watch/missing-year/', instructions: '에피소드 II의 내용을 포함하므로 감상 순서에 유의하세요.', downloadable: false },
];
