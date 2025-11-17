import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const posts = defineCollection({
  loader: glob({ base: "./src/content/posts", pattern: "**/*.{md,mdx}" }),
  schema: ({ image }) => {
    return z.object({
      title: z.string(),
      description: z.string().optional(),
      date: z.coerce.date(),
      tags: z.array(z.string()).optional().default([]),
      cover: z
        .object({
          image: image().optional(),
          hiddenInSingle: z.boolean().optional(),
        })
        .optional(),
      jsFiddle: z.string().optional(),
      preview: z
        .object({
          enabled: z.boolean(),
          height: z.number().optional(),
        })
        .optional(),
      bilibili: z.string().optional(),
      youtube: z.string().optional(),
      video: z
        .object({
          type: z.enum(["cloudinary", "mux"]),
          url: z.string(),
        })
        .optional(),
    });
  },
});

export const collections = {
  posts,
};
