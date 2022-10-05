import { atom } from "@cn-ui/use";

/** 记录 blob URL 的创建映射 */
export const urlStore = atom(new Map<string, Blob | MediaSource>(), {
    equals: false,
});
console.log(urlStore());
let _createObjectURL = globalThis.URL.createObjectURL;
globalThis.URL.createObjectURL = function (any: Blob | MediaSource) {
    const url = _createObjectURL(any);
    urlStore((i) => {
        i.set(url, any);
        return i;
    });
    return url;
};
