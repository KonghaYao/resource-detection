import { Action } from "@cn-ui/command-palette";
import { atom } from "@cn-ui/use";
import { BatchInterceptor } from "@mswjs/interceptors";
import browserInterceptors from "@mswjs/interceptors/lib/presets/browser";
import { getExt } from "../ui/getExt";

const interceptor = new BatchInterceptor({
    name: "my-interceptor",
    interceptors: browserInterceptors,
});

interceptor.apply();

export interface AjaxSource extends Partial<Action> {
    type: "ajax";
    src: string;
}
/** 记录所有 Ajax 的参数 */
export const ajaxSource = atom<AjaxSource[]>([], { equals: false });
// This "request" listener will be called on both
// "http.ClientRequest" and "XMLHttpRequest" being dispatched.
interceptor.on("request", (res) => {
    const Url = new URL(res.url, location.href);
    ajaxSource((i) => [
        ...i,
        {
            type: "ajax",
            id: Date.now().toString(),
            title: Url.pathname,
            subtitle: Url.toString(),
            src: Url.toString(),
            keywords: ["ajax", res.method, getExt(Url.toString())].filter(
                (i) => i
            ),
        },
    ]);
});
