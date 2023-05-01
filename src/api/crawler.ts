import { buildServerPath } from "../utils/useEnv";

export interface CrawlerConfig {
    site: string;
    config?: {
        matcher: string;
        target: {
            title: string;
            content: string;
        };
    };
}

export class CrawlerAPI {
    static crawl(crawl_input: CrawlerConfig) {
        return fetch(buildServerPath("/crawler/"), {
            method: "post",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(crawl_input),
        }).then((res) => res.json());
    }
}
