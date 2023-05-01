import { buildServerPath } from "../utils/useEnv";
export interface CrawlerConfig {
    matcher: string;
    target: {
        title: string;
        content: string;
    };
}
export interface CrawlerInputConfig {
    site: string;
    config?: CrawlerConfig;
}
export interface CrawlerResult {
    originURL: string;
    title: string;
    content: string;
}

export class CrawlerAPI {
    static crawl(crawl_input: CrawlerInputConfig) {
        return fetch(buildServerPath("/crawler/"), {
            method: "post",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(crawl_input),
        }).then<CrawlerResult>((res) => res.json());
    }
    static getConfigs() {
        return fetch(buildServerPath("/crawler/config/get")).then<
            CrawlerConfig[]
        >((res) => res.json());
    }
}
