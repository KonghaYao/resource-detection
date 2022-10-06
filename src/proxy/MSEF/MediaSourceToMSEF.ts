import { decode, encode } from "./index";
import { SourceMap } from "../mediasource";

export const MediaSourceToMSEF = async (media: MediaSource) => {
    return encode({
        data: [...media.sourceBuffers].map((i) => {
            const origin = SourceMap().get(i);
            return {
                mime: origin.mime,
                buffers: origin.bufferList.map((i) => {
                    return i instanceof Uint8Array ? i : new Uint8Array(i);
                }),
            };
        }),
        slice: [],
    });
};
export const MSEFToMediaSource = async (buffer: Uint8Array) => {
    const { data: output } = await decode(buffer);
    const md = new MediaSource();
    console.log(md);
    md.addEventListener("sourceopen", () => {
        output.forEach(async (i) => {
            const source = md.addSourceBuffer(i.mime);
            let index = 0;
            const update = () => {
                const thisChunk = i.buffers[index];
                if (thisChunk instanceof Uint8Array) {
                    source.appendBuffer(thisChunk);
                    index += 1;
                } else {
                    console.warn("加载完毕");
                }
            };
            // source.onupdateend = update;
            update();
        });
    });
    return md;
};
