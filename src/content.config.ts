import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";

const posts = defineCollection({
  loader: glob({base:"./src/content/posts", pattern: "**/*.{md,mdx}"}),
  schema:({image})=>{
    return z.object({
      title: z.string(),
      description: z.string().optional(),
      pubDate: z.coerce.date(),
      heroImage: image().optional(),
    })
  }
})

export const collections = {
  posts
}