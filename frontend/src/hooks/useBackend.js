import { useEffect, useRef, useState } from 'react';

/**
 * Static-first data loading.
 *
 *   const { data, status } = useBackend(() => mediumApi.getPosts(), {
 *     fallback: FALLBACK_ARTICLES,
 *     select: (res) => res.articles,
 *   });
 *
 * - `data` is the fallback immediately (no spinner, no layout shift).
 * - When the backend answers, `data` upgrades to the live result.
 * - `status` is 'loading' | 'live' | 'offline' so the UI can say which one
 *   the visitor is looking at.
 * - `merge(fallback, live)` lets a caller combine both instead of replacing.
 */
export default function useBackend(fetcher, { fallback = [], select = (r) => r, merge } = {}) {
  const [state, setState] = useState({ data: fallback, status: 'loading' });
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    let cancelled = false;
    fetcherRef
      .current()
      .then((res) => {
        if (cancelled) return;
        const live = select(res);
        if (!Array.isArray(live)) throw new Error('Unexpected response');
        setState({ data: merge ? merge(fallback, live) : live.length ? live : fallback, status: 'live' });
      })
      .catch(() => {
        if (!cancelled) setState({ data: fallback, status: 'offline' });
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return state;
}
