export interface CrawlerPageConfig {
    matcher: RegExp | string;
    target: {
        title: string;
        content: string;
    };
}

export const crawlerConfigs = (
    [
        {
            matcher: /https:\/\/juejin\.cn\/post\/.*/,
            target: {
                title: ".article-title",
                content: "article.article",
            },
        },
    ] as CrawlerPageConfig[]
).map((i) => {
    return { ...i, matcher: new RegExp(i.matcher) };
});

export const MatchSite = (site: string) => {
    return crawlerConfigs.find((i) => i.matcher.test(site));
};

import { load } from "https://esm.sh/cheerio@1.0.0-rc.12";
export const getMessageFromHTML = (html: string, config: CrawlerPageConfig) => {
    const $ = load(html);
    const data = Object.entries(config.target).map(([name, selector]) => {
        return [name, $.html($(selector))];
    });
    let total = "\n";
    $("style,link[rel=stylesheet]").each(function (i, elem) {
        total += $.html($(this));
    });
    const final = Object.fromEntries(data);
    final.content += total;
    return final;
};
