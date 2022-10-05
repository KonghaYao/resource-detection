import { test, expect, it } from "vitest";

import { urlStore } from "./ObjectUrl";

test("createURL", () => {
    it("Record BlobURL", () => {
        const testString = "123456789";
        const a = URL.createObjectURL(new Blob([testString]));
        expect(urlStore().get(a)).toBe(testString);
    });
});
