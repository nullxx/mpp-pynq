

import React, { memo } from "react";
import { unsubscribeToUIUpdates } from "../../../lib/core";
import { subscribeToUIUpdates, getCore } from "../../../lib/core/index";
import mermaid from "mermaid";

const baseDiagram = `stateDiagram-v2
    classDef yellowFill fill:#f0c40094,color:black,font-weight:bold,stroke-width:2px,stroke:yellow
    classDef orangeBorder stroke:orange,stroke-width:2px,stroke-dasharray:5
    [*] --> S0
    S0 --> S1 : XXXXXXXXXX
    S1 --> S2 : 00XXXXXXXX
    S1 --> S12 : 0100XXXXXX
    S1 --> S15 : 0110XXXXXX
    S1 --> S21 : 10X1XXXXXX
    S1 --> S16 : 011100XXXX
    S1 --> S16 : 11000011XX
    S1 --> S16 : 11000100XX
    S1 --> S16 : 01110100XX
    S1 --> S14 : 10000000XX
    S1 --> S23 : 10000001XX
    S1 --> S24 : 10000010XX
    S1 --> S26 : 11000001XX
    S1 --> S32 : 11000101XX
    S1 --> S32 : 11000000XX
    S1 --> S37 : 11000010XX
    S2 --> S3 : XX00XXXXXX
    S2 --> S4 : XX0100XXXX
    S2 --> S6 : XX0110XXXX
    S2 --> S7 : XX0111XXXX
    S2 --> S9 : XX1000XXXX
    S2 --> S10 : XX1001XXXX
    S2 --> S11 : XX1010XXXX
    S2 --> S8 : XX1011XXXX
    S2 --> S5 : XX11XXXXXX
    S3 --> S0 : XXXXXXXXXX
    S4 --> S0 : XXXXXXXXXX
    S5 --> S0 : XXXXXXXXXX
    S6 --> S0 : XXXXXXXXXX
    S7 --> S0 : XXXXXXXXXX
    S8 --> S0 : XXXXXXXXXX
    S9 --> S0 : XXXXXXXXXX
    S10 --> S0 : XXXXXXXXXX
    S11 --> S0 : XXXXXXXXXX
    S12 --> S44 : XXX000XXXX
    S12 --> S4 : XXX00100XX
    S12 --> S5 : XXX00101XX
    S12 --> S6 : XXX00110XX
    S12 --> S7 : XXX00111XX
    S12 --> S9 : XXX01X00XX
    S12 --> S10 : XXX01X01XX
    S12 --> S11 : XXX01X10XX
    S12 --> S13 : XXX01X11XX
    S12 --> S19 : XXX1XXXXXX
    S13 --> S0 : XXXXXXXXXX
    S14 --> S0 : XXXXXXXXXX
    S15 --> S39 : 011000XXXX
    S15 --> S4 : XXXX0100XX
    S15 --> S5 : XXXX0101XX
    S15 --> S6 : XXXX0110XX
    S15 --> S7 : XXXX0111XX
    S15 --> S9 : XXXX1X00XX
    S15 --> S10 : XXXX1X01XX
    S15 --> S11 : XXXX1X10XX
    S16 --> S17 : XXXXXXXXXX
    S17 --> S18 : XXXXX000XX
    S17 --> S12 : XXXXX001XX
    S17 --> S20 : 011100101X
    S17 --> S20 : 01110011X1
    S17 --> S20 : 01110100XX
    S17 --> S38 : 11000011XX
    S17 --> S26 : 11000100XX
    S17 --> S0 : XXXXX0100X
    S17 --> S0 : XXXXX011X0
    S18 --> S4 : XXXXXXXXXX
    S19 --> S0 : XXXXXXXXXX
    S20 --> S0 : XXXXXXXXXX
    S21 --> S22 : XXXXXXXXXX
    S22 --> S12 : XX0XXXXXXX
    S22 --> S18 : XX1XXXXXXX
    S23 --> S0 : XXXXXXXXXX
    S24 --> S0 : XXXXXXXXXX
    S25 --> S26 : 11000110XX
    S26 --> S36 : 11000001XX
    S26 --> S28 : 11000100XX
    S26 --> S29 : 11000110XX
    S29 --> S40 : 11000110XX
    S28 --> S40 : 11000100XX
    S28 --> S42 : 11000110XX
    S29 --> S20 : 11000100XX
    S29 --> S30 : 11000110XX
    S30 --> S0 : 11000110XX
    S31 --> S33 : 11000101XX
    S31 --> S33 : 11000000XX
    S32 --> S31 : 11000101XX
    S32 --> S31 : 11000000XX
    S33 --> S41 : 11000101XX
    S33 --> S41 : 11000000XX
    S34 --> S43 : 11000000XX
    S35 --> S0 : 11000000XX
    S36 --> S0 : 11000001XX
    S37 --> S31 : 11000010XX
    S38 --> S0 : 11000011XX
    S40 --> S29 : 11000100XX
    S40 --> S28 : 11000110XX
    S41 --> S0 : 11000101XX
    S41 --> S34 : 11000000XX
    S42 --> S29 : 11000110XX
    S43 --> S35 : 11000000XX
    S44 --> S0 : XXX000XXXX
`;

