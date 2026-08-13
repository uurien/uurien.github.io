import { getCollection, type CollectionEntry } from 'astro:content';

// Every listing (homepage, /things) uses this: drafts and the bundled example
// Thing never show up, newest first.
export async function getPublishedThings(): Promise<CollectionEntry<'things'>[]> {
  const things = await getCollection('things', ({ data }) => !data.draft && !data.example);
  return things.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
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
