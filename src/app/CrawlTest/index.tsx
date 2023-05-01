import { atom, resource, useEffectWithoutFirst } from "@cn-ui/use";
import { Render } from "../render";
import {
    CrawlerAPI,
    CrawlerInputConfig,
    CrawlerResult,
} from "../../api/crawler";

export const CrawlTestPage = () => {
    const data = atom<CrawlerInputConfig | null>(null);
    const testRunner = resource<CrawlerResult>(
        async () => {
            return CrawlerAPI.crawl(data()!);
        },
        { immediately: false }
    );

    return (
        <section class="flex gap-4 h-full">
            <section class="h-full">
                <div>爬虫测试面板</div>
                <form
                    onsubmit={(e) => {
                        e.preventDefault();
                        const fd = new FormData(e.target as HTMLFormElement);
                        data({
                            site: fd.get("target") as string,
                            config: {
                                matcher: fd.get("matcher") as string,
                                target: {
                                    title: fd.get("title") as string,
                                    content: fd.get("content") as string,
                                },
                            },
                        });
                        testRunner.refetch();
                    }}>
                    <label>
                        目标网址
                        <input type="url" name="target"></input>
                    </label>
                    <label>
                        正则匹配
                        <input type="text" name="matcher" />
                    </label>
                    <label>
                        标题匹配
                        <input type="text" name="title" />
                    </label>
                    <label>
                        内容匹配
                        <input type="text" name="content" />
                    </label>
                    <button type="submit">测试</button>
                </form>
            </section>

            <Render input={testRunner}></Render>
        </section>
    );
};
