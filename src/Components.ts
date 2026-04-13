import {
    AChildren,
    AComponentFactory,
    AElementComponentVoid,
    AElementComponentWithChildren,
    AFragmentComponent,
    IChildrenMixin
} from "./Classes.js";
import {
    ComponentType,
    EventMapVoid,
    IComponent,
    IElementWithChildrenComponent,
    IIsElementComponent,
    INodeComponent
} from "./Interfaces.js";
import {
    AnyType,
    HTMLElementVoid,
    HTMLElementVoidTagName,
    HTMLElementWithChildren,
    HTMLElementWithChildrenTagName
} from "./Types.js";
import { mixin, toKebabCase } from "./Utils.js";


/**
 * Base implementation for all components, *that do not allow* to add child components.
 * @see {@link AElementComponentVoid}
 */
export class ElementComponentVoid<T extends HTMLElementVoid, EventMap extends EventMapVoid = HTMLElementEventMap> extends AElementComponentVoid<T, EventMap> {
    /**
     * Create instance based on an HTML element type without children.
     * @param _tagName Tag name of the HTML element.
     * @param _is Support creating customized built-in elements:
     * - https://developer.mozilla.org/en-US/docs/Web/Web_Components#custom_elements
     * - https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-customized-builtin-example.
     * Currently only for completeness, otherwise not used.
     */
    constructor(protected _tagName: HTMLElementVoidTagName, protected _is?: string) {
        super();
        if (_is) {
            this._dom = document.createElement(this._tagName, { is: _is }) as T; // eslint-disable-line jsdoc/require-jsdoc
        } else {
            this._dom = document.createElement(this._tagName) as T;
        }
    }
}

/**
 * Base implementation for all components, *that do allow* to add child components.
 * @see {@link AElementComponentWithChildren}
 */
export class ElementComponentWithChildren<T extends HTMLElementWithChildren, Child extends INodeComponent<Node> = INodeComponent<Node>, EventMap extends EventMapVoid = HTMLElementEventMap> extends AElementComponentWithChildren<T, Child, EventMap> {
    /**
     * Create instance based on an HTML element type with children.
     * @param _tagName Tag name of the HTML element.
     * @param _is Support creating customized built-in elements:
     * - https://developer.mozilla.org/en-US/docs/Web/Web_Components#custom_elements
     * - https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-customized-builtin-example.
     * Currently only for completeness, otherwise not used.
     */
    constructor(protected _tagName: HTMLElementWithChildrenTagName, protected _is?: string) {
        super();
        if (_is) {
            this._dom = document.createElement(this._tagName, { is: _is }) as T; // eslint-disable-line jsdoc/require-jsdoc
        } else {
            this._dom = document.createElement(this._tagName) as T;
        }
        // Set target DOM for the `IChildren` mixin from `AElementComponentWithChildren`!!
        this.setChildrenDOMTarget();
    }
}

/**
 * Simple wrapper helper component for a void DOM element. The component is fully functional but no
 * event handlers of the target element are adopted.
 */
export class WrappedDOMElementComponentVoid<EventMap extends EventMapVoid = HTMLElementEventMap> extends AElementComponentVoid<HTMLElementVoid, EventMap> {
    /**
     * Create instance that wraps a target DOM element with a component instance.
     * @param target The DOM element to be wrapped.
     */
    constructor(target: HTMLElementVoid) {
        super();
        this._dom = target;
    }
}

/**
 * Simple wrapper helper component for a DOM element with childern. The component is fully
 * functional but doesn't contain any child components which may already have been created in the
 * DOM tree below the target element; also no event handlers of the target element are adopted.
 * Its main purpose is to serve as the root component for following components to be appended
 * to an already existing DOM element, for example for building an application inside an arbitrary
 * (empty) div element somewhere in the page.
 */
