import { Action, defineAction } from "@cn-ui/command-palette";
import { atom } from "@cn-ui/use";
import { batch } from "solid-js";
import { getBody } from "../ui/App";
import { getExt } from "../ui/getExt";

export interface VideoResource extends Partial<Action> {
    type: "video";
    src: string;
}

export const videoStore = atom(
    new Map<HTMLVideoElement | HTMLSourceElement, VideoResource>(),
    { equals: false }
);

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
                videoStore((old) => {
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
