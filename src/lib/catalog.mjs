export function normalizeSearch(value) {
  return value.normalize('NFKC').toLocaleLowerCase('ko').replace(/[\s·・:：&–—-]/g, '');
}

export function filterCatalog(items, { query = '', series = '', platform = '', kind = '', sort = 'oldest' } = {}) {
  const needle = normalizeSearch(query);
  return items.filter((item) => (!needle || normalizeSearch(item.search).includes(needle))
    && (!series || item.series === series)
    && (!platform || item.platforms.includes(platform))
    && (!kind || item.kind === kind))
    .sort((a, b) => {
      // 날짜 미확인 작품은 정렬 방향과 관계없이 뒤에 둡니다.
      if (!a.date && !b.date) return a.title.localeCompare(b.title, 'ko');
      if (!a.date) return 1;
      if (!b.date) return -1;
      return sort === 'newest' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date);
    });
}
