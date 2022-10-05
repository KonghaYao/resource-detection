import { Action, defineAction } from "@cn-ui/command-palette";
import { saveAs } from "file-saver";
import { saveRecord, Source, SourceMap } from "../proxy/mediasource";
import { urlStore } from "../proxy/ObjectUrl";
import { getName } from "../ui/getName";

const AutoLoad = async (origin: MediaSource, video: HTMLVideoElement) => {
    const buffer = origin.sourceBuffers[0];
    console.warn("开始视频自动加载");
    let last = 0;
    await new Promise((resolve) => {
        const update = () => {
            if (
                buffer.buffered.length === 1 &&
                buffer.buffered.start(0) === 0 &&
                buffer.buffered.end(0) === origin.duration
            ) {
                resolve(null);
            }
            try {
                const a = buffer.buffered.end(0) + 1;
                if (last === a) return;
                video.currentTime = a;
                last = a;
                console.log((a * 100) / origin.duration, "%");
            } catch (e) {
                setTimeout(() => {
                    update();
                }, 10);
            }
        };
        video.currentTime = 0;
        buffer.onupdateend = update;
        update();
    });
    console.warn("视频自动加载完成, 等待下载完成");
    return true;
};

export const BlobAction = defineAction({
    id: "blob-download",
    title: "Blob 下载",
    subtitle: "通过 Blob 下载文件",
    cond(args) {
        const action = args.rootContext.target as Action & { src: string };
        return action.src.startsWith("blob:");
    },
    run(args) {
        const action = args.rootContext.target as Action & { src: string };
        const origin = urlStore().get(action.src);
        console.log(origin);
        if (origin instanceof MediaSource) {
            const dom: HTMLVideoElement = document.querySelector(
                `video[src='${action.src}']`
            );
            AutoLoad(origin, dom)
                .then(() => {
                    console.log("视频自动加载完成");
                })
                .then(() => {
                    [...origin.sourceBuffers].forEach((col) => {
                        const record = SourceMap().get(col);

                        saveRecord(record, getName(action.src));
                        console.warn("需要等待视频加载完成");
                    });
                });
        } else {
            saveAs(new Blob([origin]), getName(action.src));
        }
    },
});

export const BlobNow = defineAction({
    id: "blob-download-now",
    title: "Blob 下载当前进度",
    subtitle: "通过 Blob 下载当前视频进度的文件",
    cond(args) {
        const action = args.rootContext.target as Action & { src: string };
        return (
            action.src.startsWith("blob:") && action.keywords.includes("video")
        );
    },
    run(args) {
        const action = args.rootContext.target as Action & { src: string };
        const origin = urlStore().get(action.src);
        console.log("探测到原始blob数据", origin);
        if (origin instanceof MediaSource) {
            /** TODO 音视频轨道分开问题 */
            [...origin.sourceBuffers].forEach((buffer) => {
                const record = SourceMap().get(buffer);
                saveRecord(record, getName(action.src));
            });
        } else {
            throw new Error("这个不是视频");
        }
    },
});
