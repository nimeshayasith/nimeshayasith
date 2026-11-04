/**
 * Where my writing and videos live. Shared by the app and by scripts/fetch-feeds.mjs.
 *
 * Content updates itself in two layers:
 *   1. At build time, scripts/fetch-feeds.mjs pulls every source below into a bundled
 *      snapshot (src/data/feeds.snapshot.json). Amplify rebuilds daily (EventBridge
 *      Scheduler in terraform/) and on every git push, so new posts appear on their own.
 *   2. In the browser, Medium (via my backend), dev.to and YouTube are asked again, so a
 *      visitor sees something published an hour ago without any redeploy.
 */
export const FEEDS = {
  medium: { user: 'nimeshayasith', profileUrl: 'https://medium.com/@nimeshayasith' },

  devto: { user: 'nimeshayasith', profileUrl: 'https://dev.to/nimeshayasith' },

  youtube: {
    channelId: 'UCKlC_6m88sM4wse36rB1Zxw', // https://www.youtube.com/@nimeshayasith7138
    handle: '@nimeshayasith7138',
    channelUrl: 'https://www.youtube.com/@nimeshayasith7138',
  },

  /**
   * AWS Builder Center has no public per-author feed, so there are two ways in:
   *  - articleUrls: paste the link of each article you published there (the build reads the
   *    title, summary, date and tags from the page itself);
   *  - authorName: the build also scans Builder Center's public RSS for recent articles whose
   *    author meta tag matches this name, which catches new posts by itself.
   */
  awsBuilder: {
    authorName: 'Nimesha Yasith',
    profileUrl: 'https://builder.aws.com?inviteId=cbdfb049-27aa-4269-99f7-78127e901eba',
    articleUrls: [
      // 'https://builder.aws.com/content/<id>/<slug>',
    ],
  },
};

export const SOURCES = {
  medium: { label: 'Medium', color: '#e5e7eb' },
  devto: { label: 'DEV', color: '#a78bfa' },
  aws: { label: 'AWS Builder', color: '#ff9900' },
};
