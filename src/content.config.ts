import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";

const artists = defineCollection({
 loader: glob({ pattern: "**/*.md", base: "./src/data/artists" }),
 schema: z.object({
  name: z.string(),
  stage_name: z.string(),
  genre: z.string(),
  image: z.object({
   src: z.string(),
   alt: z.string(),
  }),
 }),
});

const magazine = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/magazine" }),
  schema: z.object({
    title: z.string().optional(),
    slug: z.string().optional(),
    pdfPath: z.string(),
    date: z.date(),
    category: z.enum(["hom", "w-hom"]).default("hom"),  // ← 추가
    image: z.object({
      src: z.string(),
      alt: z.string(),
    }).optional(),
  }),
});

const albums = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/albums" }),
  schema: z.object({
    name: z.string(),
    image: z.object({ src: z.string(), alt: z.string() }),
    publishDate: z.date(),
    tracks: z.array(z.string()),
    artist: reference("artists"),
    category: z.enum(["hom", "w-hom"]).default("hom"),  // ← 추가
    editor: z.string().optional(),  // ← 추가
  }),
});

const interview = defineCollection({
 loader: glob({ pattern: "**/*.md", base: "./src/data/interview" }),
 schema: z.object({
  artist: reference("artists"),
  date: z.date(),
  published: z.boolean().default(true),
  coverImage: z
   .object({
    src: z.string(),
    alt: z.string(),
   })
   .optional(),
  text: z.array(
   z.object({
    q: z.string(),
    a: z.array(
     z.object({
      text: z.string(),
      images: z
       .array(
        z.object({
         src: z.string(),
         alt: z.string(),
        })
       )
       .optional(),
     })
    ),
   })
  ),
 }),
});

export const collections = {
 artists,
 albums,
 magazine,
 interview,
};
