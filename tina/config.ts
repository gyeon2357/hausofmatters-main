import { defineConfig } from "tinacms";

const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,
  clientId: process.env.TINA_CLIENT_ID,
  token: process.env.TINA_TOKEN,

  search: {
    tina: {
      indexerToken: process.env.TINA_SEARCH_TOKEN,
      stopwordLanguages: ["kor", "eng"],
    },
  },

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

  schema: {
    collections: [

      // ── Magazine ──────────────────────────
      {
        name: "magazine",
        label: "Magazine",
        path: "src/data/magazine",
        format: "md",
        ui: {
          filename: {
            label: "Page Name (Filename)",
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
          },
          {
            type: "datetime",
            name: "date",
            label: "발행일",
            ui: { dateFormat: "YYYY-MM-DD" },
          },
          {
            type: "string",
            name: "pdfPath",
            label: "PDF 경로",
            description: "로컬: /pdf/hom-35.pdf  /  외부 URL: https://...",
          },
          {
            type: "object",
            name: "image",
            label: "커버 이미지",
            fields: [
              { type: "image", name: "src", label: "이미지 업로드" },
              { type: "string", name: "alt", label: "대체 텍스트 (선택)" },
            ],
          },
          {
            type: "string",
            name: "toc",
            label: "목차",
            ui: {
              component: "textarea",
            },
            description: "줄바꿈 그대로 표시됩니다. 붙여넣기 바로 사용 가능",
          },
        ],
      },

      // ── Album ─────────────────────────────
      {
        name: "album",
        label: "Album",
        path: "src/data/albums",
        format: "md",
        ui: {
          filename: {
            label: "Page Name (Filename)",
            description: "영문 소문자, 하이픈. ex) black-dot",
          },
          allowedActions: {
            create: true,
            delete: true,
            createNestedFolder: false,
          },
        },
        fields: [
          {
            type: "string",
            name: "name",
            label: "앨범명",
          },
          {
            type: "string",
            name: "artist",
            label: "아티스트",
            description: "artists 폴더 파일이 있으면 파일명(ID)을, 없으면 이름 직접 입력",
          },
          {
            type: "datetime",
            name: "release",
            label: "발매일 ✱",
            ui: { dateFormat: "YYYY-MM-DD" },
          },
          {
            type: "string",
            name: "category",
            label: "카테고리",
            options: [
              { label: "HOM (한국힙합)", value: "hom" },
              { label: "w/HOM (해외힙합)", value: "w-hom" },
            ],
          },
          {
            type: "string",
            name: "magazine",
            label: "매거진 연결",
            description: "ex) hom-35 또는 w-hom-12",
          },
          {
            type: "string",
            name: "relatedAlbums",
            label: "관련 앨범 (선택)",
            list: true,
            description: "앨범 파일명(ID) 입력. ex) black, 6seoul",
          },
          {
            type: "string",
            name: "editor",
            label: "에디터",
          },
          {
            type: "boolean",
            name: "recommended",
            label: "Pick (추천)",
          },
          {
            type: "object",
            name: "image",
            label: "커버 이미지",
            fields: [
              { type: "image", name: "src", label: "이미지 업로드" },
              { type: "string", name: "alt", label: "대체 텍스트 (선택)" },
            ],
          },
          {
            type: "string",
            name: "tracks",
            label: "트랙리스트 ✱",
            ui: {
              component: "textarea",
            },
            description: "한 줄에 트랙 하나씩 입력. 자동으로 번호 리스트로 표시됩니다.",
          },
          {
            type: "rich-text",
            name: "body",
            label: "본문 (리뷰)",
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
            label: "Page Name (Filename)",
            description: "URL 슬러그. ex) dj-pool (아티스트명과 별개)",
          },
        },
        fields: [
          {
            type: "string",
            name: "artist",
            label: "아티스트명",
            description: "페이지에 표시되는 이름. ex) DJ POOL (띄어쓰기 가능)",
          },
          {
            type: "datetime",
            name: "date",
            label: "발행일",
            ui: { dateFormat: "YYYY-MM-DD" },
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
              { type: "image", name: "src", label: "이미지 업로드" },
              { type: "string", name: "alt", label: "대체 텍스트 (선택)" },
            ],
          },
          {
            type: "rich-text",
            name: "body",
            label: "본문 (Q&A)",
            isBody: true,
            description: "**볼드 단락** = 질문  /  일반 단락 = 답변",
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
            label: "Page Name (Filename)",
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
            ui: { dateFormat: "YYYY-MM-DD" },
          },
          {
            type: "string",
            name: "category",
            label: "카테고리",
            description: "ex) 공연후기, 앨범리뷰, 칼럼",
          },
          {
            type: "object",
            name: "coverImage",
            label: "커버 이미지",
            fields: [
              { type: "image", name: "src", label: "이미지 업로드" },
              { type: "string", name: "alt", label: "대체 텍스트 (선택)" },
            ],
          },
          {
            type: "string",
            name: "link",
            label: "연결 링크 (선택)",
            description: "앨범 ID (ex. 6seoul) 또는 매거진 ID (ex. hom-35) → 버튼 자동 생성",
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
