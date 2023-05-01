import { Router } from "../../deps.ts";
import { MeiliSearch } from "https://esm.sh/meilisearch";
const client = new MeiliSearch({
    host: "https://ms-bd967a8ba134-3483.sgp.meilisearch.io",
    apiKey: "f163182d5ca3b7f13b6cb7464e676eae3d399480",
});
const books = client.index("books");

const router = new Router();
router.post("/book/add", async (ctx) => {
    const body = ctx.request.body;
    ctx.body = await books.addDocuments([body]);
});
router.get("/book/search", async (ctx) => {
    const body = ctx.request.query;
    ctx.body = await books.search(body.q);
});
export { router as DatabaseRouter };
