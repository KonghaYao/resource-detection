import { decode } from "./index";

/** 纯函数，用于客户端解析 */
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
                    source.timestampOffset = i.offsets[index];
                    source.appendBuffer(thisChunk);
                    index += 1;
                } else {
                    console.warn("加载完毕");
                }
            };
            source.onupdateend = update;
            update();
        });
    });
    return md;
};
