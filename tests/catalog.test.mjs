import test from 'node:test';
import assert from 'node:assert/strict';
import { filterCatalog } from '../src/lib/catalog.mjs';
import { works, series, editions } from '../src/data/catalog.ts';
import { patches } from '../src/data/patches.ts';
import { resources } from '../src/data/resources.ts';
import { chapters } from '../src/data/missing-year.ts';

const items = [
  { id: 'one', title: '첫 작품', search: '제노사가 에피소드 I ゼノサーガ Xenosaga I KOS-MOS', series: 'xenosaga', platforms: ['PlayStation 2'], kind: '본편', date: '2002-02-28' },
  { id: 'two', title: '다음 작품', search: '제노사가 I·II 제노사가 DS', series: 'xenosaga', platforms: ['Nintendo DS'], kind: '재구성', date: '2006-03-30' },
  { id: 'unknown', title: '미확인 작품', search: '제노기어스 Xenogears', series: 'xenogears', platforms: ['PlayStation'], kind: '본편', date: '' },
];
test('일본어·영어·별칭 검색은 대소문자와 전각·공백·구분 기호를 정규화한다', () => {
  for (const query of ['ゼノサーガ', 'Ｘｅｎｏｓａｇａ', 'kos mos', '제노 사가 에피소드']) assert.equal(filterCatalog(items, { query })[0].id, 'one');
  assert.equal(filterCatalog(items, { query: '제노사가DS' })[0].id, 'two');
  assert.deepEqual(filterCatalog(items, { query: '없는작품' }), []);
});
test('시리즈·기종·분류 필터를 동시에 적용한다', () => {
  assert.deepEqual(filterCatalog(items, { series: 'xenosaga', platform: 'Nintendo DS', kind: '재구성' }).map((item) => item.id), ['two']);
  assert.deepEqual(filterCatalog(items, { series: 'xenogears', platform: 'Nintendo DS' }), []);
});
test('정렬 방향과 관계없이 미확인 날짜는 마지막이며 원본 배열은 보존된다', () => {
  assert.deepEqual(filterCatalog(items, { sort: 'newest' }).map((item) => item.id), ['two', 'one', 'unknown']);
  assert.deepEqual(filterCatalog(items).map((item) => item.id), ['one', 'two', 'unknown']);
  assert.equal(items[0].id, 'one');
});
test('작품·판본·패치·자료의 ID와 연결 관계가 유효하다', () => {
  for (const collection of [works, series, editions, patches, resources, chapters]) assert.equal(new Set(collection.map((item) => item.id)).size, collection.length);
  for (const work of works) {
    assert.ok(series.some((entry) => entry.id === work.series), work.id);
    for (const related of work.related) assert.ok(works.some((entry) => entry.id === related), `${work.id} → ${related}`);
  }
  for (const edition of editions) {
    assert.ok(works.some((work) => work.id === edition.workId), edition.id);
    if (edition.releaseDate) assert.match(edition.releaseDate, /^\d{4}-\d{2}-\d{2}$/);
    if (edition.korean !== 'unverified') assert.ok(edition.sources.length, `${edition.id}: 한국어 지원 판단 출처 필요`);
  }
  for (const patch of patches) {
    assert.ok(works.some((work) => work.id === patch.workId));
    assert.ok(patch.editionIds.length, '패치 대상 판본 필요');
    for (const id of patch.editionIds) assert.ok(editions.some((edition) => edition.id === id && edition.workId === patch.workId));
    for (const url of [patch.downloadUrl, patch.distributionUrl, ...(patch.mirrors ?? []).map((mirror) => mirror.url)].filter(Boolean)) assert.equal(new URL(url).protocol, 'https:');
  }
  for (const resource of resources) for (const id of resource.workIds) assert.ok(works.some((work) => work.id === id));
});
test('SWF 장 데이터는 고유 순서·양수 화면비와 기준 폴더를 갖는다', () => {
  assert.equal(new Set(chapters.map((chapter) => chapter.order)).size, chapters.length);
  for (const chapter of chapters) {
    assert.ok(chapter.width > 0 && chapter.height > 0);
    assert.match(chapter.file, /\.swf$/i);
    assert.ok(chapter.resourceBase.endsWith('/'));
    assert.ok(!chapter.file.includes('..') && !chapter.resourceBase.includes('..'));
  }
});
