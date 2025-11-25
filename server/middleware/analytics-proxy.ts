import { defineEventHandler, proxyRequest } from "h3";

export default defineEventHandler(async (event) => {
  // Only handle requests starting with your custom analytics path
  if (event.node.req.url?.startsWith("/my-analytics/")) {
    // Replace your custom prefix with the real Vercel Analytics endpoint
    if (event.node.req.url?.startsWith("/my-analytics/")) {
    const targetPath = event.node.req.url.replace(
      "/my-analytics",
      "/_vercel/insights"
    );

    return proxyRequest(event, `https://poddata.net${targetPath}`);
  }
});