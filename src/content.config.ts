import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const artists = defineCollection({
 loader: glob({ pattern: "**/*.md", base: "./src/data/artists" }),
 schema: z.object({
  name: z.string().optional(),
  stage_name: z.string(),
  genre: z.string().optional(),
  image: z.object({
   src: z.string(),
   alt: z.string().optional(),
  }).optional(),
 }),
});

const magazine = defineCollection({
 loader: glob({ pattern: "**/*.md", base: "./src/data/magazine" }),
 schema: z.object({
  title: z.string().optional(),
  slug: z.string().optional(),
  pdfPath: z.string(),
  date: z.date(),
  category: z.enum(["hom", "w-hom", "special"]).default("hom"),
  image: z.object({
   src: z.string(),
   alt: z.string().optional(),
  }).optional(),
  toc: z.string().optional(),
 }),
});

const albums = defineCollection({
 loader: glob({ pattern: "**/*.md", base: "./src/data/albums" }),
 schema: z.object({
  name: z.string(),
  image: z.object({
   src: z.string(),
   alt: z.string().optional(),
  }).optional(),
  release: z.date(),
  tracks: z.string(),
  artist: z.string().optional(),
  category: z.enum(["hom", "w-hom"]).default("hom"),
  editor: z.string().optional(),
  recommended: z.boolean().optional(),
  magazine: z.string().optional(),
  relatedAlbums: z.array(z.string()).optional(),
 }),
});

const interview = defineCollection({
 loader: glob({ pattern: "**/*.md", base: "./src/data/interview" }),
 schema: z.object({
  artist: z.string().optional(),
  date: z.date(),
  published: z.boolean().default(true),
  coverImage: z.object({
   src: z.string(),
   alt: z.string().optional(),
  }).optional(),
 }),
});

const feature = defineCollection({
 loader: glob({ pattern: "**/*.md", base: "./src/data/feature" }),
 schema: z.object({
  artist: z.string().optional(),
  date: z.date(),
  category: z.string(),
  coverImage: z.object({
   src: z.string(),
   alt: z.string().optional(),
  }).optional(),
  link: z.string().optional(),
  published: z.boolean().default(true),
 }),
});

export const collections = {
 artists,
 albums,
 magazine,
 interview,
 feature,
};
