import test from 'node:test';
import assert from 'node:assert/strict';
import { interviews, interviewCheckedAt } from '../src/data/interviews.mjs';
import { filterInterviews, formatInterviewDate } from '../src/lib/interviews.mjs';

test('인터뷰는 중복 없는 원문·보존본과 공개 시기 근거를 갖는다', () => {
  assert.ok(interviews.length > 0);
  assert.equal(new Set(interviews.map(item => item.id)).size, interviews.length);
  assert.equal(new Set(interviews.map(item => item.originalUrl)).size, interviews.length);
  for (const item of interviews) {
    assert.ok(item.title && item.publisher && item.participants.length, item.id);
    assert.equal(typeof item.originalTitle, 'string');
    assert.ok(item.summary && item.summary.length < 600, `${item.id}: 짧은 한국어 요약 필요`);
    assert.ok(['interview', 'creator-note'].includes(item.kind));
    assert.ok(['original', 'archive', 'reprint'].includes(item.sourceType));
    assert.ok(item.series.length && item.series.every(id => ['xenogears', 'xenosaga', 'xenoblade'].includes(id)));
    if (item.date) {
      assert.match(item.date, /^\d{4}(?:-\d{2})?(?:-\d{2})?$/);
      assert.ok(item.date <= interviewCheckedAt);
      assert.equal(item.datePrecision, { 4: 'year', 7: 'month', 10: 'day' }[item.date.length]);
    } else assert.ok(item.dateNote || item.accessNote, item.id);
    for (const url of [item.originalUrl, item.archiveUrl, item.koreanUrl, item.dateSource, ...item.chapters.flatMap(chapter => [chapter.url, chapter.koreanUrl])].filter(Boolean)) {
      assert.ok(['https:', 'http:'].includes(new URL(url).protocol), url);
    }
    if (item.sourceType === 'archive') {
      assert.equal(new URL(item.archiveUrl).hostname, 'web.archive.org');
      assert.match(new URL(item.archiveUrl).pathname, /^\/web\/\d{14}\//);
    }
    if (item.koreanUrl) assert.match(item.koreanUrl, /^https:\/\/www\.nintendo\.com\/kr\//);
  }
});

test('요청한 닌텐도 세 인터뷰는 전체 목차로 연결된다', () => {
  const required = [
    ['https://www.nintendo.co.jp/wii/interview/sx4j/vol3/index.html', 5],
    ['https://www.nintendo.co.jp/3ds/interview/cafj/vol1/index.html', 5],
    ['https://www.nintendo.co.jp/wiiu/interview/ax5j/vol1/index.html', 7],
  ];
  for (const [url, count] of required) {
    const item = interviews.find(entry => entry.originalUrl === url);
    assert.ok(item, url);
    assert.equal(item.chapters.length, count);
    assert.equal(new Set(item.chapters.map(chapter => chapter.url)).size, count);
  }
  assert.ok(interviews.some(item => item.series.includes('xenosaga') && item.sourceType === 'archive' && item.languages.includes('ja')));
});

test('시기 미확인 자료와 불완전한 날짜는 정렬 방향과 관계없이 해당 기간 뒤에 둔다', () => {
  const records = [
    { id: 'year', date: '2001', title: '연도만' },
    { id: 'day', date: '2001-06-18', title: '날짜 확인' },
    { id: 'month', date: '2001-06', title: '월만' },
    { id: 'unknown', date: null, title: '시기 미상' },
    { id: 'new', date: '2022-07-26', title: '새 자료' },
  ].map(item => ({ ...item, originalTitle: '', summary: '', participants: [], works: [], series: [] }));
  assert.deepEqual(filterInterviews(records).map(item => item.id), ['day', 'month', 'year', 'new', 'unknown']);
  assert.deepEqual(filterInterviews(records, { sort: 'newest' }).map(item => item.id), ['new', 'day', 'month', 'year', 'unknown']);
  assert.equal(records[0].id, 'year');
  assert.equal(formatInterviewDate('2001-06-18'), '2001년 6월 18일');
  assert.equal(formatInterviewDate('2001'), '2001년');
});

test('시리즈·공식 한국어·원문 보존과 이름 검색을 함께 적용한다', () => {
  const saga = filterInterviews(interviews, { series: 'xenosaga', source: 'archive' });
  assert.ok(saga.length);
  assert.ok(saga.every(item => item.series.includes('xenosaga') && item.sourceType === 'archive'));
  const korean = filterInterviews(interviews, { series: 'xenoblade', language: 'ko' });
  assert.ok(korean.some(item => item.koreanUrl));
  assert.ok(korean.every(item => item.koreanUrl));
  assert.ok(filterInterviews(interviews, { query: '타카하시 테츠야' }).length);
  assert.ok(filterInterviews(interviews, { query: 'Ｘｅｎｏｓａｇａ' }).length);
  assert.deepEqual(filterInterviews(interviews, { query: '없는인터뷰-검증-000' }), []);
});