export class WrappedDOMElementComponentWithChildren<Child extends INodeComponent<Node> = INodeComponent<Node>, EventMap extends EventMapVoid = HTMLElementEventMap> extends AElementComponentWithChildren<HTMLElementWithChildren, Child, EventMap> {
    /**
     * Create an instance that wraps a target DOM element with a component instance.
     * @param target The DOM element to be wrapped.
     */
    constructor(target: HTMLElementWithChildren) {
        super();
        this._dom = target;
        // Set target DOM for the `IChildren` mixin from `AElementComponentWithChildren`!!
        this.setChildrenDOMTarget();
    }
}

/**
 * Base implementation of a fragment that holds components.
 * @see {@link AFragmentComponent}
 */
export class FragmentComponent extends AFragmentComponent {
    /**
     * Creates the fragment and appends components to it.
     * @param components Components to be added to the fragment.
     */
    constructor(...components: (INodeComponent<Node> | undefined | null)[]) {
        super();
        this._dom = document.createDocumentFragment();
        this.append(...components);
    }
}

/**
 * Base implementation for a component factory. This implementation doesn't do anything in
 * `setupComponent` but it may be useful as the base for custom factories that support a fluent API
 * for creating components. `setupComponent` can be overridden later to set up components.
 * @see {@link AComponentFactory}
 * @example
 * ```typescript
 * class MyFactory extends ComponentFactory<IComponent> {
 *     public override setupComponent(component: IElementComponent<HTMLElement>): IComponent {
 *         const className = component
 *             .ClassName
 *             .replace(/[A-Z]+(?![a-z])|[A-Z]/g, (c, o) => (o ? "-" : "") + c.toLowerCase());
 *         return component.addClass(`vts-${className}`);
 *     }
 * }
 *
 * const $ = new (mixinComponentFactories(
 *     MyFactory,
 *     DivFactory, ButtonFactory, LabeledTextInputFactory
 * ));
 *
 * let edtUserName: LabeledTextInput;
 *
 * const app = $.div().addClass("app").append(
 *     edtUserName = $.labeledTextInput("Username:", "userName", "userName"),
 *     $.button("Create").on("click", (_ev: MouseEvent) => {
 *         Store.createUser(edtUserName.Component.Value);
 *     })
 * );
 * ```
 *
 * An alternative version without the declaration of the variable `edtUserName`can look like this:
 *
 * ```typescript
 * const app = $.div().addClass("app").append(
 *     ...(() => {
 *         const edt = $.labeledTextInput("Username:", "userName", "userName");
 *         const btn = $.button("Create").on("click", (_ev: MouseEvent) => {
 *             Store.createUser(edt.Component.Value);
 *         });
 *         return [edt, btn];
 *     })()
 * );
 * ```
 */
export class ComponentFactory<T extends IComponent> extends AComponentFactory<T> {
    public setupComponent(component: T, _data?: unknown): T { // eslint-disable-line jsdoc/require-jsdoc
        return component;
    }
}

/**
 * A factory that sets the CSS class of a component based on the components class name.
 */
export class CSSClassNameFactory extends ComponentFactory<IComponent> {
    #cssPrefix: string;
    #prefix: string;
    #recursive: boolean;

    /**
     * Create component factory.
     * @param cssPrefix The prefix for the generated CSS class name (`-` will always be appended to
     * the prefix).
     * @param recursive If `true`, nested components will be handled recursively.
     */
    constructor(cssPrefix: string = "", recursive: boolean = false) {
        super();
        this.cssPrefix(cssPrefix);
        this.#recursive = recursive;
    }

    /** @inheritdoc */
    public override setupComponent(component: IComponent, data?: unknown): IComponent {
        switch (component.ComponentType) {
            // Usually there is nothing to set up on (text) node based components.
            case ComponentType.NODE:
                break;
            // Set class name on this component.
            case ComponentType.ELEMENT:
                this.addClassNames(component as IIsElementComponent, data);
                break;
            // Recursively set class name on child components.
            case ComponentType.ELEMENT_WITH_CHILDREN:
                if (this.#recursive && component.ComponentType === ComponentType.ELEMENT_WITH_CHILDREN) {
                    for (const child of (component as IElementWithChildrenComponent<HTMLElementWithChildren>).ElementChildren) {
                        this.setupComponent(child);
                    }
                }
                this.addClassNames(component as IIsElementComponent, data);
                break;
            // Usually there is nothing to set up on fragment based components.
            case ComponentType.FRAGMENT:
                break;
            default:
                break;
        }
        return component;
    }

