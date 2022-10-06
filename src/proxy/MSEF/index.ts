export const strToBuffer = async (str: string) => {
    const blob = new Blob([str]);
    return blob.arrayBuffer();
};

export const bufferToStr = async (buffer: ArrayBuffer) => {
    const blob = new Blob([buffer]);
    return blob.text();
};
type Input = {
    data: { mime: string; buffers: Uint8Array[]; offsets: number[] }[];
    slice: number[];
};

const combineBinary = (parts: Uint8Array[]) => {
    const sum = parts.reduce((col, i) => {
        return col + i.byteLength;
    }, 0);
    const newOne = new Uint8Array(sum);
    let last = 0;
    parts.forEach((i) => {
        newOne.set(i, last);
        last += i.byteLength;
    });
    return newOne;
};

/**
 *
 *  JSON 信息长度 + 自定义分隔符 + JSON 信息 + 文件本体
 *
 */
export const encode = async (
    file: Input,
    splitString = "__DefaultString__"
) => {
    return combineBinary(await encodeToStream(file, splitString));
};

export const encodeToStream = async (
    file: Input,
    splitString = "__DefaultString__"
) => {
    const slices = file.data.flatMap((i) => {
        return i.buffers;
    });
    const newFile = {
        slice: [],
        data: file.data.map((i) => {
            return { ...i, buffers: [...i.buffers] };
        }),
    };
    const map = new Map<Uint8Array, number>();
    let sum = 0;
    newFile.slice = slices.map((buffer, index) => {
        const result = buffer.byteLength + sum;
        sum = result;
        map.set(buffer, index);
        return result;
    });
    newFile.data.forEach((i) => {
        /** @ts-ignore */
        i.buffers = i.buffers.map((buffer) => map.get(buffer));
    });
    map.clear();

    const info = new Uint8Array(await strToBuffer(JSON.stringify(newFile)));
    const header = new Uint8Array(
        await strToBuffer(info.byteLength.toString())
    );
    const key = new Uint8Array(await strToBuffer(splitString));
    const stream = [header, key, info, ...slices];
    return stream;
};
/**
 *
 *  总文件长 + 自定义分隔符 + JSON 信息 + 文件本体
 *
 */
export const decode = async (
    file: Uint8Array,
    splitString = "__DefaultString__"
) => {
    const key = new Uint8Array(await strToBuffer(splitString));
    let i = 0;
    for (; i < file.length; i++) {
        const element = file[i];
        if (element === key[0]) {
            const isSame = compareArray(key, file.subarray(i, i + key.length));
            if (isSame) {
                break;
            }
        }
    }
    const header = await bufferToStr(file.subarray(0, i));

    const resource = file.subarray(i + key.length + parseInt(header));
    const json = await bufferToStr(
        file.subarray(i + key.length, i + key.length + parseInt(header))
    );
    const data: Input = JSON.parse(json);
    let start = 0;

    // slice 记录的是结束位置
    const origin = data.slice.map((i) => {
        const it = resource.subarray(start, i);
        start = i;
        return it;
    });

    data.data.forEach((i) => {
        i.buffers = i.buffers.map((i) => origin[i as any]);
    });

    return data;
};

export const compareArray = (a: Uint8Array, b: Uint8Array) => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
};
