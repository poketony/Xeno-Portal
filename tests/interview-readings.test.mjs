import test from 'node:test';
import assert from 'node:assert/strict';
import { stat } from 'node:fs/promises';
import { interviews } from '../src/data/interviews.mjs';
import { interviewReadings } from '../src/data/interview-readings.mjs';

test('전문 번역은 원문 줄을 중복·누락 없이 대응하고 번역 범위를 표시한다', () => {
  assert.equal(interviewReadings.length,29);
  assert.equal(new Set(interviewReadings.map(item=>item.id)).size,29);
  assert.equal(interviewReadings.reduce((total,item)=>total+item.sources.length,0),67);
  const translated=interviewReadings.filter(reading=>reading.sections.length);
  assert.equal(translated.length,18);
  assert.equal(translated.filter(reading=>reading.complete).length,13);
  assert.equal(translated.reduce((n,reading)=>n+reading.sections.length,0),22);
  assert.equal(translated.reduce((n,reading)=>n+reading.sections.reduce((m,section)=>m+section.sourceLineCount,0),0),1910);
  for(const reading of interviewReadings) {
    assert.ok(interviews.some(item=>item.id===reading.id),reading.id);
    assert.ok(reading.sources.length,reading.id);
    assert.equal(reading.complete,reading.sections.length===reading.sources.length);
    assert.deepEqual(reading.translatedPages,reading.sections.map(section=>section.page));
    assert.equal(new Set(reading.sections.map(section=>section.id)).size,reading.sections.length);
    for(const section of reading.sections) {
      assert.match(section.id,/^[a-z0-9-]+$/);
      assert.ok(section.title && section.blocks.length,reading.id);
      assert.match(section.sourceSha256,/^[a-f0-9]{64}$/);
      const coverage=[];
      for(const block of section.blocks) {
        assert.ok(block.text.trim()&&!block.text.includes('\ufffd'),reading.id);
        assert.ok(['heading','paragraph','question','answer','note','caption','credits'].includes(block.kind),reading.id);
        assert.ok(Number.isInteger(block.from)&&Number.isInteger(block.to)&&block.to>=block.from,reading.id);
        for(let i=block.from;i<=block.to;i++)coverage.push(i);
      }
      assert.deepEqual(coverage,Array.from({length:section.sourceLineCount},(_,i)=>i+1),reading.id);
      assert.ok(reading.sources.some(source=>source.page===section.page),reading.id);
    }
    assert.equal(new Set(reading.sources.map(source=>source.url)).size,reading.sources.length);
    for(const source of reading.sources) assert.match(source.url,/^https?:\/\//);
    assert.ok(!JSON.stringify(reading).includes('C:\\Users\\'),reading.id);
  }
});

test('원문 목차를 유지하고 일부 번역을 전체 완역으로 표시하지 않는다',()=>{
  for(const [id,count] of [['iwata-xenoblade-development',5],['iwata-xenoblade-3d',5],['iwata-xenoblade-x',7]]) {
    const reading=interviewReadings.find(item=>item.id===id);
    assert.deepEqual(reading.sources.map(source=>source.page),Array.from({length:count},(_,i)=>i+1));
  }
  for(const [id,count] of [['xenosaga-gamespot-japan-takahashi-2001',6],['sony-creators-talk-takahashi',3],['xenosaga-ii-creator-who-2003',10]]) {
    assert.equal(interviewReadings.find(item=>item.id===id).sources.length,count);
    assert.equal(interviews.find(item=>item.id===id).chapters.length,count);
  }
  assert.equal(interviewReadings.find(item=>item.id==='sony-creators-talk-takahashi').recordedAt,'2002-02-26');
  for(const [id,pages] of [['xenosaga-gamespot-japan-takahashi-2001',[3,4]],['xenosaga-gamespot-japan-sugiura-2001',[2]],['xenosaga-ii-creator-who-2003',[1,2,3,4]],['iwata-xenoblade-development',[1]],['soraya-saga-siliconera-2010',[2]]]) {
    const reading=interviewReadings.find(item=>item.id===id);
    assert.deepEqual(reading.translatedPages,pages);
    assert.equal(reading.complete,false);
  }
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