    /**
     * Get/set the current prefix for CSS class names (auto-trimmed string).
     */
    public get CSSPrefix(): string {
        return this.#cssPrefix;
    }
    /** @inheritdoc */
    public set CSSPrefix(v: string) {
        this.#cssPrefix = v;
    }

    /**
     * Set the current prefix for CSS class names (auto-trimmed string).
     * @param v The current prefix for CSS class names.
     * @returns This instance.
     */
    public cssPrefix(v: string): this {
        this.#cssPrefix = v.trim();
        this.#prefix = this.#cssPrefix ? this.#cssPrefix + "-" : "";
        return this;
    }

    /**
     * Get/set the current recursive CSS class name assignment handling. If `true` is set, nested
     * components are handled recursively.
     */
    public get Recursive(): boolean {
        return this.#recursive;
    }
    /** @inheritdoc */
    public set Recursive(v: boolean) {
        this.#recursive = v;
    }

    /**
     * Set the current recursive CSS class name assignment handling.
     * @param v `true`, if nested components should be handled recursively, otherwise `false`.
     * @returns This instance.
     */
    public recursive(v: boolean): this {
        this.#recursive = v;
        return this;
    }

    /**
     * Set a generated CSS class name on a component.
     * @param component The component on which the class name should be set.
     * @param _data Arbitrary data to be possibly evaluated.
     */
    private addClassNames(component: IIsElementComponent, _data?: AnyType) {
        component.addClass(`${this.#prefix}${toKebabCase(component.constructor.name)}`);
        // component.addClass(`${this.#prefix}${component.DefaultCSSClassName}`);
        // if (typeof data === ...) {
        //     ...
        // }
    }
}

/**
 * Abstract base implementation for an application that also can be used to setup components (the
 * class extends `ComponentFactory`). Extending classes can/should override this function if they
 * want to set up components obtained by factory methods:
 * ```
 * setupComponent<T extends IComponent<HTMLElement>>(component: T): T
 * ```
 * Although calling `super.setupComponent()` in this implementation here currently does nothing it's
 * nevertheless recommended.
 *
 * This class also implements `IChildren` so that components can be added/removed/inserted directly
 * to the application instance which will forward them to the root element/component.
 */
export abstract class VTSApplication<EventMap extends EventMapVoid = HTMLElementEventMap> extends ComponentFactory<IComponent> { // eslint-disable-line @typescript-eslint/no-unsafe-declaration-merging
    /**
     * The root DOM container element for all components to be added.
     */
    protected rootElement: HTMLElementWithChildren;
    /**
     * Root container component for this application and all components to be added.
     */
    protected root: WrappedDOMElementComponentWithChildren<INodeComponent<Node>, EventMap>;

    /**
     * Build an app within the given root element.
     * @param rootElement The root DOM container element for all components to be added. If omitted,
     * `document.body` will be used as the root DOM container.
     */
    constructor(rootElement?: HTMLElementWithChildren) {
        super();
        this.rootElement = rootElement
            ? rootElement
            : this.rootElement = document.body;
        this.root = new WrappedDOMElementComponentWithChildren(this.rootElement);
        this.setChildrenDOMTarget(this.rootElement);
    }

    /**
     * Get the root container component.\
     * __Note:__ This property __must not be used to add/remove/... components__, instead use the
     * respective functions of `VTSApplication` itself! `Root` should only be used for styling or
     * other (readonly) purposes!
     */
    public get Root(): IElementWithChildrenComponent<HTMLElementWithChildren, INodeComponent<Node>, EventMap> {
        return this.root;
    }

