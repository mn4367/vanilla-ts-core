import {
    AComponent,
    AComponentFactory,
    AElementComponentVoid,
    AElementComponentWithChildren,
    AFragmentComponent,
    ANodeComponent
} from "./Classes.js";
import {
    IComponent,
    IComponentFactory,
    IElementWithChildrenComponent,
    IFragment,
    IIsElementComponent,
    INodeComponent
} from "./Interfaces.js";
import {
    AnyType,
    ComponentType,
    Constructor,
    HTMLElementVoid,
    HTMLElementVoidTagName,
    HTMLElementWithChildren,
    HTMLElementWithChildrenTagName,
    mixin,
    UnionToIntersection
} from "./Types.js";


/**
 * Base implementation for a component without any visual representation.
 * @see AComponent
 */
export class Component extends AComponent { }

/**
 * Base implementation for a text node component.
 * @see ANodeComponent
 */
export class TextComponent extends ANodeComponent<Text> {
    /**
     * Create instance based on the `Text` interface.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Text
     * @param text The text for the text node.
     */
    constructor(text: string) {
        super();
        this._dom = document.createTextNode(text);
    }
}

/**
 * Base implementation for all components, *that do not allow* to add child components.
 * @see AElementComponentVoid
 */
export class ElementComponentVoid<T extends HTMLElementVoid, EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends AElementComponentVoid<T, EventMap> {
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
 * @see AElementComponentWithChildren
 */
export class ElementComponentWithChildren<T extends HTMLElementWithChildren, EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends AElementComponentWithChildren<T, EventMap> {
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
    }
}

/**
 * Simple wrapper helper component for a void DOM element. The component is fully functional but no
 * event handlers of the target element are adopted.
 */
