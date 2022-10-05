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
                <source src="https://d2zihajmogu5jn.cloudfront.net/big-buck-bunny/master.m3u8"></source>
            </video>
        </>
    );
};
export const App = () => {
    ["./index.html", "https://cdn.jsdelivr.net/npm/lodash-es/index.js"].map(
        (i) => fetch(i, { cache: "force-cache" })
    );
    fetch("./");
    return (
        <div class="absolute z-0 top-0 left-0">
            <VideoTest></VideoTest>
        </div>
    );
};
import { onMount } from "solid-js";
import { render } from "solid-js/web";
render(() => <App></App>, document.body);
