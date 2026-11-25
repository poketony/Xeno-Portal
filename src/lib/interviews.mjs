import { normalizeSearch } from './catalog.mjs';

export function formatInterviewDate(date) {
  if (!date) return '';
  const [year, month, day] = date.split('-');
  return `${year}년${month ? ` ${Number(month)}월` : ''}${day ? ` ${Number(day)}일` : ''}`;
}

/**
 * @template T
 * @param {T[]} items
 * @param {{query?: string, series?: string, language?: string, source?: string, sort?: string}} [filters]
 * @returns {T[]}
 */
export function filterInterviews(items, { query = '', series = '', language = '', source = '', sort = 'oldest' } = {}) {
  const needle = normalizeSearch(query);
  return items.filter((item) => (!series || item.series.includes(series))
    && (!language || language === 'ko' && !!item.koreanUrl)
    && (!source || (source === 'original' ? item.sourceType !== 'reprint' : item.sourceType === source))
    && (!needle || normalizeSearch([item.title, item.originalTitle, item.summary, ...item.participants, ...item.works, item.date ?? ''].join(' ')).includes(needle)))
    .sort((a, b) => {
      if (!a.date && !b.date) return a.title.localeCompare(b.title, 'ko');
      if (!a.date) return 1;
      if (!b.date) return -1;
      const direction = sort === 'newest' ? -1 : 1;
      const year = a.date.slice(0, 4).localeCompare(b.date.slice(0, 4));
      if (year) return year * direction;
      // 연도·월만 아는 자료는 같은 기간의 정확한 날짜 뒤에 둡니다.
      if (a.date.length === 4 && b.date.length !== 4) return 1;
      if (b.date.length === 4 && a.date.length !== 4) return -1;
      const month = a.date.slice(5, 7).localeCompare(b.date.slice(5, 7));
      if (month) return month * direction;
      if (a.date.length === 7 && b.date.length > 7) return 1;
      if (b.date.length === 7 && a.date.length > 7) return -1;
      return a.date.localeCompare(b.date) * direction || a.id.localeCompare(b.id);
    });
}
