import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve, join, extname } from 'node:path';
import { siteConfig } from '../src/data/site.mjs';

const root = resolve('dist');
const files = await readdir(root, { recursive: true });
const htmlFiles = files.filter((file) => file.endsWith('.html'));
const failures = [];
for (const file of htmlFiles) {
  const html = await readFile(join(root, file), 'utf8');
  if (html.includes('검증용 단색 SWF')) failures.push(`${file}: 격리된 검증 자료가 배포 결과물에 포함됨`);
  if (!html.includes('lang="ko"')) failures.push(`${file}: 한국어 문서 언어 누락`);
  if (!/<title>[^<]+<\/title>/.test(html)) failures.push(`${file}: 제목 누락`);
  if (!/<meta name="description" content="[^"]+"/.test(html)) failures.push(`${file}: 설명 누락`);
  for (const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
    const url = new URL(match[1].replace(/&amp;/g, '&'), `${siteConfig.origin}${siteConfig.base}/${file.replaceAll('\\', '/')}`);
    if (url.origin !== siteConfig.origin) continue;
    if (!url.pathname.startsWith(`${siteConfig.base}/`)) { failures.push(`${file}: base 누락 ${url.pathname}`); continue; }
    const pathname = decodeURIComponent(url.pathname.slice(siteConfig.base.length));
    let target = resolve(root, `.${pathname}`);
    if (!target.startsWith(root)) { failures.push(`${file}: 결과물 바깥 경로`); continue; }
    if (!extname(target)) target = join(target, 'index.html');
    try { await stat(target); } catch { failures.push(`${file}: 없는 내부 링크 ${url.pathname}`); }
  }
}
const vendorFiles = files.filter((file) => file.replaceAll('\\', '/').startsWith('vendor/ruffle/'));
if (!vendorFiles.some((file) => file.endsWith('.wasm'))) failures.push('Ruffle WASM 누락');
if (!vendorFiles.some((file) => file.endsWith('ruffle.js'))) failures.push('Ruffle JS 누락');
if (!vendorFiles.some((file) => file.endsWith('LICENSE_MIT'))) failures.push('Ruffle 라이선스 누락');
if (failures.length) throw new Error(failures.join('\n'));
console.log(`정적 결과물 검증 통과: HTML ${htmlFiles.length}개, 내부 링크·이미지·JS 경로 및 Ruffle JS/WASM/라이선스 확인.`);
