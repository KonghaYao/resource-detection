import { Action, defineAction } from "@cn-ui/command-palette";
import save from "file-saver";
import { getName } from "../ui/getName";
export const FetchAction = defineAction({
    id: "fetch-download",
    title: "普通下载",
    subtitle: "通过 fetch 下载文件, 对于某些资源会失效",

    run(args) {
        const action = args.rootContext.target as Action & { src: string };
        if (action.src) {
            switch ((action as any).type) {
                default:
                    fetch(action.src)
                        .then((res) => res.blob())
                        .then((res) => {
                            save(res, getName(action.subtitle));
                        });
            }
        }
    },
});
