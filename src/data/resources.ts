import { resourceText } from './content.mjs';
import type { Source } from './catalog';

export interface Resource {
  id: string; workIds: string[]; title: string; description: string;
  type: string; thumbnail?: string; url?: string; file?: string;
  source?: Source; instructions?: string; downloadable: boolean;
}

export const resources: Resource[] = [
  { id: 'missing-year', workIds: ['missing-year', 'xenosaga-2', 'xenosaga-3'], ...resourceText['missing-year'], type: 'Flash 영상', url: '/watch/missing-year/', downloadable: false },
];
