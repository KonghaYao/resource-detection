import { Action, defineAction } from "@cn-ui/command-palette";
export const CORSAction = defineAction({
    id: "cors-download",
    title: "跨域下载",
    subtitle: "通过跨域下载文件, 对于音频文件较为有效",
    cond({ rootContext }) {
        const action = rootContext.target as Action;
        return !action.keywords.includes("blob");
    },
    run(args) {
        const action = args.rootContext.target as Action & { src: string };
        if (action.src) {
            window.open(action.src, "_blank");
        }
    },
});
