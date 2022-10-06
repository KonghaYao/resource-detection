import { Action } from "@cn-ui/command-palette";
import { atom } from "@cn-ui/use";
import { getExt } from "../ui/getExt";
import { mockXHR } from "net-mock";

export interface AjaxSource extends Partial<Action> {
    type: "ajax";
    src: string;
}
/** 记录所有 Ajax 的参数 */
export const ajaxSource = atom<AjaxSource[]>([], { equals: false });

mockXHR({
    proxy(res) {
        const Url = new URL(res.url || "", location.href);
        ajaxSource((i) => [
            ...i,
            {
                type: "ajax",
                id: Date.now().toString(),
                title: Url.pathname,
                subtitle: Url.toString(),
                src: Url.toString(),
                keywords: [
                    "ajax",
                    "xhr",
                    res.method,
                    getExt(Url.toString()),
                ].filter((i) => i),
            },
        ]);
    },
    silent: true,
});

/** 记录 fetch 的参数 */
const _fetch = globalThis.fetch;
globalThis.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
    let Url: URL;
    if (input instanceof URL) {
        Url = input;
    } else if (typeof input === "string") {
        Url = new URL(input, location.href);
    } else {
        Url = new URL(input.url, location.href);
    }
    ajaxSource((i) => [
        ...i,
        {
            type: "ajax",
            id: Date.now().toString(),
            title: Url.pathname,
            subtitle: Url.toString(),
            src: Url.toString(),
            keywords: [
                "ajax",
                "fetch",
                (input as any).method || init?.method || "GET",
                getExt(Url.toString()),
            ].filter((i) => i),
        },
    ]);
    return _fetch.call(this, input, init);
};
