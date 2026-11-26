import test from 'node:test';
import assert from 'node:assert/strict';
import { stat } from 'node:fs/promises';
import { interviews } from '../src/data/interviews.mjs';
import { interviewReadings } from '../src/data/interview-readings.mjs';

test('전문 번역은 원문 줄과 역주 생략 범위를 중복·누락 없이 대응한다', () => {
  const expectedIds=interviews.filter(item=>!item.koreanUrl).map(item=>item.id).sort();
  assert.deepEqual(interviewReadings.map(item=>item.id).sort(),expectedIds);
  assert.equal(interviewReadings.reduce((total,item)=>total+item.sources.length,0),92);
  assert.equal(interviewReadings.reduce((total,item)=>total+item.sections.length,0),92);
  for(const reading of interviewReadings) {
    assert.ok(interviews.some(item=>item.id===reading.id),reading.id);
    assert.ok(reading.sources.length,reading.id);
    assert.equal(reading.complete,true,reading.id);
    assert.deepEqual(reading.translatedPages,reading.sources.map(source=>source.page),reading.id);
    assert.deepEqual(reading.translatedPages,reading.sections.map(section=>section.page));
    assert.equal(new Set(reading.sections.map(section=>section.id)).size,reading.sections.length);
    for(const section of reading.sections) {
      assert.match(section.id,/^[a-z0-9-]+$/);
      assert.ok(section.title && section.blocks.length,reading.id);
      assert.match(section.sourceSha256,/^[a-f0-9]{64}$/);
      const coverage=[];
      for(const block of section.blocks) {
        if(block.omitted) {
          assert.equal(block.omitted,true,reading.id);
          assert.ok(['note','credits'].includes(block.kind)&&!block.speaker,reading.id);
          assert.equal(block.text,'',reading.id);
        } else assert.ok(block.text.trim()&&!block.text.includes('\ufffd'),reading.id);
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

test('여러 쪽으로 된 연재의 원문 목차와 취재일을 유지한다',()=>{
  for(const [id,count] of [['iwata-xenoblade-development',5],['iwata-xenoblade-3d',5],['iwata-xenoblade-x',7]]) {
    const reading=interviewReadings.find(item=>item.id===id);
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
      assert.ok(figure.width>0 && figure.height>0 && figure.alt,figure.src);
      assert.match(figure.sourceUrl,/^https?:\/\//);
      const section=reading.sections.find(section=>section.id===figure.sectionId);
      if(figure.sectionId) assert.ok(section,figure.src);
      if(figure.afterLine===undefined) {
        assert.ok(figure.caption,figure.src);
      } else {
        assert.ok(section,figure.src);
        assert.ok(figure.afterLine===0||section.blocks.some(block=>block.to===figure.afterLine),figure.src);
        assert.equal(figure.sourceUrl,reading.sources.find(source=>source.page===section.page).url,figure.src);
      }
    }
  }
});
