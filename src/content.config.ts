import {  glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const posts = defineCollection({
  loader: glob({base:"./src/content/posts", pattern: "**/*.{md,mdx}"}),
  schema:({image})=>{
    return z.object({
      title: z.string(),
      description: z.string().optional(),
      date: z.coerce.date(),
      cover: z.object({
        image: image().optional(),
        hiddenInSingle: z.boolean().optional(),
      }).optional(),
      jsFiddle: z.string().optional(),
      preview: z.boolean().optional(),
    })
  }
})

export const collections = {
  posts
}