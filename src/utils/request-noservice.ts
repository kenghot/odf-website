import { concatQuery } from "./query-string";

export async function fetchNoService(
  baseUrl: string,
  queries: any,
  fileName?: string,
  fileType?: string
) {
  const url = queries ? `${baseUrl}?${concatQuery(queries)}` : baseUrl;
  const res = await fetch(url);
  const filename = res.headers.get("filename");
  const data = await res.blob();
  const fUrl = window.URL.createObjectURL(data);
  const link = document.createElement("a");
  link.href = fUrl;
  link.setAttribute(
    "download",
    filename ||
      `${fileName || "report"}${new Date().toISOString()}.${fileType || "xls"}`
  );
  document.body.appendChild(link);
  link.click();
  return;
}
