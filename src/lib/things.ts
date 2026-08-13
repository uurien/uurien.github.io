import { getCollection, type CollectionEntry } from 'astro:content';

// Every listing (homepage, /things) uses this: drafts and the bundled example
// Thing never show up, newest first.
export async function getPublishedThings(): Promise<CollectionEntry<'things'>[]> {
  const things = await getCollection('things', ({ data }) => !data.draft && !data.example);
  return things.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/**
 * Assigns each card a width in columns of a 12-column grid, cycling through a
 * pattern so rows alternate instead of every card being the same size.
 * A card that would end up alone on its row is widened to the full width,
 * so the grid never ends with a lone narrow card and a big empty gap.
 */
export function assignSpans(count: number, pattern: number[]): number[] {
  const spans: number[] = [];
  let col = 0;

  for (let i = 0; i < count; i++) {
    let span = pattern[i % pattern.length]!;
    if (col + span > 12) col = 0; // doesn't fit, so it starts a new row
    if (i === count - 1 && col === 0) span = 12;
    spans.push(span);
    col = (col + span) % 12;
  }

  return spans;
}

export function groupByYear(things: CollectionEntry<'things'>[]) {
  const years = new Map<number, CollectionEntry<'things'>[]>();
  for (const thing of things) {
    const year = thing.data.date.getFullYear();
    const bucket = years.get(year);
    if (bucket) bucket.push(thing);
    else years.set(year, [thing]);
  }
  return [...years.entries()].sort((a, b) => b[0] - a[0]);
}
