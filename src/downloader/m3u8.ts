import { Parser } from "m3u8-parser";

/** 解析 M3U8 文件为对象 */
export const IndexDecode = async (url: string) => {
    const text = await fetch(url, { cache: "force-cache" }).then((res) =>
        res.text()
    );
    const parser = new Parser();
    parser.push(text);
    parser.end();
    console.log("m3u8 Index Object ", parser.manifest);
    return parser.manifest;
};

/** 下载分片 */
export const SliceDownloader = async (
    data: { segments: { uri: string; duration: number }[] },
    baseUrl: string
) => {
    const urls = data.segments.map((i) => {
        return new URL(i.uri, baseUrl).toString();
    });
    const buffer = await Promise.all(
        urls.map((i) => fetch(i).then((res) => res.arrayBuffer()))
    );
    return new Blob(buffer);
};

/** M3U8 文件锁定下载，不需要手动操作的下载 */
export const m3u8Downloader = async (indexURL: string) => {
    const data = await IndexDecode(indexURL);
    return SliceDownloader(data, indexURL);
};

import { Action, defineAction } from "@cn-ui/command-palette";
import { saveAs } from "file-saver";
import { getName } from "../ui/getName";

export const M3U8Action = defineAction({
    id: "m3u8-download",
    title: "m3u8 视频分片下载",
    subtitle: "通过下载 m3u8 分片下载文件, 下载文件无法查看可能是后缀名问题",
    cond({ rootContext }) {
        const action = rootContext.target as Action;
        return [".m3u8", "video"].some((i) => {
            return action.keywords.includes(i);
        });
    },
    run(args) {
        const action = args.rootContext.target as Action & { src: string };
        m3u8Downloader(action.src).then((blob) => {
            saveAs(blob, getName(action.src) + ".flv");
        });
    },
});
