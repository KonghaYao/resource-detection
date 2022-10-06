import { describe, expect, it } from "vitest";
import { decode, encode, strToBuffer } from "./index";

describe("测试", () => {
    it("加解密测试", async () => {
        const mock = await Promise.all(
            [...Array(2).keys()].map(async (i) => {
                const buffers = await Promise.all(
                    [...Array(10).keys()].map(async (i) => {
                        return new Uint8Array(await strToBuffer(i.toString()));
                    })
                );
                return {
                    mime: i.toString(),
                    buffers,
                };
            })
        );
        const data = await encode({
            data: mock,
            slice: [],
        });
        const { data: output } = await decode(data);

        expect(output).toEqual(mock);
    });
});
