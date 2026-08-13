import { getBlueskyActivity } from './bluesky';
import { getGithubActivity } from './github';
import type { Activity } from './types';

export type { Activity };

// Combines every source into one normalized, time-sorted list. Each source
// fails independently (see bluesky.ts / github.ts) so one API being down
// never fails the whole build.
export async function getActivity(limit = 6): Promise<Activity[]> {
  const [bluesky, github] = await Promise.all([getBlueskyActivity(limit), getGithubActivity(limit)]);

  return [...bluesky, ...github].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, limit);
}
