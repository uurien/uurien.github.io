import type { Activity } from './types';

const USER = process.env.GITHUB_ACTIVITY_USER ?? 'uurien';
const ENDPOINT = `https://api.github.com/users/${USER}/events/public`;

// Optional: set GITHUB_TOKEN to raise the rate limit. In GitHub Actions the
// default `secrets.GITHUB_TOKEN` is enough — no extra secret needed for
// public activity. Not required for local builds.
const TOKEN = process.env.GITHUB_TOKEN;

type GithubEvent = {
  type: string;
  created_at: string;
  repo: { name: string };
  payload: {
    action?: string;
    release?: { name?: string; tag_name?: string; html_url?: string; body?: string };
  };
};

// Fetched at build time only — never from the visitor's browser.
// Only "meaningful" events are kept (releases, new public repos) — this is
// deliberately not a raw commit/push log.
export async function getGithubActivity(limit = 10): Promise<Activity[]> {
  try {
    const res = await fetch(ENDPOINT, {
      signal: AbortSignal.timeout(8000),
      headers: {
        Accept: 'application/vnd.github+json',
        ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
      },
    });
    if (!res.ok) {
      console.warn(`[activity/github] ${res.status} ${res.statusText}, skipping`);
      return [];
    }

    const events = (await res.json()) as GithubEvent[];
    const activity: Activity[] = [];

    for (const event of events) {
      if (event.type === 'ReleaseEvent' && event.payload.action === 'published') {
        const release = event.payload.release;
        activity.push({
          source: 'github',
          title: `${event.repo.name.split('/')[1]} ${release?.tag_name ?? ''}`.trim(),
          text: release?.body?.slice(0, 200),
          url: release?.html_url ?? `https://github.com/${event.repo.name}/releases`,
          date: new Date(event.created_at),
        });
      } else if (event.type === 'PublicEvent') {
        activity.push({
          source: 'github',
          title: `Open sourced ${event.repo.name.split('/')[1]}`,
          url: `https://github.com/${event.repo.name}`,
          date: new Date(event.created_at),
        });
      }
    }

    return activity.slice(0, limit);
  } catch (err) {
    console.warn('[activity/github] fetch failed, omitting GitHub activity for this build:', err);
    return [];
  }
}
