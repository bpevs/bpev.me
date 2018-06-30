import "isomorphic-unfetch";
import { BASE_URL } from "../constants";

const store = {};

export async function fetchContent() {
  if (store.content) {
    return { content: store.content };
  }

  const response = await fetch(BASE_URL + "/content.json");
  const { articles } = await response.json();
  const articleMeta = articles.map(fetchArticle);
  const content = await Promise.all(articleMeta);

  return content;
}

async function fetchArticle(url) {
  const [ content, metadata ] = await Promise.all([
    fetch(BASE_URL + url + "/README.md").then(res => res.text()),
    fetch(BASE_URL + url + "/metadata.json").then(res => res.json()),
  ]);
  return Object.assign({}, metadata, { content });
}
