export const getExt = (url: string) =>
    new URL(url).pathname.replace(/.*(\..*?)$/, "$1");
