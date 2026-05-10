import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";

const artists = defineCollection({
 loader: glob({ pattern: "**/*.md", base: "./src/data/artists" }),
 schema: z.object({
  name: z.string(),
  stage_name: z.string(),
  genre: z.string(),
  image: z
   .object({
    src: z.string(),
    alt: z.string(),
   })
   .optional(),
 }),
});

const magazine = defineCollection({
 loader: glob({ pattern: "**/*.md", base: "./src/data/magazine" }),
 schema: z.object({
  title: z.string().optional(),
  slug: z.string().optional(),
  pdfPath: z.string(),
  date: z.date(),
  category: z.enum(["hom", "w-hom"]).default("hom"), // ← 추가
  image: z
   .object({
    src: z.string(),
    alt: z.string(),
   })
   .optional(),
 }),
});

const albums = defineCollection({
 loader: glob({ pattern: "**/*.md", base: "./src/data/albums" }),
 schema: z.object({
  name: z.string(),
  image: z.object({ src: z.string(), alt: z.string().optional() }).optional(),
  release: z.date(),
  tracks: z.array(z.string()),
  artist: z.string().optional(),
  category: z.enum(["hom", "w-hom"]).default("hom"), // ← 추가
  editor: z.string().optional(), // ← 추가
  recommended: z.boolean().optional(), // ← 추가
  magazine: z.string().optional(), // ← 추가 (e.g. "hom-35")
 }),
});

const interview = defineCollection({
 loader: glob({ pattern: "**/*.md", base: "./src/data/interview" }),
 schema: z.object({
  artist: z.string().optional(),
  date: z.date(),
  published: z.boolean().default(true),
  coverImage: z
   .object({
    src: z.string(),
    alt: z.string(),
   })
   .optional(),
  // 본문은 마크다운으로 작성 (Q: **볼드**, A: 일반 단락)
  // text 필드 제거
 }),
});

const feature = defineCollection({
 loader: glob({ pattern: "**/*.md", base: "./src/data/feature" }),
 schema: z.object({
  // title 없음 → 파일명(id)이 URL이자 제목
  artist: z.string().optional(),          // 선택 입력
  date: z.date(),
  category: z.string(),
  coverImage: z
   .object({
    src: z.string(),
    alt: z.string(),
   })
   .optional(),
  link: z.string().optional(),            // 앨범 ID (ex. 6seoul) 또는 매거진 ID (ex. hom-35)
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
