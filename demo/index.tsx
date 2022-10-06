import videojs from "video.js";
import "video.js/dist/video-js.min.css";
import "./index.css";
const VideoTest = () => {
    onMount(() => {
        const player = videojs("vid1", { height: "200px" });
        const player2 = videojs("vid2", { height: "200px" });
    });
    return (
        <>
            <video id="vid1" class="video-js" controls>
                <source src="https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_30mb.mp4"></source>
            </video>
            <video id="vid2" class="video-js" controls>
                <source src="https://stream.mux.com/5g1hMA6dKAe8DCgBB901DYB200U65ev2y00.m3u8"></source>
            </video>
        </>
    );
};
export const App = () => {
    ["./index.html", "https://cdn.jsdelivr.net/npm/lodash-es/index.js"].map(
        (i) => fetch(i, { cache: "force-cache" })
    );
    fetch("./");
    const src = atom("");

    return (
        <div class="absolute z-0 top-0 left-0">
            <VideoTest></VideoTest>
            <input
                type="file"
                oninput={async (e) => {
                    const file = (e.target as any).files[0] as File;
                    const data = await file.arrayBuffer();
                    const media = await MSEFToMediaSource(new Uint8Array(data));
                    src(URL.createObjectURL(media));
                }}></input>
            {src() && (
                <video
                    id="video-msef"
                    class="video-js"
                    controls
                    src={src()}></video>
            )}
        </div>
    );
};
import { createEffect, onMount } from "solid-js";
import { render } from "solid-js/web";
import { MSEFToMediaSource } from "../src/proxy/MSEF/MediaSourceToMSEF";
import { atom } from "@cn-ui/use";
render(() => <App></App>, document.body);
