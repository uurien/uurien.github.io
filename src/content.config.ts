import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const things = defineCollection({
  // A leading underscore (e.g. `_draft.md`) fully excludes a file from the build.
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/things' }),
  schema: ({ image }) =>
    z.object({
      // Title shown on the card and the Thing page.
      title: z.string(),
      // Publish date. Used for sorting and for the "2026 / 2025 / ..." year groups on /things.
      date: z.coerce.date(),
      // One or two sentences shown on the homepage/archive card.
      description: z.string(),
      // Large cover photo used on cards and at the top of the Thing page.
      cover: image().optional(),
      coverAlt: z.string().optional(),
      // Optional links out to a live demo/site or the project's repo.
      externalUrl: z.url().optional(),
      githubUrl: z.url().optional(),
      tags: z.array(z.string()).default([]),
      // Where the overlaid text sits on the cover. Pick whichever corner the
      // photo leaves empty.
      textPosition: z
        .enum([
          'top-left',
          'top-center',
          'top-right',
          'middle-left',
          'middle-right',
          'bottom-left',
          'bottom-center',
          'bottom-right',
        ])
        .default('bottom-left'),
      // Hidden from every listing (homepage, /things) but still buildable at its own URL.
      draft: z.boolean().default(false),
      // Eligible for the homepage selection. The homepage picks the newest featured Things.
      featured: z.boolean().default(false),
      // Optional extra photos rendered as a gallery on the Thing page.
      gallery: z
        .array(
          z.object({
            src: image(),
            alt: z.string(),
            caption: z.string().optional(),
          })
        )
        .default([]),
      // Marks the bundled template Thing so it can be excluded from production listings.
      example: z.boolean().default(false),
    }),
});

export const collections = { things };
