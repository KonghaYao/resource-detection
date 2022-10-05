import { ajaxSource } from "../detect/Ajax";
import "../proxy/index";
import { Root, CommandPalette, Action } from "@cn-ui/command-palette";

import "@cn-ui/command-palette/pkg-dist/style.css";
import { Atom, atom, reflect } from "@cn-ui/use";
import { defineAction } from "@cn-ui/command-palette";

export const getBody = () => {
    return [...document.body.children].filter((i) => i.id !== __GlobalID__);
};
import { videoDetect, videoStore } from "../detect/video";
import { Component, Context, createEffect, onMount, Show } from "solid-js";
import { downloadActions } from "../downloader";

const detect = () => {
    console.log("执行嗅探");
    videoDetect();
};

export const App = () => {
    onMount(() => {
        detect();
    });
    const titleLimit = 50;
    const processText = (str: string) => {
        return str.length >= titleLimit
            ? str.slice(0, titleLimit / 2) +
                  "..." +
                  str.slice(str.length - titleLimit / 2, str.length)
            : str;
    };
    const actions = reflect(() => {
        const Inputs = [...ajaxSource(), ...videoStore().values()] as Action[];
        return Inputs.map((i, index) => {
            return defineAction({
                ...i,
                title: processText(i.title),
                subtitle: processText(i.subtitle),
                run() {
                    actionsContext.target = i;
                    nextVisible(true);
                },
            });
        });
    });

    const actionsContext = {
        target: null,
    };
    const visible = atom(false);
    const nextVisible = atom(false);
    let root = atom(null);
    createEffect(() => {
        if (visible()) {
            detect();
        }
    });
    return (
        <div
            ref={root}
            id={__GlobalID__}
            class="absolute"
            style={{ "z-index": "99999999" }}>
            {root() && (
                <Root
                    visibility={visible}
                    actions={actions}
                    components={{
                        ResultIcon({ action }) {
                            return <div>{(action as any).type}</div>;
                        },
                    }}
                    actionsContext={actionsContext}>
                    <CommandPalette
                        mount={root()}
                        searchPlaceholder="资源搜索"
                    />
                </Root>
            )}
            <Show when={root() && nextVisible()}>
                <NextPanel
                    root={root()}
                    visible={nextVisible}
                    context={actionsContext}></NextPanel>
            </Show>
        </div>
    );
};

/** 下载面板 */
const NextPanel: Component<{
    visible: Atom<boolean>;
    root: HTMLElement;
    context: any;
}> = (props) => {
    return (
        <Root
            visibility={props.visible}
            actions={reflect(() =>
                downloadActions().map((i) => {
                    const run = i.run;
                    i.run = (args) => {
                        props.visible(false);
                        return run(args);
                    };
                    return i;
                })
            )}
            components={{}}
            actionsContext={props.context}>
            <CommandPalette
                mount={props.root}
                searchPlaceholder="选择下载方式"
            />
        </Root>
    );
};
