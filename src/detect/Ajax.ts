// http://dongzhongzhidong.gitee.io/polly.js/#/
import { Polly } from "@pollyjs/core";
import XHRAdapter from "@pollyjs/adapter-xhr";
import FetchAdapter from "@pollyjs/adapter-fetch";
import { InMemoryPersister } from "./Persister";
import { atom } from "@cn-ui/use";
import { Action } from "@cn-ui/command-palette";
import { getExt } from "../ui/getExt";
Polly.register(XHRAdapter);
Polly.register(FetchAdapter);
/**@ts-ignore */
Polly.register(InMemoryPersister);

const polly = new Polly("KongHaYao's Resource Detection", {
    adapters: ["xhr", "fetch"],
    persister: "persister",
});
export interface AjaxSource extends Partial<Action> {
    type: "ajax";
    src: string;
}
/** 记录所有 Ajax 的参数 */
export const ajaxSource = atom<AjaxSource[]>([], { equals: false });
polly.server.any("*").on("response", (req, res) => {
    const data = req;
    ajaxSource((i) => [
        ...i,
        {
            type: "ajax",
            id: data.timestamp + Math.random(),
            title: new URL(data.absoluteUrl).pathname,
            subtitle: data.absoluteUrl,
            src: data.absoluteUrl,
            keywords: [
                "ajax",
                data.method,
                data.body && "has body",
                getExt(data.absoluteUrl),
            ].filter((i) => i),
        },
    ]);
});
