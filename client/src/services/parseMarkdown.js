export function splitMarkdown(markdown) {
  const match = markdown.match(/^(# .*$)\n([\s\S]*)/m);
  if (match) {
    const title = match[1];
    const body = match[2];
    return [title, body];
  } else {
    return [null, markdown];
  }
}
