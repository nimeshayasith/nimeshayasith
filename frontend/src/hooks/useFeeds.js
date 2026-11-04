import { useEffect, useState } from 'react';
import { devtoApi, mediumApi, youtubeApi } from '../services/api';
import { FEEDS } from '../data/feeds.config';
import {
  SNAPSHOT_ARTICLES, SNAPSHOT_VIDEOS, fromBackendMedium, fromDevto, fromYoutubeAtom, mergeArticles, mergeVideos,
} from '../data/feeds';

/**
 * Articles from every platform, static-first:
 *  - the bundled snapshot (refreshed at every build) renders immediately;
 *  - Medium (via the backend) and dev.to are then asked again and merged in, so anything published
 *    since the last build appears without a redeploy.
 * `status[source]` is 'loading' | 'live' | 'offline', for the little honesty badges.
 */
export function useArticles() {
  const [articles, setArticles] = useState(SNAPSHOT_ARTICLES);
  const [status, setStatus] = useState({ medium: 'loading', devto: 'loading' });

  useEffect(() => {
    let cancelled = false;
    const run = (key, promise, normalise) =>
      promise
        .then((res) => {
          if (cancelled) return;
          const live = normalise(res);
          setArticles((cur) => mergeArticles(cur, live));
          setStatus((s) => ({ ...s, [key]: 'live' }));
        })
        .catch(() => !cancelled && setStatus((s) => ({ ...s, [key]: 'offline' })));
    run('medium', mediumApi.getPosts(), fromBackendMedium);
    run('devto', devtoApi.getArticles(FEEDS.devto.user), fromDevto);
    return () => { cancelled = true; };
  }, []);

  return { articles, status };
}

/** YouTube videos: bundled snapshot first, then the channel's live Atom feed. */
export function useVideos() {
  const [videos, setVideos] = useState(SNAPSHOT_VIDEOS);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let cancelled = false;
    youtubeApi
      .getFeed(FEEDS.youtube.channelId)
      .then((xml) => {
        if (cancelled) return;
        const live = fromYoutubeAtom(xml);
        if (!live.length) throw new Error('empty');
        setVideos((cur) => mergeVideos(cur, live));
        setStatus('live');
      })
      .catch(() => !cancelled && setStatus('offline'));
    return () => { cancelled = true; };
  }, []);

  return { videos, status };
}
