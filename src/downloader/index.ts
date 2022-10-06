import { Action } from "@cn-ui/command-palette";
import { atom } from "@cn-ui/use";
import { FetchAction } from "./fetch";
import { BlobAction } from "./blob";
import { MediaNow, MediaAll } from "./media";
import { M3U8Action } from "./m3u8";

export const downloadActions = atom<Action[]>([
    FetchAction,
    M3U8Action,
    BlobAction,
    MediaAll,
    MediaNow,
]);
