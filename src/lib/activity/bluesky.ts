import type { Activity } from './types';

// Bluesky's public AppView — no auth needed to read public posts.
const ENDPOINT = 'https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed';

const HANDLE = process.env.BLUESKY_HANDLE ?? 'uurien.bsky.social';

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
    const url = new URL(ENDPOINT);
    url.searchParams.set('actor', HANDLE);
    // Excludes replies at the API level; reposts are filtered out below.
    url.searchParams.set('filter', 'posts_no_replies');
    url.searchParams.set('limit', String(limit));

    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) {
      console.warn(`[activity/bluesky] ${res.status} ${res.statusText}, skipping`);
      return [];
    }

    const json = (await res.json()) as { feed?: FeedItem[] };
    const feed = json.feed ?? [];

    return feed
      .filter((item) => !item.reason && !item.reply)
      .map((item): Activity => {
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
