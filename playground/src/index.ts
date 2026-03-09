console.time("app init");

import { ANodeComponent } from "../../src/Classes.js";
import { ElementComponentWithChildren, WrappedDOMElementComponentWithChildren } from "../../src/Components.js";


class Text extends ANodeComponent<globalThis.Text> {
    constructor(text: string) {
        super();
        this._dom = document.createTextNode(text);
    }
}

const appRoot = new WrappedDOMElementComponentWithChildren(document.getElementById("app") || document.body);
appRoot.append(
    new ElementComponentWithChildren("p").append(
        new Text("Hello world!")
    )
);

console.timeEnd("app init");
