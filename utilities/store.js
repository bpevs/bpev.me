import "isomorphic-unfetch";
import { BASE_URL } from "../constants";

const store = {};

export async function fetchContent() {
  if (store.content) {
    return { content: store.content };
  }

  const response = await fetch(BASE_URL + "/content.json");
  const articles = await response.json();
  const articleMeta = articles.map(fetchArticle);
  const content = await Promise.all(articleMeta);

  return content;
}

async function fetchArticle(url) {
  const res = await fetch(BASE_URL + url + "/metadata.json");
  const metadata = await res.json();

  if (metadata.contentType === "article") {
    const res = await fetch(BASE_URL + url + "/README.md");
    const content = await res.text();
    metadata.content = content;
  } else if (metadata.contentType === "photo-album") {
    metadata.content = metadata.content.map(file => {
      return BASE_URL + url + "/full-resolution/" + file;
    });
  }

  return metadata;
}
