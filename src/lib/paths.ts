import { siteConfig } from '../data/site.mjs';

export function withBase(path = '/') {
  if (/^https?:\/\//.test(path)) return path;
  return `${siteConfig.base}/${path.replace(/^\/+/, '')}`;
}
export const workUrl = (id: string) => withBase(`/works/${id}/`);
export const seriesUrl = (id: string) => id === 'xenoblade' ? siteConfig.xenobladeOfficial : withBase(`/series/${id}/`);
// 명시적인 파일 주소로 이전 도메인의 301 리디렉션 캐시를 피합니다.
export const homeUrl = withBase('/index.html');
