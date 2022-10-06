import { Action, defineAction } from "@cn-ui/command-palette";
import { atom } from "@cn-ui/use";
import { batch } from "solid-js";
import { getBody } from "../ui/App";
import { getExt } from "../ui/getExt";

export interface MediaResource extends Partial<Action> {
    type: "video" | "audio";
    src: string;
}

export const mediaStore = atom(
    new Map<
        HTMLVideoElement | HTMLSourceElement | HTMLAudioElement,
        MediaResource
    >(),
    { equals: false }
);

export const audioDetect = () => {
    batch(() => {
        const els = getBody();
        els.forEach((i) => {
            const videos = [
                ...i.querySelectorAll("audio[src]"),
                ...i.querySelectorAll("audio > source[src]"),
            ];
            videos.forEach((el: HTMLVideoElement | HTMLSourceElement) => {
                const src = new URL(el.getAttribute("src"), location.href);
                mediaStore((old) => {
                    old.set(el, {
                        type: "audio",
                        id: Math.random().toString(),
                        title: el.getAttribute("title") || src.pathname,
                        subtitle: src.toString(),
                        src: src.toString(),
                        keywords: ["audio", getExt(src.toString())],
                    });
                    return old;
                });
            });
        });
    });
};

/** 检测页面上的 video 标签 */
export const videoDetect = () => {
    batch(() => {
        const els = getBody();
        els.forEach((i) => {
            const videos = [
                ...i.querySelectorAll("video[src]"),
                ...i.querySelectorAll("video > source[src]"),
            ];
            videos.forEach((el: HTMLVideoElement | HTMLSourceElement) => {
                const src = new URL(el.getAttribute("src"), location.href);
                mediaStore((old) => {
                    old.set(el, {
                        type: "video",
                        id: Math.random().toString(),
                        title: el.getAttribute("title") || src.pathname,
                        subtitle: src.toString(),
                        src: src.toString(),
                        keywords: ["video", getExt(src.toString())],
                    });
                    return old;
                });
            });
        });
    });
};
