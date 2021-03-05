import {
    ComponentFactory,
    ElementComponentVoid,
    ElementComponentWithChildren
} from "../src/Components.js";
import {
    NullableString
} from "../src/Types.js";


/**
 * Sample step by step implementation of a login component.
 * _Very important note:_ please don't feel intimidated by the sheer amount of code seemingly needed
 * for something rather trivial while Vanilla.ts at the same time claims that using it is easy and
 * doesn't force you to write much code. The example below shows what you would have to do if you'd
 * write every component *from scratch*. It's well possible to follow that approach (and doing so is
 * definitely no mistake, if you absolutely want to avoid any dependencies) but most components
 * shown below are already available in @vanilla-ts/dom and @vanilla-ts/components, most of them
 * more complete and with more features.
 * You should also keep in mind that any component shown below is rather general and reusable so you
 * could easily create variants or other composite components of them with little effort!
 */


////////////////////////
// Base components
////////////////////////

// Simple container component based on a <div> element.
export class Container extends ElementComponentWithChildren<HTMLDivElement> {
    constructor() {
        super("div");
    }
}

// Span component based on a <span> element.
export class Span extends ElementComponentWithChildren<HTMLSpanElement> {
    constructor(text?: string) {
        super("span");
        this._dom.textContent = text ? text : null;
    }
}

// Labeled container component.
export class LabeledContainer extends Container {
    protected caption: Span;
    constructor(caption: string) {
        super();
        this.append(
            this.caption = new Span(caption),
        );
    }

    public get Caption(): NullableString {
        return this.caption.Text;
    }
    public set Caption(v: NullableString) {
        this.caption.DOM.textContent = v;
    }
}

// Label component based on a <label> element. To be used with input components.
export class Label extends ElementComponentWithChildren<HTMLLabelElement> {
    constructor(caption?: string, htmlFor?: string) {
        super("label");
        caption ? this._dom.textContent = caption : null;
        if (htmlFor) {
            this.For = htmlFor;
        }
    }

    public get Caption(): NullableString {
        return this.Text;
    }
    public set Caption(v: NullableString) {
        this._dom.textContent = v;
    }
    public caption(v: NullableString): this {
        this._dom.textContent = v;
        return this;
    }

    public get For(): string {
        return this._dom.htmlFor;
    }
    public set For(v: string) {
        this._dom.htmlFor = v;
    }
    public for(v: string): this {
        this._dom.htmlFor = v;
        return this;
    }
}

// General input component. Abstract because it should be used as the base for other input
// components like <input type="text">, <input type="password">, <input type="select"> etc.
export abstract class Input extends ElementComponentVoid<HTMLInputElement> {
    constructor() {
        super("input");
    }

    public get Value(): string {
        return this._dom.value;
    }
    public set Value(v: string) {
        this._dom.value = v;
    }
    public value(v: string): this {
        this._dom.value = v;
        return this;
    }

    public get Name(): string {
        return this._dom.name;
    }
    public set Name(v: string) {
        this._dom.name = v;
    }
    public name(v: string): this {
        this._dom.name = v;
        return this;
    }
}

// Text input component based on <input type="text">.
export class TextInput extends Input {
    constructor(value?: string, placeHolder?: string) {
        super();
        this._dom.type = "text";
        if (value) {
            this.Value = value;
        }
        if (placeHolder) {
            this.Placeholder = placeHolder;
        }
    }

    public get Placeholder(): string {
        return this._dom.placeholder;
    }
    public set Placeholder(v: string) {
        this._dom.placeholder = v;
    }
    public placeHolder(v: string): this {
        this._dom.placeholder = v;
        return this;
    }
}

// Password input component based on <input type="password">.
export class PasswordInput extends TextInput {
    constructor(value?: string, placeHolder?: string) {
        super(value, placeHolder);
        this._dom.type = "password";
    }
}

// General labeled input component. Abstract because it should be used as the base for other labeled
// input components like TextInput, PasswordInput, SelectInput etc.
export abstract class LabeledInput<T extends Input> extends Container {
    protected label: Label;
    protected input!: T;
    constructor(id: string, caption: string) {
        super();
        this.append(
            this.label = new Label(caption, id),
        );
    }

