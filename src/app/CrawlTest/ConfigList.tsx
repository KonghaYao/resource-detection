import { resource } from "@cn-ui/use";
import { For } from "solid-js";
import { CrawlerAPI } from "../../api/crawler";

export const ConfigList = () => {
    const configs = resource(() => CrawlerAPI.getConfigs());

    return (
        <ul>
            <For each={configs()}>
                {(item) => {
                    return <li>{item.matcher}</li>;
                }}
            </For>
        </ul>
    );
};
