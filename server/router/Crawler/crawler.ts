import { Router } from "../../deps.ts";
import { MatchSite, getMessageFromHTML } from "./index.ts";

export const Crawler = new Router();

Crawler.post("/", async (ctx) => {
    const data = ctx.request.body;
    const site = data.site;
    console.log(data);

    const config = data.config || MatchSite(site);
    if (config) {
        const html = await fetch(site, {
            headers: {
                "user-agent": "Googlebot",
            },
        }).then((res) => res.text());

        ctx.body = JSON.stringify({
            originURL: site,
            ...getMessageFromHTML(html, config),
        });
    } else {
        ctx.body = JSON.stringify({
            error: "没有解析器",
        });
    }
});
