export const getName = (string: string) => {
    return string.match(/.*\/([^?]*)/)[1] || "unknown-" + Math.random();
};
