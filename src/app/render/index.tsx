import { Atom, useEffectWithoutFirst } from "@cn-ui/use";

export const Render = (props: {
    input: Atom<{ content: string; title: string }>;
}) => {
    let iframe!: HTMLIFrameElement;
    useEffectWithoutFirst(() => {
        iframe.contentWindow?.location.reload();
        setTimeout(() => {
            iframe.contentWindow?.postMessage(JSON.stringify(props.input()));
        }, 1000);
    }, [props.input]);
    return (
        <iframe class="w-full h-full" src="/render.html" ref={iframe}></iframe>
    );
};
