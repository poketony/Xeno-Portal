import { cp, mkdir, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const root = dirname(require.resolve('@ruffle-rs/ruffle/package.json'));
const manifest = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
if (manifest.version !== '0.7.1') throw new Error('Ruffle 버전이 문서와 다릅니다. API와 문서를 함께 갱신하세요.');
await mkdir('public/vendor/ruffle', { recursive: true });
await cp(root, 'public/vendor/ruffle', { recursive: true });
console.log(`Ruffle ${manifest.version}: 공식 배포본 전체를 public/vendor/ruffle에 복사했습니다.`);
