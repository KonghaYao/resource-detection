import { Router } from "../../deps.ts";
import { CrawlerController } from "./index.ts";

export const Crawler = new Router();

Crawler.get("/config/get", (ctx) => {
    ctx.body = JSON.stringify(CrawlerController.crawlerConfigs);
})
    .post("/config/set", (ctx) => {
        const data = ctx.request.body;
        const config = data.config;
        CrawlerController.addConfig(config);
    })
    .post("/", async (ctx) => {
        const data = ctx.request.body;
        const site = data.site;
        console.log(data.site);

        const config = data.config || CrawlerController.MatchSite(site);
        if (config) {
            const html = await fetch(site, {
                headers: {
                    "user-agent": "Googlebot",
                },
            }).then((res) => res.text());

            ctx.body = JSON.stringify({
                originURL: site,
                ...CrawlerController.getMessageFromHTML(html, config),
            });
        } else {
            ctx.body = JSON.stringify({
                error: "没有解析器",
            });
        }
    });
