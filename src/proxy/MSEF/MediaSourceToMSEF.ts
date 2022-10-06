import { combineBinary, encode, encodeToStream } from "./index";
import { SourceMap } from "../mediasource";

/** 非纯函数，需要使用到全局的存储库 */
export const MediaSourceToMSEF = async (media: MediaSource) => {
    return combineBinary(await MediaSourceToMSEFChunks(media));
};
export const MediaSourceToMSEFChunks = async (media: MediaSource) => {
    return encodeToStream({
        data: [...media.sourceBuffers].map((i) => {
            const origin = SourceMap().get(i);
            return {
                mime: origin.mime,
                buffers: origin.bufferList.map((i) => {
                    return i instanceof Uint8Array ? i : new Uint8Array(i);
                }),
                offsets: origin.offsets,
            };
        }),
        slice: [],
    });
};
