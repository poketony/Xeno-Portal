import { siteConfig } from '../data/site.mjs';

export function withBase(path = '/') {
  if (/^https?:\/\//.test(path)) return path;
  return `${siteConfig.base}/${path.replace(/^\/+/, '')}`;
}
export const workUrl = (id: string) => withBase(`/works/${id}/`);
export const seriesUrl = (id: string) => id === 'xenoblade' ? siteConfig.xenobladeOfficial : withBase(`/series/${id}/`);
