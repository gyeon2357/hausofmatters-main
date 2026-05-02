import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

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
    fields: Record<string, string>;
  };

  const index: SearchItem[] = [];

  // ── Albums ──────────────────────────────────────────────
  for (const album of albums) {
    const rawArtist = album.data.artist as unknown;
    const artistId =
      typeof rawArtist === "string"
        ? rawArtist
        : typeof rawArtist === "object" &&
            rawArtist !== null &&
            "id" in rawArtist
          ? (rawArtist as { id: string }).id
          : undefined;

    const artistName = artistId
      ? (artistMap.get(artistId) ?? artistId)
      : undefined;

    const fields: Record<string, string> = {};
    if (artistName) fields["아티스트"] = artistName;
    if (album.data.category) fields["카테고리"] = album.data.category;
    if (album.data.editor) fields["에디터"] = album.data.editor;
    if (album.data.release) {
      fields["발매일"] = new Date(album.data.release).toLocaleDateString(
        "ko-KR",
      );
    }
    if (album.data.tracks?.length) {
      fields["트랙"] = album.data.tracks.join(", ");
    }
    if (album.data.magazine) fields["매거진"] = album.data.magazine;

    index.push({
      type: "album",
      url: `/albums/${album.id}`,
      displayTitle: album.data.name,
      fields,
    });
  }

  // ── Magazine ─────────────────────────────────────────────
  for (const issue of magazine) {
    const id = issue.id;
    let displayTitle = id.toUpperCase();
    if (/^w-hom-(\d+)$/.test(id))
      displayTitle = id.replace(/^w-hom-(\d+)$/, "w/HOM #$1");
    else if (/^hom-(\d+)$/.test(id))
      displayTitle = id.replace(/^hom-(\d+)$/, "HOM #$1");

    const slug = issue.data.slug ?? id;

    const fields: Record<string, string> = {};
    fields["종류"] =
      issue.data.category === "w-hom"
        ? "해외힙합 매거진 w/HOM"
        : "한국힙합 매거진 HOM";
    if (issue.data.date) {
      fields["날짜"] = new Date(issue.data.date).toLocaleDateString("ko-KR");
    }

    index.push({
      type: "magazine",
      url: `/magazine/${slug}`,
      displayTitle,
      fields,
    });
  }

  // ── Interview ────────────────────────────────────────────
  for (const interview of interviews.filter(i => i.data.published)) {
    const artistId = String(interview.data.artist);
    const stageName = artistMap.get(artistId) ?? artistId;
    const artist = artists.find(a => a.id === artistId);

    const fields: Record<string, string> = {};
    fields["아티스트"] = stageName;
    if (artist?.data.genre) fields["장르"] = artist.data.genre;
    if (interview.data.date) {
      fields["날짜"] = new Date(interview.data.date).toLocaleDateString(
        "ko-KR",
      );
    }

    index.push({
      type: "interview",
      url: `/interview/${interview.id}`,
      displayTitle: stageName,
      fields,
    });
  }

  // ── Feature ──────────────────────────────────────────────
  for (const feature of features.filter(f => f.data.published)) {
    const displayTitle = feature.id
      .replace(/-/g, " ")
      .replace(/\b\w/g, c => c.toUpperCase());

    const fields: Record<string, string> = {};
    if (feature.data.artist) fields["아티스트"] = feature.data.artist;
    if (feature.data.category) fields["카테고리"] = feature.data.category;
    if (feature.data.date) {
      fields["날짜"] = new Date(feature.data.date).toLocaleDateString("ko-KR");
    }
    if (feature.data.link) fields["링크"] = feature.data.link;

    index.push({
      type: "feature",
      url: `/feature/${feature.id}`,
      displayTitle,
      fields,
    });
  }

  return new Response(JSON.stringify(index), {
    headers: { "Content-Type": "application/json" },
  });
};
