import { Atom, useEffectWithoutFirst } from "@cn-ui/use";
import type { CrawlerResult } from "../../api/crawler";
import { Show } from "solid-js";

export const Render = (props: { input: Atom<CrawlerResult> }) => {
    let iframe!: HTMLIFrameElement;
    useEffectWithoutFirst(() => {
        iframe.contentWindow?.location.reload();
        setTimeout(() => {
            iframe.contentWindow?.postMessage(JSON.stringify(props.input()));
        }, 1000);
    }, [props.input]);
    return (
        <section class="w-full h-full overflow-hidden flex flex-col ">
            <Show when={props.input()}>
                <header class="text-center">
                    {props.input().title || "标题"}

                    <a href={props.input().originURL} target="_blank">
                        🔗
                    </a>
                </header>
            </Show>
            <iframe
                class="w-full h-full flex-1"
                src="/render.html"
                ref={iframe}></iframe>
        </section>
    );
};
