import { kv } from "../useKV.ts";
import { load } from "https://esm.sh/cheerio@1.0.0-rc.12";
const { value } = await kv.get(["store", "crawler_config"]);
import { CrawlerConfig } from "../../../src/api/crawler.ts";
export class CrawlerController {
    private static CrawlerConfigs = JSON.parse(
        value || "[]"
    ) as CrawlerConfig[];
    addConfig(config: CrawlerConfig) {
        this.CrawlerConfigs.push(config);
        return kv.set(
            ["store", "crawler_config"],
            JSON.stringify(this.CrawlerConfigs)
        );
    }
    static get crawlerConfigs() {
        return this.CrawlerConfigs.map((i) => {
            return { ...i, matcher: new RegExp(i.matcher) };
        });
    }
    /** 从已有数据库中匹配使用方式 */
    static MatchSite(site: string) {
        return this.crawlerConfigs.find((i) => i.matcher.test(site));
    }
    /** 从 html 文件中匹配出数据 */
    static getMessageFromHTML(html: string, config: CrawlerConfig) {
        const $ = load(html);
        const data = Object.entries(config.target).map(([name, selector]) => {
            return [name, $.html($(selector))];
        });

        let style = "\n";
        $("style,link[rel=stylesheet]").each(function (i, elem) {
            style += $.html($(this));
        });

        const final = Object.fromEntries(data);
        final.content += style;
        return final;
    }
}
