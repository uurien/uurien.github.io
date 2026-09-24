import type { Activity } from './types';

// Bluesky's public AppView — no auth needed to read public posts.
const ENDPOINT = 'https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed';

const HANDLE = process.env.BLUESKY_HANDLE ?? 'ugaitz.info';

const PAGE_SIZE = 50; // API max is 100
const MAX_PAGES = 5;

type FeedItem = {
  reason?: unknown;
  reply?: unknown;
  post: {
    uri: string;
    indexedAt: string;
    record?: { text?: string; createdAt?: string };
    embed?: { images?: Array<{ thumb?: string; fullsize?: string }> };
  };
};

// Fetched at build time only — never from the visitor's browser.
export async function getBlueskyActivity(limit = 10): Promise<Activity[]> {
  try {
    // The API can't exclude reposts, so a page may hold fewer than `limit` own
    // posts. Fetch the next page until we have enough, with no date cutoff.
    const feed: FeedItem[] = [];
    let cursor: string | undefined;
    for (let page = 0; page < MAX_PAGES; page++) {
      const url = new URL(ENDPOINT);
      url.searchParams.set('actor', HANDLE);
      // Excludes replies at the API level; reposts are filtered out below.
      url.searchParams.set('filter', 'posts_no_replies');
      url.searchParams.set('limit', String(PAGE_SIZE));
      if (cursor) url.searchParams.set('cursor', cursor);

      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) {
        console.warn(`[activity/bluesky] ${res.status} ${res.statusText}, skipping`);
        return [];
      }

      const json = (await res.json()) as { feed?: FeedItem[]; cursor?: string };
      feed.push(...(json.feed ?? []).filter((item) => !item.reason && !item.reply));
      cursor = json.cursor;
      if (feed.length >= limit || !cursor || !json.feed?.length) break;
    }

    return feed.slice(0, limit).map((item): Activity => {
      const { post } = item;
      const rkey = post.uri.split('/').pop();
      const image = post.embed?.images?.[0];
      return {
        source: 'bluesky',
        text: post.record?.text,
        image: image?.fullsize ?? image?.thumb,
        url: `https://bsky.app/profile/${HANDLE}/post/${rkey}`,
        date: new Date(post.record?.createdAt ?? post.indexedAt),
      };
    });
  } catch (err) {
    console.warn('[activity/bluesky] fetch failed, omitting Bluesky activity for this build:', err);
    return [];
  }
}