const isSvgEmpty = (svg: string) => {
    var parser = new DOMParser();
    const doc = parser.parseFromString(svg, "image/svg+xml");

    const gElement = doc.querySelector('g');
    const isGEmpty = gElement?.children.length === 0;

    return isGEmpty;
}


async function renderAutomata(node: HTMLElement, text: string = baseDiagram) {
    node.removeAttribute("data-processed");

    const result = await mermaid.render('id0', text);
    result.bindFunctions?.(node);

    if (!isSvgEmpty(result.svg)) {
        node.innerHTML = result.svg;
    } else {
        await renderAutomata(node, text);
    }


}

function zoomTo(mermaidContainer: Element, state: number) {
    const g = (mermaidContainer.querySelector(`g[data-id="S${state}"]`) as any);
    const svg = mermaidContainer.firstChild;

    const x = g.getAttribute("transform").split("(")[1].split(",")[0];
    const y = g.getAttribute("transform").split(",")[1].split(")")[0];

    const paddingLeft = 100;
    const paddingTop = 100;

    const viewBox = `${x - paddingLeft} ${y - paddingTop} ${350} ${450}`;
    (svg as SVGElement).setAttribute("viewBox", viewBox);
}

// let prevDiagramTxt = "";
export default memo(function AutomataNode({ data }: { data: any }) {
    const mermaidContainerRef = React.useRef<HTMLDivElement>(null);

    async function onUIUpdate(this: any) {
        const nextStateNumber = await getCore().get_next_state();
        const currentStateNumber = await getCore().get_state();

        const diagramTxt = `${baseDiagram}\n    class S${currentStateNumber} yellowFill\n    class S${nextStateNumber} orangeBorder`;


        if (mermaidContainerRef.current) {
            await renderAutomata(mermaidContainerRef.current, diagramTxt);
        }

        zoomTo(mermaidContainerRef.current!, currentStateNumber);
    }

    async function initialize() {
        mermaid.initialize({
            startOnLoad: true,
            theme: "default",
            fontSize: 20,
        });
        mermaid.contentLoaded();

        if (mermaidContainerRef.current) {
            await renderAutomata(mermaidContainerRef.current);
        }

        zoomTo(mermaidContainerRef.current!, 0);
    }


    React.useEffect(() => {
        subscribeToUIUpdates(onUIUpdate);
        initialize();

        return () => {
            unsubscribeToUIUpdates(onUIUpdate);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div
            style={{
                height: data.height || 400,
                overflow: "hidden",
                width: data.width || 500,
                padding: 8,
                backgroundColor: "#f5f5f5",
            }}
            className="pretty-shadow"
        >
            <div className="mermaid" ref={mermaidContainerRef}></div>
        </div>
    );
}, (prevProps, nextProps) => {
    return JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data);
});