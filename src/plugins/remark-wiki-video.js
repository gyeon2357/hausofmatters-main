/**
 * remark-wiki-video.js
 *
 * Markdown 본문에서 WikiWikiWiki 스타일 embed 문법을 HTML iframe으로 변환합니다.
 * remark가 URL을 link 노드로 먼저 변환하므로, text + link 혼합 노드를 모두 처리합니다.
 *
 * 지원 문법:
 *   (video: https://youtu.be/xxxxx)
 *   (video: https://youtu.be/xxxxx width: 80%)
 *   (video: https://youtu.be/xxxxx width: 100% height: 400px)
 *   (video: https://vimeo.com/123456789 width: 60%)
 */

// (video: URL [width: W] [height: H]) 패턴
// width/height 앞 공백 선택적 → "width:80%" 도 허용
const EMBED_RE =
  /\(video:\s*(https?:\/\/[^\s)]+)((?:\s*(?:width|height):\s*\d+(?:px|%|em|rem))*)\s*\)/gi;

function parseOptions(optStr) {
  const w = optStr.match(/width:\s*(\d+(?:px|%|em|rem))/i);
  const h = optStr.match(/height:\s*(\d+(?:px|%|em|rem))/i);
  return { width: w ? w[1] : null, height: h ? h[1] : null };
}

function getYouTubeId(url) {
  const m =
    url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/) ||
    url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
  return m ? m[1] : null;
}

function getVimeoId(url) {
  const m = url.match(/vimeo\.com\/(\d+)/);
  return m ? m[1] : null;
}

function buildIframe(url, width, height) {
  const ytId = getYouTubeId(url);
  const vimeoId = getVimeoId(url);

  const iframeStyle = height ? ` style="height:${height}"` : "";
  const figureStyle = width ? ` style="width:${width};max-width:100%"` : "";

  let src = null;
  let allow = "";

  if (ytId) {
    src = `https://www.youtube.com/embed/${ytId}`;
    allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
  } else if (vimeoId) {
    src = `https://player.vimeo.com/video/${vimeoId}`;
    allow = "autoplay; fullscreen; picture-in-picture";
  }

  if (!src) return null;

  return `<figure class="video-embed"${figureStyle}><iframe${iframeStyle} src="${src}" frameborder="0" allow="${allow}" allowfullscreen loading="lazy"></iframe></figure>`;
}

/**
 * paragraph children(text + link 혼합)을 하나의 문자열로 평탄화.
 * remark autolink가 URL을 link 노드로 변환하므로, link.url을 그대로 삽입합니다.
 */
function flattenToString(children) {
  return children
    .map((child) => {
      if (child.type === "text") return child.value;
      if (child.type === "link") return child.url;
      return "";
    })
    .join("");
}

function walkTree(node, index, parent, cb) {
  if (node.type === "paragraph") {
    cb(node, index, parent);
  }
  if (Array.isArray(node.children)) {
    for (let i = node.children.length - 1; i >= 0; i--) {
      walkTree(node.children[i], i, node, cb);
    }
  }
}

export function remarkWikiVideo() {
  return (tree) => {
    walkTree(tree, 0, null, (node, index, parent) => {
      if (!parent || index == null) return;

      const str = flattenToString(node.children);

      EMBED_RE.lastIndex = 0;
      if (!EMBED_RE.test(str)) return;
      EMBED_RE.lastIndex = 0;

      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = EMBED_RE.exec(str)) !== null) {
        const before = str.slice(lastIndex, match.index);
        if (before.trim()) parts.push({ type: "text", value: before });

        const [, url, optStr] = match;
        const { width, height } = parseOptions(optStr);
        const html = buildIframe(url, width, height);

        parts.push(
          html
            ? { type: "html", value: html }
            : { type: "text", value: match[0] }
        );

        lastIndex = match.index + match[0].length;
      }

      const after = str.slice(lastIndex);
      if (after.trim()) parts.push({ type: "text", value: after });

      const hasEmbed = parts.some((p) => p.type === "html");
      if (!hasEmbed) return;

      const hasText = parts.some((p) => p.type === "text" && p.value.trim());

      if (!hasText) {
        parent.children.splice(
          index,
          1,
          ...parts.map((p) => ({ type: "html", value: p.value }))
        );
      } else {
        const newNodes = parts.map((p) =>
          p.type === "html"
            ? { type: "html", value: p.value }
            : { type: "paragraph", children: [{ type: "text", value: p.value }] }
        );
        parent.children.splice(index, 1, ...newNodes);
      }
    });
  };
}
