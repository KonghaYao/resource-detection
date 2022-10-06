import { Action, defineAction } from "@cn-ui/command-palette";
import { saveRecord } from "../proxy/mediasource";
import { urlStore } from "../proxy/ObjectUrl";
import { AutoLoad } from "./blob";

/** 检测是否为 Blob URL 并且为音视频 */
const IsBlobMedia = (args) => {
    const action = args.rootContext.target as Action & { src: string };
    return (
        action.src.startsWith("blob:") &&
        ["video", "audio"].some((i) => action.keywords.includes(i))
    );
};

export const MediaAll = defineAction({
    id: "msef-download-all",
    title: "自动加载并下载视频",
    subtitle: "通过自动加载进度条并下载 MSEF 文件",
    cond: IsBlobMedia,
    run(args) {
        const action = args.rootContext.target as Action & { src: string };
        const origin = urlStore().get(action.src);
        console.log(origin);
        if (origin instanceof MediaSource) {
            const dom: HTMLVideoElement = document.querySelector(
                `video[src='${action.src}']`
            );
            AutoLoad(origin, dom).then(() => {
                console.log("下载完成");
                saveRecord(origin, action.src);
            });
        } else {
            throw new Error("这个不是视频");
        }
    },
});

export const MediaNow = defineAction({
    id: "msef-download-now",
    title: "下载当前进度音视频",
    subtitle: "下载当前进度为 MSEF 文件",
    cond: IsBlobMedia,
    run(args) {
        const action = args.rootContext.target as Action & { src: string };
        const origin = urlStore().get(action.src);
        console.log("探测到原始blob数据", origin);
        if (origin instanceof MediaSource) {
            /** TODO 音视频轨道分开问题 */
            saveRecord(origin, action.src);
        } else {
            throw new Error("这个不是视频");
        }
    },
});