    /**
     * Get the root DOM container element for all components.
     */
    public get RootElement(): HTMLElementWithChildren {
        return this.rootElement;
    }

    /** @inheritdoc */
    protected clearOwner(): void {
        // __Note:__ It is assumed that the root element has no other real components attached to it
        // (its just a wrapped DOM element) so `this.root.clear()` is not called here. This also
        // ensures, that other pure DOM child elements of `this.rootElement` are not removed. If a
        // different behavior is need, this has to implemented in a derived class in `clearOwner()`.
    }

    static {
        /** Mixin the IChildren implementation (which targets the `this.rootElement`). */
        mixin(false, this, AChildren);
    }
}

// Augment class definition with `IChildren` (see `static`).
export interface VTSApplication extends IChildrenMixin { } // eslint-disable-line @typescript-eslint/no-empty-object-type,@typescript-eslint/no-unsafe-declaration-merging,jsdoc/require-jsdoc

/**
 * A class that serves as the root for an application which is appended to an existing DOM element.
 * The class uses an instance of a `CSSClassNameFactory` (see above in _this_ file) to setup
 * components obtained from `VTS_App`. The intended use of `VTS_App` is to be extended by using
 * `mixinComponentFactories()` with factories for _all_ components the application will use. It can
 * of course also be used as a base class for an app class that does more than just provide simple
 * access to component factory functions.
 * @example
 * ```typescript
 * const MyAppClass = mixinComponentFactories(
 *     VTS_App,
 *     DivFactory,
 *     HxFactory,
 *     PFactory,
 *     ButtonFactory
 * );
 *
 * export const _ = new MyAppClass(document.getElementById("app")!, "vts", true);
 *
 * _.append(
 *     _.div().append(
 *         _.h1("An app"),
 *         _.p("Hello world!"),
 *         _.button("Click me!")
 *             .on("click", () => alert("Thank you!")),
 *     )
 * );
 * ```
 */
export class VTS_App<EventMap extends EventMapVoid = HTMLElementEventMap> extends VTSApplication<EventMap> {
    #cf: CSSClassNameFactory;

    /**
     * Build an app within the given root element.
     * @param rootElement The root DOM container element for all components to be added.
     * @param cssPrefix The prefix for the generated CSS class name (`-` will always be appended to
     * the prefix).
     * @param recursive If `true`, nested components will be handled recursively.
     */
    constructor(rootElement?: HTMLElementWithChildren, cssPrefix: string = "vts", recursive: boolean = false) {
        super(rootElement);
        this.#cf = new CSSClassNameFactory(cssPrefix, recursive);
    }

    /**
     * Get/set the CSS prefix used to setup components obtained by factory methods.
     */
    public get CSSPrefix(): string {
        return this.#cf.CSSPrefix;
    }
    /** @inheritdoc */
    public set CSSPrefix(v: string) {
        this.#cf.cssPrefix(v);
    }

    /**
     * Set the current prefix used to setup components obtained by factory methods.
     * @param v The current prefix for CSS class names.
     * @returns This instance.
     */
    public cssPrefix(v: string): this {
        this.#cf.cssPrefix(v);
        return this;
    }

    /**
     * Get/set the `Recursive` flag used to setup components obtained by factory methods.
     */
    public get Recursive(): boolean {
        return this.#cf.Recursive;
    }
    /** @inheritdoc */
    public set Recursive(v: boolean) {
        this.#cf.recursive(v);
    }

    /**
     * Set the current recursive CSS class name assignment handling which is used to setup
     * components obtained by factory methods.
     * @param v `true`, if nested components should be handled recursively, otherwise `false`.
     * @returns This instance.
     */
    public recursive(v: boolean): this {
        this.#cf.recursive(v);
        return this;
    }

    /** @inheritdoc */
    public override setupComponent(component: IComponent, data?: unknown): IComponent {
        super.setupComponent(component, data);
        return this.#cf.setupComponent(component, data);
    }
}
