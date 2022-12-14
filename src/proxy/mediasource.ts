/**
 * @zh 这个脚本代理 MediaSource 并且生成 SourceBuffer 记录
 * @description 修改自 https://github.com/Momo707577045/media-source-extract/blob/master/media-source-extract.user.js
 *
 */

import { atom } from "@cn-ui/use";
import { saveAs } from "file-saver";
import { MediaSourceToMSEF } from "./MSEF/MediaSourceToMSEF";
import { getName } from "../ui/getName";

// 流式下载支持度不广
// import streamSaver from "streamsaver";

// const streamSave = (chunks: Uint8Array[], name: string) => {
//     const fileStream = streamSaver.createWriteStream(name, {});
//     const writer = fileStream.getWriter();
//     chunks.forEach((i) => {
//         writer.write(i);
//     });
//     writer.close();
// };

export type Source = {
    mime: string;
    bufferList: ArrayBuffer[];
    offsets: number[];
    end: boolean;
    result?: Blob;
};
/** 所有的 MediaSource 加载的对应数据 */
export const SourceMap = atom(new Map<SourceBuffer, Source>(), {
    equals: false,
});
console.log(SourceMap());
export const saveRecord = async (records: MediaSource, name: string) => {
    const buffer = await MediaSourceToMSEF(records);
    saveAs(new Blob([buffer]), getName(name) + ".msef");
};
// 录取资源
let _addSourceBuffer = globalThis.MediaSource.prototype.addSourceBuffer;
globalThis.MediaSource.prototype.addSourceBuffer = function (mime) {
    let sourceBuffer: SourceBuffer = _addSourceBuffer.call(this, mime);
    let bufferList = [];
    let offsets = [];
    SourceMap((i) => {
        i.set(sourceBuffer, {
            mime,
            bufferList,
            offsets,
            end: false,
        });
        return i;
    });
    // 创建 SourceBuffer，但是经过代理后，添加 buffer 的操作可以被获悉
    let _append = sourceBuffer.appendBuffer;
    sourceBuffer.appendBuffer = function (
        this: SourceBuffer,
        buffer: BufferSource
    ) {
        console.log("接收到新分片");
        bufferList.push(buffer);
        offsets.push(this.timestampOffset);
        _append.call(this, buffer);
    };
    return sourceBuffer;
};
// 监听资源全部录取成功
let _endOfStream = globalThis.MediaSource.prototype.endOfStream;
globalThis.MediaSource.prototype.endOfStream = function (error) {
    // 资源捕获完成
    _endOfStream.call(this, error);
    console.log("视频加载完成");
    const record = SourceMap().get(this)!;
    record.end = true;
    const mime = record.mime.split(";")[0];
    const blob = new Blob(record.bufferList, { type: mime });
    record.result = blob;
};
