import { ajaxSource } from "../detect/Ajax";
import { Root, CommandPalette, Action } from "@cn-ui/command-palette";
import { Atom, atom, reflect } from "@cn-ui/use";
import { defineAction } from "@cn-ui/command-palette";
import { videoDetect, mediaStore, audioDetect } from "../detect/video";
import { Component, createEffect, onMount, Show } from "solid-js";
import { downloadActions } from "../downloader";

import style from "@cn-ui/command-palette/pkg-dist/style.css?inline";

export const getBody = () => {
    return [...document.body.children].filter((i) => i.id !== __GlobalID__);
};
const detect = () => {
    console.log("执行嗅探");
    videoDetect();
    audioDetect();
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
        const Inputs = [...ajaxSource(), ...mediaStore().values()] as Action[];
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
        <>
            <style>{style}</style>
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
        </>
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
