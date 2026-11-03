// Injects the server-rendered app into dist/index.html so the published page
// ships complete, crawlable HTML. Run after the client and SSR builds.
import { readFile, rm, writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const htmlPath = `${root}dist/index.html`;
const ssrDir = `${root}dist-ssr`;
const placeholder = "<!--app-html-->";

const template = await readFile(htmlPath, "utf8");
if (!template.includes(placeholder)) {
  throw new Error(`Prerender placeholder ${placeholder} not found in dist/index.html`);
}

const { render } = await import(pathToFileURL(`${ssrDir}/entry-server.js`).href);
const appHtml = render();

await writeFile(htmlPath, template.replace(placeholder, appHtml));
await rm(ssrDir, { recursive: true, force: true });

console.log(`Prerendered dist/index.html (${(appHtml.length / 1024).toFixed(1)} KB of app markup)`);
