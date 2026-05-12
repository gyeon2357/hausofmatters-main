import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import fs from "fs";
import path from "path";

export const GET: APIRoute = async () => {
 const [albums, magazine, interviews, features, artists] = await Promise.all([
  getCollection("albums"),
  getCollection("magazine"),
  getCollection("interview"),
  getCollection("feature"),
  getCollection("artists"),
 ]);

 const artistMap = new Map(artists.map(a => [a.id, a.data.stage_name]));

 type SearchItem = {
  type: string;
  url: string;
  displayTitle: string;
  image?: string;
  fields: Record<string, string>;
 };

 const index: SearchItem[] = [];

 // 매거진/앨범/인터뷰 .md 본문 텍스트 추출 헬퍼
 function readBodyText(collection: string, id: string): string {
  try {
   const filePath = path.resolve(`./src/data/${collection}/${id}.md`);
   const raw = fs.readFileSync(filePath, "utf8");
   const body = raw.replace(/^---[\s\S]*?---/, "").trim();
   return body
    .replace(/!\[.*?\]\(.*?\)/g, "")  // 이미지 제거
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")  // 링크 텍스트만
    .replace(/#{1,6}\s*/g, "")  // 헤더 기호
    .replace(/\*\*([^*]+)\*\*/g, "$1")  // 볼드
    .replace(/\*([^*]+)\*/g, "$1")  // 이탤릭
    .replace(/<[^>]+>/g, " ")  // HTML 태그
    .replace(/&hairsp;/g, "")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
  } catch {
   return "";
  }
 }

 // ── Albums ──────────────────────────────────────────────
 for (const album of albums) {
  const rawArtist = album.data.artist as unknown;
  const artistId =
   typeof rawArtist === "string"
    ? rawArtist
    : typeof rawArtist === "object" && rawArtist !== null && "id" in rawArtist
      ? (rawArtist as { id: string }).id
      : undefined;

  const artistName = artistId ? (artistMap.get(artistId) ?? artistId) : undefined;

  const fields: Record<string, string> = {};
  if (artistName) fields["Artist"] = artistName;
  if (album.data.category) fields["Category"] = album.data.category;
  if (album.data.editor) fields["Editor"] = album.data.editor;
  if (album.data.release) fields["Release"] = new Date(album.data.release).toLocaleDateString("ko-KR");
  if (album.data.tracks?.length) fields["Tracks"] = album.data.tracks.join(", ");
  if (album.data.magazine) fields["Magazine"] = album.data.magazine;

  // 앨범 리뷰 본문
  const albumBody = readBodyText("albums", album.id);
  if (albumBody) fields["Review"] = albumBody;

  const image = album.data.image?.src ?? `/images/albums/${album.id}.jpg`;

  index.push({ type: "album", url: `/albums/${album.id}`, displayTitle: album.data.name, image, fields });
 }

 // ── Magazine ─────────────────────────────────────────────
 for (const issue of magazine) {
  const id = issue.id;
  let displayTitle = id.toUpperCase();
  if (/^w-hom-(\d+)$/.test(id)) displayTitle = id.replace(/^w-hom-(\d+)$/, "w/HOM #$1");
  else if (/^hom-(\d+)$/.test(id)) displayTitle = id.replace(/^hom-(\d+)$/, "HOM #$1");

  const slug = issue.data.slug ?? id;

  const fields: Record<string, string> = {};
  fields["Type"] = issue.data.category === "w-hom" ? "International Hip-Hop Magazine w/HOM" : "Korean Hip-Hop Magazine HOM";
  if (issue.data.date) fields["Date"] = new Date(issue.data.date).toLocaleDateString("ko-KR");
  fields["Title"] = displayTitle;

  // 본문 내용 (아티스트명, 앨범명 등) 검색 가능하게
  const bodyText = readBodyText("magazine", id);
  if (bodyText) fields["Content"] = bodyText;

  const image = issue.data.image?.src ?? `/images/magazine/thumb/${id}.jpg`;

  index.push({ type: "magazine", url: `/magazine/${slug}`, displayTitle, image, fields });
 }

 // ── Interview ────────────────────────────────────────────
 for (const interview of interviews.filter(i => i.data.published)) {
  // artist 필드 = 표시명 (ex. "DJ POOL"), interview.id = 파일명 (ex. "djpool")
  const displayName = interview.data.artist ?? interview.id;
  // artists 컬렉션 연결은 파일명(interview.id)으로
  const artist = artists.find(a => a.id === interview.id);

  const fields: Record<string, string> = {};
  fields["Artist"] = displayName;
  if (artist?.data.genre) fields["Genre"] = artist.data.genre;
  if (interview.data.date) fields["Date"] = new Date(interview.data.date).toLocaleDateString("ko-KR");

  const image = interview.data.coverImage?.src ?? artist?.data.image?.src ?? undefined;

  // 인터뷰 본문 (Q&A 텍스트)
  const interviewBody = readBodyText("interview", interview.id);
  if (interviewBody) fields["Content"] = interviewBody;

  index.push({ type: "interview", url: `/interview/${interview.id}`, displayTitle: displayName, image, fields });
 }

 // ── Feature ──────────────────────────────────────────────
 for (const feature of features.filter(f => f.data.published)) {
  const displayTitle = feature.id.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  const fields: Record<string, string> = {};
  if (feature.data.artist) fields["Artist"] = feature.data.artist;
  if (feature.data.category) fields["Category"] = feature.data.category;
  if (feature.data.date) fields["Date"] = new Date(feature.data.date).toLocaleDateString("ko-KR");
  if (feature.data.link) fields["Link"] = feature.data.link;

  const image = feature.data.coverImage?.src ?? undefined;

  index.push({ type: "feature", url: `/feature/${feature.id}`, displayTitle, image, fields });
 }

 return new Response(JSON.stringify(index), {
  headers: { "Content-Type": "application/json" },
 });
};
