import { defineConfig } from "tinacms";

export default defineConfig({
  branch: process.env.TINA_BRANCH || "main",
  clientId: process.env.TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },

  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public",
    },
  },

  // ─────────────────────────────────────────
  // 컬렉션 정의
  // ─────────────────────────────────────────
  schema: {
    collections: [

      // ── Album ─────────────────────────────
      {
        name: "album",
        label: "Album",
        path: "src/data/albums",
        format: "md",
        ui: {
          filename: {
            label: "파일명 (URL 슬러그)",
            description: "영문 소문자, 하이픈 사용. ex) black-dot",
          },
        },
        fields: [
          {
            type: "string",
            name: "name",
            label: "앨범명",
            required: true,
          },
          {
            type: "string",
            name: "artist",
            label: "아티스트",
            description: "artists 폴더에 파일이 있으면 파일명(ID)을, 없으면 이름을 직접 입력",
          },
          {
            type: "datetime",
            name: "release",
            label: "발매일",
            ui: {
              dateFormat: "YYYY-MM-DD",
            },
          },
          {
            type: "string",
            name: "category",
            label: "카테고리",
            options: ["hom", "w-hom"],
          },
          {
            type: "string",
            name: "magazine",
            label: "매거진 (연결)",
            description: "ex) hom-35 또는 w-hom-12",
          },
          {
            type: "string",
            name: "editor",
            label: "에디터",
          },
          {
            type: "image",
            name: "image",
            label: "커버 이미지",
          },
          {
            type: "string",
            name: "tracks",
            label: "트랙리스트",
            list: true,
            ui: {
              component: "list",
            },
          },
          {
            type: "rich-text",
            name: "body",
            label: "본문",
            isBody: true,
          },
        ],
      },

      // ── Artist ────────────────────────────
      {
        name: "artist",
        label: "Artist",
        path: "src/data/artists",
        format: "md",
        ui: {
          filename: {
            label: "파일명 (URL 슬러그)",
            description: "영문 소문자, 하이픈. ex) dj-pool",
          },
        },
        fields: [
          {
            type: "string",
            name: "stage_name",
            label: "활동명",
            required: true,
          },
          {
            type: "string",
            name: "genre",
            label: "장르",
          },
          {
            type: "object",
            name: "image",
            label: "프로필 이미지",
            fields: [
              { type: "image", name: "src", label: "이미지" },
              { type: "string", name: "alt", label: "대체 텍스트" },
            ],
          },
          {
            type: "string",
            name: "instagram",
            label: "인스타그램 핸들 (@ 제외)",
          },
          {
            type: "string",
            name: "soundcloud",
            label: "사운드클라우드 URL",
          },
          {
            type: "rich-text",
            name: "body",
            label: "소개",
            isBody: true,
          },
        ],
      },

      // ── Magazine ──────────────────────────
      {
        name: "magazine",
        label: "Magazine",
        path: "src/data/magazine",
        format: "md",
        ui: {
          filename: {
            label: "파일명 (URL 슬러그)",
            description: "ex) hom-35 또는 w-hom-12",
          },
        },
        fields: [
          {
            type: "string",
            name: "category",
            label: "종류",
            options: [
              { label: "HOM (한국힙합)", value: "hom" },
              { label: "w/HOM (해외힙합)", value: "w-hom" },
            ],
            required: true,
          },
          {
            type: "datetime",
            name: "date",
            label: "발행일",
            ui: {
              dateFormat: "YYYY-MM-DD",
            },
          },
          {
            type: "object",
            name: "image",
            label: "커버 이미지",
            fields: [
              { type: "image", name: "src", label: "이미지" },
              { type: "string", name: "alt", label: "대체 텍스트" },
            ],
          },
          {
            type: "rich-text",
            name: "body",
            label: "본문",
            isBody: true,
          },
        ],
      },

      // ── Interview ─────────────────────────
      {
        name: "interview",
        label: "Interview",
        path: "src/data/interview",
        format: "md",
        ui: {
          filename: {
            label: "파일명 (URL 슬러그)",
            description: "아티스트 ID와 동일하게. ex) dj-pool",
          },
        },
        fields: [
          {
            type: "string",
            name: "artist",
            label: "아티스트 ID",
            description: "artists 폴더의 파일명과 일치해야 연결됩니다. ex) dj-pool",
            required: true,
          },
          {
            type: "datetime",
            name: "date",
            label: "발행일",
            ui: {
              dateFormat: "YYYY-MM-DD",
            },
          },
          {
            type: "boolean",
            name: "published",
            label: "공개 여부",
          },
          {
            type: "object",
            name: "coverImage",
            label: "커버 이미지",
            fields: [
              { type: "image", name: "src", label: "이미지" },
              { type: "string", name: "alt", label: "대체 텍스트" },
            ],
          },
          {
            type: "rich-text",
            name: "body",
            label: "본문 (Q&A)",
            isBody: true,
            description: "**볼드 단락** = 질문, 일반 단락 = 답변",
          },
        ],
      },

      // ── Feature ───────────────────────────
      {
        name: "feature",
        label: "Feature",
        path: "src/data/feature",
        format: "md",
        ui: {
          filename: {
            label: "파일명 (URL · 제목)",
            description: "영문 소문자, 하이픈. 파일명이 페이지 제목이 됩니다. ex) black-dot-review",
          },
        },
        fields: [
          {
            type: "string",
            name: "artist",
            label: "아티스트 (선택)",
          },
          {
            type: "datetime",
            name: "date",
            label: "날짜",
            ui: {
              dateFormat: "YYYY-MM-DD",
            },
            required: true,
          },
          {
            type: "string",
            name: "category",
            label: "카테고리",
            description: "ex) 공연후기, 앨범리뷰, 칼럼",
            required: true,
          },
          {
            type: "object",
            name: "coverImage",
            label: "커버 이미지",
            fields: [
              { type: "image", name: "src", label: "이미지" },
              { type: "string", name: "alt", label: "대체 텍스트" },
            ],
          },
          {
            type: "string",
            name: "link",
            label: "연결 링크 (선택)",
            description: "앨범 ID (ex. 6seoul) 또는 매거진 ID (ex. hom-35) 입력 시 버튼 생성",
          },
          {
            type: "boolean",
            name: "published",
            label: "공개 여부",
          },
          {
            type: "rich-text",
            name: "body",
            label: "본문",
            isBody: true,
          },
        ],
      },

    ],
  },
});