    public get Label(): Label {
        return this.label;
    }

    public get Input(): T {
        return this.input;
    }
}

// Labeled text input component based on <input type="text">.
export class LabeledTextInput extends LabeledInput<TextInput> {
    constructor(id: string, name: string, caption: string, value?: string, placeHolder?: string) {
        super(id, caption);
        this.append(
            this.input = new TextInput(value, placeHolder).id(id).name(name)
        );
    }
}

// Labeled password input component based on <input type="password">.
export class LabeledPasswordInput extends LabeledInput<TextInput> {
    constructor(id: string, name: string, caption: string, value?: string, placeHolder?: string) {
        super(id, caption);
        this.append(
            this.input = new PasswordInput(value, placeHolder).id(id).name(name)
        );
    }
}

// Button component based on a <button> element.
export class Button extends ElementComponentWithChildren<HTMLButtonElement> {
    constructor(caption?: string) {
        super("button");
        this._dom.textContent = caption ? caption : null;
    }
}


////////////////////////
// The login component
////////////////////////

// Options for the login component
export interface ILoginComponentOptions {
    Caption?: string;
    UNId?: string;
    UNName?: string;
    UNCaption?: string;
    UNValue?: string;
    UNPlaceHolder?: string;
    PWDId?: string;
    PWDName?: string;
    PWDCaption?: string;
    PWDValue?: string;
    PWDPlaceHolder?: string;
    LoginBtnCaption?: string;
}

// Login component.
export class LoginComponent extends LabeledContainer {
    private userNameInput: LabeledTextInput;
    private passwordInput: LabeledPasswordInput;
    private loginButton: Button;
    constructor(opts: ILoginComponentOptions) {
        super(opts.Caption || "Login");
        this.append(
            this.userNameInput = new LabeledTextInput(
                opts.UNId || "username",
                opts.UNName || "username",
                opts.UNCaption || "User name",
                opts.UNValue,
                opts.UNPlaceHolder || "Enter user name"
            ),
            this.passwordInput = new LabeledPasswordInput(
                opts.PWDId || "password",
                opts.PWDName || "password",
                opts.PWDCaption || "Password",
                opts.PWDValue,
                opts.PWDPlaceHolder || "Enter password"
            ),
            this.loginButton = new Button(opts.LoginBtnCaption || "Login")
        );
    }

    public get UserName(): string {
        return this.userNameInput.Input.Value;
    }

    public get Password(): string {
        return this.passwordInput.Input.Value;
    }

    public get UserNameInput(): LabeledTextInput {
        return this.userNameInput;
    }

    public get PasswordInput(): LabeledPasswordInput {
        return this.passwordInput;
    }

    public get LoginButton(): Button {
        return this.loginButton;
    }
}


////////////////////////
// Component factories
////////////////////////

// Factory for button components.
export class ButtonFactory extends ComponentFactory<Button> {
    public button(caption: string): Button {
        return this.setupComponent(new Button(caption));
    }
}

// Factory for labeled container components.
export class LabeledContainerFactory extends ComponentFactory<LabeledContainer> {
    public labeledContainer(caption: string): LabeledContainer {
        return this.setupComponent(new LabeledContainer(caption));
    }
}

// Factory for labeled text input components.
export class LabeledTextInputFactory extends ComponentFactory<LabeledTextInput> {
    public labeledTextInput(id: string, name: string, caption: string, value?: string, placeHolder?: string): LabeledTextInput {
        return this.setupComponent(new LabeledTextInput(id, name, caption, value, placeHolder));
    }
}

// Factory for labeled password input components.
export class LabeledPasswordInputFactory extends ComponentFactory<LabeledPasswordInput> {
    public labeledPasswordInput(id: string, name: string, caption: string, value?: string, placeHolder?: string): LabeledPasswordInput {
        return this.setupComponent(new LabeledPasswordInput(id, name, caption, value, placeHolder));
    }
}

// Factory for the login component.
export class LoginComponentFactory extends ComponentFactory<LoginComponent> {
    public loginComponent(opts: ILoginComponentOptions): LoginComponent {
        return this.setupComponent(new LoginComponent(opts), true);
    }
}
