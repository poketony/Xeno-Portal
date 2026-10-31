import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { series, works } from '../src/data/catalog.ts';
import { seriesText, workText, historyText } from '../src/data/content.mjs';

test('모든 시리즈와 작품의 편집 문구가 실제 카탈로그에 연결된다', () => {
  assert.deepEqual(Object.keys(seriesText).sort(), series.map(item => item.id).sort());
  assert.deepEqual(Object.keys(workText).sort(), works.map(item => item.id).sort());
  for (const item of series) {
    assert.ok(item.name && item.korean && item.description);
    assert.equal(item.description, seriesText[item.id].description);
  }
  for (const work of works) {
    assert.ok(work.title && work.english && work.summary && work.features.length);
    assert.equal(work.summary, workText[work.id].summary);
    assert.deepEqual(work.features, workText[work.id].features);
  }
});

test('역사 문구의 모든 인용과 인물 사진은 유효한 출처·파일에 연결된다', () => {
  const ids = new Set(historyText.sources.map(source => source.id));
  assert.equal(ids.size, historyText.sources.length);
  for (const source of historyText.sources) assert.equal(new URL(source.url).protocol, 'https:');
  for (const entry of [...historyText.timeline, ...historyText.people, ...historyText.collaborators, ...historyText.qualities]) {
    assert.ok(entry.refs.length);
    for (const id of entry.refs) assert.ok(ids.has(id), `알 수 없는 출처: ${id}`);
  }
  for (const person of historyText.people) {
    assert.ok(ids.has(person.interviewId));
    if (person.photo) {
      assert.ok(person.photo.src.startsWith('/images/people/'));
      assert.ok(existsSync(new URL(`../public${person.photo.src}`, import.meta.url)));
      assert.equal(new URL(person.photo.url).protocol, 'https:');
    } else assert.ok(person.portrait);
  }
});