export class WrappedDOMElementComponentVoid<EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends AElementComponentVoid<HTMLElementVoid, EventMap> {
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
export class WrappedDOMElementComponentWithChildren<EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends AElementComponentWithChildren<HTMLElementWithChildren, EventMap> {
    /**
     * Create an instance that wraps a target DOM element with a component instance.
     * @param target The DOM element to be wrapped.
     */
    constructor(target: HTMLElementWithChildren) {
        super();
        this._dom = target;
    }
}

/**
 * Base implementation of a fragment that holds components.
 * @see AFragmentComponent
 */
export class FragmentComponent extends AFragmentComponent {
    /** 
     * Creates the fragment and appends components to it.
     * @param components Components to be added to the fragment.
     */
    constructor(...components: INodeComponent<Node>[]) {
        super();
        this._dom = document.createDocumentFragment();
        this.append(...components);
    }
}

/**
 * Base implementation for a component factory. This implementation doesn't do anything in
 * `setupComponent` but it may be useful as the base for custom factories that support a fluent API
 * for creating components. `setupComponent` can be overridden later to set up components.
 * @example
 * ```typescript
 * class MyFactory extends VTSComponentFactory<IComponent> {
 *   public override setupComponent(component: IVTElementComponent): IIsElementComponent {
 *     const className = component
 *       .ClassName
 *       .replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
 *     return component.addClass(`vts${className.startsWith("-") ? "" : "-"}${className}`);
 *   }
 * }
 * 
 * const $ = new (Mixin(
 *   MyFactory,
 *   DivFactory, ButtonFactory, LabeledTextInputFactory
 * ));
 *
 * let edtUserName: LabeledTextInput;
 *
 * const app = $.div().addClass("app").append(
 *   edtUserName = $.labeledTextInput("Username:", "userName", "userName"),
 *   $.button("Create").on("click", (_ev: MouseEvent) => {
 *     Store.createUser(edtUserName.Input.Value);
 *   })
 * );
 * ```
 * 
 * An alternative version without the declaration of the variable `edtUserName`can look like this:
 * 
 * ```
 * const app = $.div().addClass("app").append(
 *   ...(() => {
 *     const edt = $.labeledTextInput("Username:", "userName", "userName");
 *     const btn = $.button("Create").on("click", (_ev: MouseEvent) => {
 *       Store.createUser(input.Input.Value);
 *     });
 *     return [edt, btn];
 *   })()
 * );
 * ```
 * @see AComponentFactory
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
    /**
     * Create component factory.
     * @param cssPrefix The prefix for the generated CSS class name (`-` will always be appended to
     * the prefix).
     * @param recursive If `true`, nested components will be handled recursively.
     */
    constructor(private cssPrefix: string = "", private recursive: boolean = false) {
        super();
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
                if (this.recursive && component.ComponentType === ComponentType.ELEMENT_WITH_CHILDREN) {
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
     * Set a generated CSS class name on a component.
     * @param component The component on which the class name should be set.
     * @param _data Arbitrary data to be possibly evaluated.
     */
    private addClassNames(component: IIsElementComponent, _data?: AnyType) {
        const className = component.ClassName.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
        component.addClass(`${this.cssPrefix}${className.startsWith("-") ? "" : "-"}${className}`);
        // if (typeof data === ...) {
        //     ...
        // }
    }
}

/**
 * Utility function for building a 'merged' component factory.
 * @param classes The classes of the component factories which are merged to a single factory. The
 * first element of `classes` is the 'base' class which is extended with the rest of `classes`.
 * @returns The component factory built from `classes`.
 * @see mixin.
 */
export function buildComponentFactoryClass<T extends Constructor<IComponentFactory<IComponent>>, R extends T[]>(...classes: [...R]): new (...args: AnyType[]) => UnionToIntersection<InstanceType<[...R][number]>> {
    return mixin(true, ...classes);
}

/**
 * Abstract base implementation for an application. Extending classes should override this function:
 * ```
 * setupComponent<T extends IComponent<HTMLElement>>(component: T): T
 * ```
 * Although calling `super.setupComponent` in this implementation currently does nothing it's
 * nevertheless recommended.
 */
export abstract class VTSApplication<EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends ComponentFactory<IComponent> {
    /**
     * The root DOM container element for all components to be added.
     */
    protected rootElement: HTMLElementWithChildren;
    /**
     * Root container component for this application and all components to be added.
     */
    protected root: WrappedDOMElementComponentWithChildren<EventMap>;

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
    }

    /**
     * Get the root container component.
     */
    public get Root(): IElementWithChildrenComponent<HTMLElementWithChildren, EventMap> {
        return this.root;
    }

    /**
     * Get the root DOM container element for all components.
     */
    public get RootElement(): HTMLElementWithChildren {
        return this.rootElement;
    }

    /**
     * Get child components of this app. Also available on `Root`, re-exported here for convenience.
     * @returns The array containing the child components of this component.
     */
    public get Children(): INodeComponent<Node>[] {
        return this.root.Children;
    }

    /**
     * Append child components. Also available on `Root`, re-exported here for convenience.
     * - Append the components as child elements to *this* app and
     * - also append the underlying HTML elements of each component to the underlying HTML element
     *   of *this* app.
     * @param components The components to append.
     * @returns This instance.
     */
    public append(...components: INodeComponent<Node>[]): this {
        this.root.append(...components);
        return this;
    }

    /**
     * Append the children (components) of a fragment to this component.  Also available on `Root`,
     * re-exported here for convenience.
     * - Append the components as child elements to this component.
     * - Also append the underlying Node/HTML Element of each component to the underlying HTML
     *   element of *this* app.
     * @param fragment The fragment with components to append.
     * @returns This instance.
     */
    public appendFragment(fragment: IFragment): this {
        this.root.appendFragment(fragment);
        return this;
    }

    /**
     * Insert child components at a numeric index or the index of a component reference of this
     * app. Also available on `Root`, re-exported here for convenience.
     * - Insert the components as child elements to this app and
     * - also insert the underlying Node/HTML Element of each component to the underlying HTML
     *   element of this app.
     * @param at The target index in the collection of `Children`. If `at` is lower than 0 it is
     * considered to be 0. If `at` is greater than `Children.length` the given components will be
     * appended. If `at` is a component the components will be inserted at the position of `at`
     * within the `Children` of this app. If `at` is not a child of this apps children,
     * nothing will be inserted.
     * @param components The components to insert.
     * @returns This instance.
     */
    public insert(at: number | INodeComponent<Node>, ...components: INodeComponent<Node>[]): this {
        this.root.insert(at, ...components);
        return this;
    }

    /**
     * Remove child components from this the app. Also removes the corresponding HTML elements
     * from their parent HTML elements. Also available on `Root`, re-exported here for convenience.
     * @param components The components to remove.
     * @returns This instance.
     */
    public remove(...components: INodeComponent<Node>[]): this {
        this.root.remove(...components);
        return this;
    }

    /**
     * Extract child components from this the app. Also removes the corresponding Nodes/HTML
     * elements from the DOM node of this app. The removed components will be pushed to the
     * array given by `to`. If the length of `...components` is `0` *all* children of this component
     * will be extracted and pushed to `to`. Also available on `Root`, re-exported here for
     * convenience.
     * @param to An array to which the removed components will be pushed.
     * @param components The components to be extracted.
     * @returns This instance.
     */
    public extract(to: INodeComponent<Node>[], ...components: INodeComponent<Node>[]): this {
        this.root.extract(to, ...components);
        return this;
    }
}

/**
 * A class that serves as the root for an application which is appended to an existing DOM element.
 * The class uses an instance of a `CSSClassNameFactory` to setup components obtained from
 * `VTS_CSSClassNameFactory_App` (`CSSClassNameFactory` sets the CSS class of a component based on
 * the components class name). The intended use of `VTS_CSSClassNameFactory_App` is to be extended
 * by `buildComponentFactoryClass()` with factories for _all_ components, that the application will
 * use.
 * @example
 * ```
 * const MyAppClass = buildComponentFactoryClass(
 *     VTS_CSSClassNameFactory_App,
 *     DivFactory,
 *     H1Factory,
 *     PFactory,
 *     ButtonFactory);
 * 
 * export const _ = new MyAppClass(document.getElementById("app"), "vts", true);
 * 
 * _.append(
 *     _.div().append(
 *         _.h1("An app"),
 *         _.p("Hello world!"),
 *         _.button("Click me!")
 *             .on("click", () => alert("Thank you!")),
 *     )
 * )
 * ```
 */
export class VTS_CSSClassNameFactory_App<EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends VTSApplication<EventMap> {
    #cf: ComponentFactory<IComponent>;
    #cssPrefix: string;
    #recursive: boolean;

    /**
     * Build an app within the given root element.
     * @param rootElement The root DOM container element for all components to be added.
     * @param cssPrefix The prefix for the generated CSS class name (`-` will always be appended to
     * the prefix).
     * @param recursive If `true`, nested components will be handled recursively.
     */
    constructor(rootElement?: HTMLElementWithChildren, cssPrefix: string = "vts", recursive: boolean = false) {
        super(rootElement);
        this.#cssPrefix = cssPrefix;
        this.#recursive = recursive;
        this.#cf = new CSSClassNameFactory(this.#cssPrefix, this.#recursive);
    }

    /**
     * Get CSS prefix used to setup components obtained by factory methods.
     */
    public get CSSPrefix(): string {
        return this.#cssPrefix;
    }

    /**
     * Get `Recursive` flag used to setup components obtained by factory methods.
     */
    public get Recursive(): boolean {
        return this.#recursive;
    }

    /** @inheritdoc */
    public override setupComponent(component: IComponent, data?: unknown): IComponent {
        super.setupComponent(component, data);
        return this.#cf.setupComponent(component, data);
    }
}
