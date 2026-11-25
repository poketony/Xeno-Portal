import test from 'node:test';
import assert from 'node:assert/strict';
import { stat } from 'node:fs/promises';
import { interviews } from '../src/data/interviews.mjs';
import { interviewReadings } from '../src/data/interview-readings.mjs';

test('한국어 읽기 자료는 기존 인터뷰와 연결되고 본문과 원문 쪽을 갖는다', () => {
  assert.equal(interviewReadings.length,29);
  assert.equal(new Set(interviewReadings.map(item=>item.id)).size,29);
  assert.equal(interviewReadings.reduce((total,item)=>total+item.sources.length,0),67);
  for(const reading of interviewReadings) {
    assert.ok(interviews.some(item=>item.id===reading.id),reading.id);
    assert.ok(reading.lead && reading.sections.length && reading.sources.length,reading.id);
    assert.equal(new Set(reading.sections.map(section=>section.id)).size,reading.sections.length);
    for(const section of reading.sections) {
      assert.match(section.id,/^[a-z0-9-]+$/);
      assert.ok(section.title && section.paragraphs.length,reading.id);
      assert.ok(section.paragraphs.every(text=>text.length>15 && !/[<>\ufffd]/.test(text)),reading.id);
    }
    assert.equal(new Set(reading.sources.map(source=>source.url)).size,reading.sources.length);
    for(const source of reading.sources) assert.match(source.url,/^https?:\/\//);
    assert.ok(!JSON.stringify(reading).includes('C:\\Users\\'),reading.id);
  }
});

test('원래 연재 순서와 복구된 인터뷰 페이지를 빠짐없이 연결한다',()=>{
  for(const [id,count] of [['iwata-xenoblade-development',5],['iwata-xenoblade-3d',5],['iwata-xenoblade-x',7]]) {
    const reading=interviewReadings.find(item=>item.id===id);
    assert.equal(reading.sections.length,count);
    assert.deepEqual(reading.sources.map(source=>source.page),Array.from({length:count},(_,i)=>i+1));
  }
  for(const [id,count] of [['xenosaga-gamespot-japan-takahashi-2001',6],['sony-creators-talk-takahashi',3],['xenosaga-ii-creator-who-2003',10]]) {
    assert.equal(interviewReadings.find(item=>item.id===id).sources.length,count);
    assert.equal(interviews.find(item=>item.id===id).chapters.length,count);
  }
  assert.equal(interviewReadings.find(item=>item.id==='sony-creators-talk-takahashi').recordedAt,'2002-02-26');
});

test('본문 사진은 로컬 파일·대체 텍스트·출처를 갖고 알맞은 절에 들어간다',async()=>{
  for(const reading of interviewReadings) {
    assert.ok(reading.figures.filter(figure=>!figure.sectionId).length<=1,reading.id);
    for(const figure of reading.figures) {
      assert.match(figure.src,/^\/images\/interviews\//);
      assert.ok((await stat(new URL('../public'+figure.src,import.meta.url))).size>0);
      assert.ok(figure.width>0 && figure.height>0 && figure.alt && figure.caption,figure.src);
      assert.match(figure.sourceUrl,/^https?:\/\//);
      if(figure.sectionId) assert.ok(reading.sections.some(section=>section.id===figure.sectionId),figure.src);
    }
  }
});
