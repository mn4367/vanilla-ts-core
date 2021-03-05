import {
    ALL_EVENTS,
    IChildren,
    IComponent,
    IComponentFactory,
    IElementComponent,
    IElementVoidComponent,
    IElementWithChildrenComponent,
    IEventListener,
    IFragment,
    IIsElementComponent,
    INodeComponent
} from "./Interfaces.js";
import {
    AnyType,
    ComponentType,
    CSSRuleNames,
    HTMLElementVoid,
    HTMLElementWithChildren,
    HTMLTagsWithNativeDisabled,
    NullableBoolean,
    NullableNumber,
    NullableString
} from "./Types.js";


/**
 * Abstract base implementation of _all_ components.
 * @see IComponent
 */
export abstract class AComponent implements IComponent {
    /** State of `Disposed` of this component. */
    protected _disposed = false;
    /** Cached class name of this component. */
    protected _className?: string;
    /** Cached parent class of this component. */
    protected _parentClass?: IComponent | undefined | null = null;
    /** Content of the pointer of this component.  */
    protected _pointer?: string;

    /** Cached class path of this component. */
    protected _classPath?: string;

    /** @inheritdoc */
    public readonly ComponentType: ComponentType = ComponentType.COMPONENT;

    /** @inheritdoc */
    public get Disposed(): boolean {
        return this._disposed;
    }

    /** @inheritdoc */
    public get ClassName(): string {
        return this._className ?? (this._className = this.constructor.name);
    }

    /** @inheritdoc */
    public get ClassPath(): string {
        return this._classPath ?? (this._classPath = this.getClassPath());
    }

    /** @inheritdoc */
    public get ParentClass(): IComponent | undefined {
        if (this._parentClass === null) {
            const parent: AnyType = Object.getPrototypeOf(Object.getPrototypeOf(this)); // eslint-disable-line @typescript-eslint/no-unsafe-assignment
            this._parentClass = parent instanceof AComponent
                ? parent
                : undefined;
        }
        return this._parentClass;
    }

    /** @inheritdoc */
    public get Pointer(): string | undefined {
        return this._pointer;
    }
    /** @inheritdoc */
    public set Pointer(v: string | undefined) {
        this.pointer(v);
    }

    /** @inheritdoc */
    public pointer(pointer?: string): this {
        this._pointer = pointer;
        return this;
    }

    /** @inheritdoc */
    protected getClassPath(): string {
        const path: string[] = [];
        /* eslint-disable */
        let proto = Object.getPrototypeOf(this);
        while (proto) {
            path.push(proto.constructor.name);
            proto = Object.getPrototypeOf(proto);
        }
        /* eslint-enable */
        return path.reverse().slice(1).join(".");
    }

    /** @inheritdoc */
    exec(fnc: (...args: AnyType[]) => unknown, thisArg?: unknown, ...args: AnyType[]): this {
        fnc.call(thisArg, ...args); // eslint-disable-line @typescript-eslint/no-unsafe-argument
        return this;
    }

    /** @inheritdoc */
    public dispose(): void {
        this._pointer = undefined;
        this._disposed = true;
    }
}

/**
 * Abstract base implementation of all node or element based components.
 * @see INodeComponent
 */
export abstract class ANodeComponent<T extends Node> extends AComponent implements INodeComponent<T> {
    /** The underlying node or element. */
    protected _dom!: T;
    /** The parent component. */
    protected _parent: IElementWithChildrenComponent<HTMLElementWithChildren> | undefined = undefined;

    /** @inheritdoc */
    public get DOM(): T {
        return this._dom;
    }

    /** @inheritdoc */
    public override readonly ComponentType: ComponentType = ComponentType.NODE;

    /** @inheritdoc */
    public get Parent(): IElementWithChildrenComponent<HTMLElementWithChildren> | undefined {
        return this._parent;
    }

    /** @inheritdoc */
    public get Next(): INodeComponent<Node> | undefined {
        const parentChildren = this._parent?.Children;
        if (!parentChildren) {
            return undefined;
        }
        const index = parentChildren.indexOf(this);
        return index < 0 ? undefined : parentChildren[index + 1];
    }

    /** @inheritdoc */
    public get Previous(): INodeComponent<Node> | undefined {
        const parentChildren = this._parent?.Children;
        if (!parentChildren) {
            return undefined;
        }
        const index = parentChildren.indexOf(this);
        return index < 0 ? undefined : parentChildren[index - 1];
    }

    /** @inheritdoc */
    public isContainedIn(component: INodeComponent<Node>): boolean {
        let parent = this.Parent;
        while (parent) {
            if (parent === component) {
                return true;
            }
            parent = parent.Parent;
        }
        return false;
    }

    /** @inheritdoc */
    public contains(component: INodeComponent<Node>): boolean {
        return component.isContainedIn(this);
    }

    /** @inheritdoc */
    public get Connected(): boolean {
        return this._dom.isConnected;
    }

    /** @inheritdoc */
    public get Text(): NullableString | null {
        return this._dom.textContent;
    }
    /** @inheritdoc */
    public set Text(v: NullableString | null) {
        this._dom.textContent = v;
    }

    /** @inheritdoc */
    public text(text: NullableString): this {
        this._dom.textContent = text;
        return this;
    }

    /** @inheritdoc */
    public onBeforeUnmount(): void { /**/ }

    /** @inheritdoc */
    public onDidUnmount(): void {
        this._parent = undefined;
    }

    /** @inheritdoc */
    public onBeforeMount(_parent: IElementWithChildrenComponent<HTMLElementWithChildren>): void { /**/ }

    /** @inheritdoc */
    public onDidMount(parent: IElementWithChildrenComponent<HTMLElementWithChildren>): void {
        this._parent = parent;
    }

    /** @inheritdoc */
    public override dispose(): void {
        /**
         * `this._dom.parentNode` is present only for top-level components that have no parent
         * component, but whose DOM is a child node of another DOM element of the page.
         */
        this._dom?.parentNode?.removeChild(this._dom);
        // @ts-ignore
        this._dom = undefined;
        super.dispose();
    }
}

/**
 * Abstract base implementation of all HTML element based components.
 * @see IElementComponent
 */
export abstract class AElementComponent<T extends (HTMLElementWithChildren | HTMLElementVoid), EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends ANodeComponent<T> implements IElementComponent<T, EventMap> {
    /** A list holding the currently assigned event handlers. */
    protected eventListeners: IEventListener[] = [];
    /** The internal flag holding the disabled state of the element. */
    protected _disabled: NullableBoolean = false;
    /** The internal flag holding the parentDisabled state of the element. */
    protected _parentDisabled: NullableBoolean = false;
    /** The current state of visibility. */
    protected _visible = true;
    /** The last state of `this._dom.style.display`. */
    protected prevStyleDisplay: string;
    /** The current state of hiddenness. */
    protected _hidden = false;
    /** The last state of `this._dom.style.visibility`. */
    protected prevStyleVisibility: string;

    /** @inheritdoc */
    public override readonly ComponentType: ComponentType = ComponentType.ELEMENT;

    /** @inheritdoc */
    public get ID(): NullableString {
        return this.attr("id");
    }
    /** @inheritdoc */
    public set ID(v: NullableString) {
        this.id(v);
    }

    /** @inheritdoc */
    public id(id: NullableString): this {
        return this.attrib("id", id);
    }

    /** @inheritdoc */
    public get Clazz(): NullableString {
        return this.attr("class");
    }
    /** @inheritdoc */
    public set Clazz(v: NullableString) {
        this.clazz(v);
    }

    /** @inheritdoc */
    public clazz(clazz: NullableString): this {
        return this.attrib("class", clazz);
    }

    /** @inheritdoc */
    public addClass(...classes: string[]): this {
        this._dom.classList.add(...classes.map(e => e.trim()).filter(e => e !== ""));
        return this;
    }

    /** @inheritdoc */
    public removeClass(...classes: string[]): this {
        this._dom.classList.remove(...classes.map(e => e.trim()).filter(e => e !== ""));
        this._dom.getAttribute("class")?.trim() === ""
            ? this._dom.removeAttribute("class")
            : undefined;
        return this;
    }

    /** @inheritdoc */
    public replaceClass(clazz: string, withClass: string): this {
        const c = clazz.trim();
        const w = withClass.trim();
        if (c !== "" && w !== "") {
            this._dom.classList.replace(c, w);
        }
        return this;
    }

    /** @inheritdoc */
    public toggleClass(...classes: string[]): this {
        for (const clazz of classes.map(e => e.trim()).filter(e => e !== "")) {
            this._dom.classList.toggle(clazz);
        }
        this._dom.getAttribute("class")?.trim() === ""
            ? this._dom.removeAttribute("class")
            : undefined;
        return this;
    }

    /** @inheritdoc */
    public hasClass(...classes: string[]): boolean {
        for (const clazz of classes) {
            if (!this._dom.classList.contains(clazz)) {
                return false;
            }
        }
        return true;
    }

    /** @inheritdoc */
    public attrib(name: string, value: NullableString): this {
        value === null ? this._dom.removeAttribute(name) : this._dom.setAttribute(name, value);
        return this;
    }

    /** @inheritdoc */
    public attr(name: string): NullableString {
        return this._dom.getAttribute(name);
    }

    /** @inheritdoc */
    public attribN(name: string, value: NullableNumber): this {
        value === null ? this._dom.removeAttribute(name) : this._dom.setAttribute(name, value.toString());
        return this;
    }

    /** @inheritdoc */
    public attrN(name: string): NullableNumber {
        const value = this.attr(name);
        return value === null ? null : parseInt(value);
    }

    /** @inheritdoc */
    public attribB(name: string, value: NullableBoolean): this {
        value === null || !value
            ? this._dom.removeAttribute(name)
            : this._dom.setAttribute(name, "");
        return this;
    }

    /** @inheritdoc */
    public attrB(name: string): NullableBoolean {
        const value = this.attr(name);
        return value === null ? null : (value === "" || value.toLowerCase() === "true" || value === "1");
    }

    /** @inheritdoc */
    public get Disabled(): NullableBoolean {
        if (this.hasNativeDisabled) {
            const disabled = this.attrB("disabled");
            return (disabled === null)
                ? false
                : disabled === true;
        }
        return this._disabled;
    }
    /** @inheritdoc */
    public set Disabled(v: NullableBoolean) {
        this.disabled(v);
    }

    /** @inheritdoc */
    public disabled(disabled: NullableBoolean): this {
        if (disabled !== this._disabled) {
            this._disabled = disabled;
            this._disabled
                ? this.addClass("disabled")
                : this.removeClass("disabled");
            return this.hasNativeDisabled
                ? this.attribB("disabled", this._disabled)
                : this;
        }
        return this;
    }

    /**
     * Returns `true`, if the underlying HTML element is one of `button`, `fieldset`, `input`,
     * `optgroup`, `option`, `select`, `textarea`, otherwise `false`.
     */
    public get hasNativeDisabled(): boolean {
        // @ts-ignore
        return HTMLTagsWithNativeDisabled.includes(this._dom.tagName);
    }



    /** @inheritdoc */
    public get ParentDisabled(): boolean {
        return false;//this.attrB("disabled");
    }
    /** @inheritdoc */
    public set ParentDisabled(_v: boolean) {
        // this.disabled(v);
    }

    /** @inheritdoc */
    public parentDisabled(disabled: boolean): this {
        return this;
        this._disabled = disabled;
        return this.attribB("disabled", !disabled);
    }



    /** @inheritdoc */
    public get Visible(): boolean {
        return this._visible;
    }
    /** @inheritdoc */
    public set Visible(v: boolean) {
        this.visible(v);
    }

    /** @inheritdoc */
    public visible(visible: boolean): this {
        if (visible !== this._visible) {
            this._visible = visible;
            if (this._visible) {
                this._dom.style.display = this.prevStyleDisplay;
                this.attribB("data-invisible", null);
            } else {
                this.prevStyleDisplay = this._dom.style.display;
                this._dom.style.display = "none";
                this.attribB("data-invisible", true);
            }
        }
        return this;
    }

    /** @inheritdoc */
    public get Hidden(): boolean {
        return this._hidden;
    }
    /** @inheritdoc */
    public set Hidden(v: boolean) {
        this.hidden(v);
    }

    /** @inheritdoc */
    public hidden(hidden: boolean): this {
        if (hidden !== this._hidden) {
            this._hidden = hidden;
            if (this._hidden) {
                this.prevStyleVisibility = this._dom.style.visibility;
                this._dom.style.visibility = "hidden";
                this.attribB("data-hidden", true);
            } else {
                this._dom.style.visibility = this.prevStyleVisibility;
                this.attribB("data-hidden", null);
            }
        }
        return this;
    }

    /** @inheritdoc */
    public get Style(): CSSStyleDeclaration {
        return this._dom.style;
    }

    /** @inheritdoc */
    public style(ruleName: CSSRuleNames, value: string): this {
        this._dom.style.setProperty(ruleName, value);
        return this;
    }

    /** @inheritdoc */
    public get Title(): NullableString {
        return this.attr("title");
    }
    /** @inheritdoc */
    public set Title(v: NullableString) {
        this.title(v);
    }

    /** @inheritdoc */
    public title(title: NullableString): this {
        return this.attrib("title", title);
    }

    /** @inheritdoc */
    public get Listeners(): IEventListener[] {
        const result: IEventListener[] = [];
        for (const listener of this.eventListeners) {
            result.push({
                /* eslint-disable jsdoc/require-jsdoc */
                Type: listener.Type,
                Listener: listener.Listener, // eslint-disable-line @typescript-eslint/unbound-method
                Options: typeof listener.Options === "boolean"
                    ? listener.Options
                    : listener.Options
                        ? { ...listener.Options }
                        : undefined,
                Suspended: listener.Suspended
                /* eslint-enable */
            });
        }
        return result;
    }

    /** @inheritdoc */
    public on<K extends keyof EventMap>(type: K, listener: (this: HTMLElement, ev: EventMap[K]) => AnyType, options?: boolean | AddEventListenerOptions): this {
        const listenerOptions = options === undefined
            ? undefined
            : typeof options === "boolean"
                ? options
                : this.sortEventListenerOptions(options);
        (<HTMLElement>this._dom).addEventListener(<keyof HTMLElementEventMap>type, <EventListener>listener, listenerOptions);
        /* eslint-disable jsdoc/require-jsdoc */
        this.eventListeners.push({
            Type: <keyof HTMLElementEventMap>type,
            Listener: <EventListener>listener,
            Options: listenerOptions,
            Suspended: false
        });
        /* eslint-enable */
        return this;
    }

    /** @inheritdoc */
    public once<K extends keyof EventMap>(type: K, listener: (this: HTMLElement, ev: EventMap[K]) => AnyType, options?: boolean | AddEventListenerOptions): this {
        (<HTMLElement>this._dom).addEventListener(
            <keyof HTMLElementEventMap>type,
            <EventListener>listener,
            /* eslint-disable jsdoc/require-jsdoc */
            typeof options === "boolean"
                ? { capture: options, once: true }
                : { ...options, once: true }
            /* eslint-enable */
        );
        return this;
    }

    /** @inheritdoc */
    public off<K extends keyof EventMap>(type: K, listener: (this: HTMLElement, ev: EventMap[K]) => AnyType, options?: boolean | AddEventListenerOptions): this {
        const { Index } = this.indexOfEventListener(type, listener, options); // eslint-disable-line jsdoc/require-jsdoc
        if (Index !== -1) {
            const listener = this.eventListeners[Index];
            this._dom.removeEventListener(listener.Type, listener.Listener, listener.Options); // eslint-disable-line @typescript-eslint/unbound-method
            this.eventListeners.splice(Index, 1);
        }
        return this;
    }

    /** @inheritdoc */
    public suspend<K extends keyof EventMap>(type: K, listener: (this: HTMLElement, ev: EventMap[K]) => AnyType, options?: boolean | AddEventListenerOptions): this {
        const { Index } = this.indexOfEventListener(type, listener, options); // eslint-disable-line jsdoc/require-jsdoc
        if (Index !== -1 && this.eventListeners[Index].Suspended === false) {
            this.eventListeners[Index].Suspended = true;
            this.reinstallEventListeners();
        }
        return this;
    }

    /** @inheritdoc */
    public resume<K extends keyof EventMap>(type: K, listener: (this: HTMLElement, ev: EventMap[K]) => AnyType, options?: boolean | AddEventListenerOptions): this {
        const { Index } = this.indexOfEventListener(type, listener, options); // eslint-disable-line jsdoc/require-jsdoc
        if (Index !== -1 && this.eventListeners[Index].Suspended === true) {
            this.eventListeners[Index].Suspended = false;
            this.reinstallEventListeners();
        }
        return this;
    }

    /** @inheritdoc */
    public allEvents(mode: ALL_EVENTS): this {
        switch (mode) {
            case ALL_EVENTS.OFF:
                for (const listener of this.eventListeners) {
                    this._dom.removeEventListener(listener.Type, <EventListener>listener.Listener, listener.Options); // eslint-disable-line @typescript-eslint/unbound-method
                }
                this.eventListeners.length = 0;
                break;
            case ALL_EVENTS.SUSPEND:
                for (const listener of this.eventListeners) {
                    listener.Suspended = true;
                    this._dom.removeEventListener(listener.Type, <EventListener>listener.Listener, listener.Options); // eslint-disable-line @typescript-eslint/unbound-method
                }
                break;
            case ALL_EVENTS.RESUME:
                for (const listener of this.eventListeners) {
                    listener.Suspended = false;
                }
                this.reinstallEventListeners();
                break;
        }
        return this;
    }

    /**
     * Free resources of this component. The normal behavior is that afterwards the component is no
     * longer functional. _Notes:_
     * - Not calling `super.dispose()` at the end is considered to be an error!
     * - A component should always be removed from its parent component (if any) *before* calling
     *   `dispose()` to prevent unwanted side effects during `dispose()`. Due to the inheritance
     *   hierarchy, the component will also be removed from the DOM automatically at some point
     *   (only if `super.dispose()` is used correctly), but nevertheless the removal should be done
     *   as early as possible.
     * - A component must not remove itself from its parent within `dispose()` since this may lead
     *   lead to problems if a component with child components tries to dispose its children.
     * - __Important:__ The expected behaviour of a component with child components is that it also
     *   removes and disposes all its children when calling `dispose()` on it! Normally this doesn't
     *   have to be implemented for Components that inherit from `AElementComponentWithChildren`
     *   since the implementation of `dispose()` there already does this. But if a component is
     *   derived from AElementComponent and builds its own opaque (set or tree of) components,
     *   `dispose()` _must_ be overridden and it _must_ ensure that all these self-generated
     *   components are disposed.
     * @see IDisposable.dispose
     * @see Class `AElementComponentWithInternalUI`.
     */
    public override dispose(): void {
        this.allEvents(ALL_EVENTS.OFF);
        super.dispose();
    }

    /**
     * Sort the keys of an event listener options object alphabetically.
     * @param listenerOptions The event listener options object.
     * @returns A new object whose keys are sorted alphabetically.
     */
    protected sortEventListenerOptions(listenerOptions: AddEventListenerOptions): AddEventListenerOptions {
        return Object.keys(listenerOptions)
            .sort()
            .reduce(function (sorted: AddEventListenerOptions, key: string) {
                // @ts-ignore
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                sorted[key] = listenerOptions[key];
                return sorted;
            }, {});
    }

    /**
     * Searches an event listener in the internal list of event listeners.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
     * @param type Event type (click, blur etc.).
     * @param listener Listener function or object.
     * @param options Event listener options.
     * @returns The index of the listener found or `-1` if the listener couldn't be found.
     */
    protected indexOfEventListener<K extends keyof EventMap>(type: K, listener: (this: HTMLElement, ev: EventMap[K]) => AnyType, options?: boolean | AddEventListenerOptions): { Index: number; ListenerOptions?: boolean | AddEventListenerOptions; } { // eslint-disable-line jsdoc/require-jsdoc
        const listenerOptions = options === undefined
            ? undefined
            : typeof options === "boolean"
                ? options
                : this.sortEventListenerOptions(options);
        for (let i = 0; i < this.eventListeners.length; i++) {
            const entry = this.eventListeners[i];
            if ((entry.Type === type)
                && (entry.Listener === listener)
                && (JSON.stringify(entry.Options) === JSON.stringify(listenerOptions))) {
                return { Index: i, ListenerOptions: listenerOptions }; // eslint-disable-line jsdoc/require-jsdoc
            }
        }
        return { Index: -1, ListenerOptions: listenerOptions }; // eslint-disable-line jsdoc/require-jsdoc
    }

    /**
     * Removes and adds all event listeners.
     */
    protected reinstallEventListeners(): void {
        for (const listener of this.eventListeners) {
            this._dom.removeEventListener(listener.Type, <EventListener>listener.Listener, listener.Options); // eslint-disable-line @typescript-eslint/unbound-method
        }
        for (const listener of this.eventListeners) {
            listener.Suspended
                ? undefined
                : this._dom.addEventListener(listener.Type, <EventListener>listener.Listener, listener.Options); // eslint-disable-line @typescript-eslint/unbound-method
        }
    }
}

/**
 * Abstract base implementation of a component, *that does not allow* adding child components.
 * @see IElementVoidComponent
 */
export abstract class AElementComponentVoid<T extends HTMLElementVoid, EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends AElementComponent<T, EventMap> implements IElementVoidComponent<T> { }

/**
 * Abstract base implementation of a component, *that does allow* adding child components.
 * @see IElementWithChildrenComponent
 */
export abstract class AElementComponentWithChildren<T extends HTMLElementWithChildren, EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends AElementComponent<T, EventMap> implements IElementWithChildrenComponent<T, EventMap> {
    /** Contains the child elements of this component. */
    protected _children: INodeComponent<Node>[] = [];

    /** @inheritdoc */
    public override readonly ComponentType: ComponentType = ComponentType.ELEMENT_WITH_CHILDREN;

    /** @inheritdoc */
    public get Children(): INodeComponent<Node>[] {
        return this._children.slice();
    }

    /** @inheritdoc */
    public get ElementChildren(): IIsElementComponent[] {
        return this._children.filter(
            child => child.ComponentType === ComponentType.ELEMENT || child.ComponentType === ComponentType.ELEMENT_WITH_CHILDREN
        ) as IIsElementComponent[];
    }

    /** @inheritdoc */
    public get First(): INodeComponent<Node> | undefined {
        return this._children[0];
    }

    /** @inheritdoc */
    public get Last(): INodeComponent<Node> | undefined {
        return this._children.at(-1);
    }

    /**
     * @inheritdoc
     */
    public override get Text(): NullableString | null {
        return this._dom.textContent;
    }

    /**
     * By default, the overridden implementation of `text()` here prevents 'destroying' the content
     * of this component. The correct way is to use `remove()`, `extract()` etc. To simplify setting
     * text content for elements like `em` or `button` this function can/should be overridden again.
     * @inheritdoc
     */
    public override text(_text: NullableString): this {
        throw new Error("'text()' can't be used on 'IElementWithChildrenComponent'.");
    }

    /** @inheritdoc */
    public override disabled(disabled: NullableBoolean): this {
        if (disabled !== this._disabled) {
            super.disabled(disabled);
            for (const child of this._children) {
                if (child.ComponentType === ComponentType.ELEMENT || child.ComponentType === ComponentType.ELEMENT_WITH_CHILDREN) {
                    (<IIsElementComponent>child).disabled(disabled);
                }
            }
        }
        return this;
    }

    /** @inheritdoc */
    public append(...components: INodeComponent<Node>[]): this {
        if (components.length === 0) {
            return this;
        }
        // Avoid multiple unnecessary `remove`/`onBeforeMount`/`onDidMount` operations.
        const uniques = new Set(components);
        /**
         * It's unknown where the given components are possibly mounted so first remove them. This
         * is done groupwise (with regard to the parents of the components).
         */
        const parents: Map<IElementWithChildrenComponent<HTMLElement>, INodeComponent<Node>[]> = new Map();
        for (const component of uniques) {
            const parent = component.Parent;
            if (parent) {
                const group = parents.get(parent);
                if (group) {
                    group.push(component);
                } else {
                    parents.set(parent, [component]);
                }
            }
        }
        for (const entry of parents.entries()) {
            entry[0].remove(...entry[1]);
        }
        for (const component of uniques) {
            component.onBeforeMount(this);
            this._children.push(component);
            this._dom.appendChild(component.DOM);
            component.onDidMount(this);
        }
        return this;
    }

    /** @inheritdoc */
    public appendFragment(fragment: IFragment): this {
        if (fragment.Children.length === 0) {
            return this;
        }
        const { Fragment, Children } = fragment.clear(); // eslint-disable-line jsdoc/require-jsdoc
        // Note: any component in a fragment has already been removed/unmounted from its parent (if
        // any), so there is no need to remove children from their parents here.
        for (const component of Children) {
            component.onBeforeMount(this);
        }
        this._children.push(...Children);
        this._dom.appendChild(Fragment);
        for (const component of Children) {
            component.onDidMount(this);
        }
        return this;
    }

    /** @inheritdoc */
    public insert(at: number | INodeComponent<Node>, ...components: INodeComponent<Node>[]): this {
        if (components.length === 0) {
            return this;
        }
        // This is always an append operation which ignores `at`.
        if (this._children.length === 0) {
            return this.append(...components);
        }
        let insertBefore: INodeComponent<Node>;
        if (typeof at === "number") {
            if (at < 0) {
                insertBefore = this._children[0];
            } else if (at >= this._children.length) {
                return this.append(...components);
            } else {
                insertBefore = this._children[at];
            }
            if (components.includes(insertBefore)) {
                throw new Error("IChildren: hierarchy error, component indexed by 'at' must not be an element of 'components'.");
            }
        } else {
            if (components.includes(at)) {
                throw new Error("IChildren: hierarchy error, component given by 'at' must not be an element of 'components'.");
            }
            const atIndex = this._children.indexOf(at);
            if (atIndex < 0) {
                return this;
            }
            insertBefore = this._children[atIndex];
        }
        if (!insertBefore) {
            return this;
        }
        // Avoid multiple unnecessary `remove`/`onBeforeMount`/`onDidMount` operations.
        const uniques = new Set(components);
        /**
         * It's unknown where the given components are possibly mounted so first remove them. This
         * is done groupwise (with regard to the parents of the components).
         */
        const parents: Map<IElementWithChildrenComponent<HTMLElement>, INodeComponent<Node>[]> = new Map();
        for (const component of uniques) {
            const parent = component.Parent;
            if (parent) {
                const group = parents.get(parent);
                if (group) {
                    group.push(component);
                } else {
                    parents.set(parent, [component]);
                }
            }
        }
        for (const entry of parents.entries()) {
            entry[0].remove(...entry[1]);
        }
        let insertIndex = this._children.indexOf(insertBefore);
        for (const component of uniques) {
            component.onBeforeMount(this);
            this._children.splice(insertIndex, 0, component);
            this._dom.insertBefore(component.DOM, insertBefore.DOM);
            component.onDidMount(this);
            insertIndex++;
        }
        return this;
    }

    /** @inheritdoc */
    public insertFragment(at: number | INodeComponent<Node>, fragment: IFragment): this {
        if (fragment.Children.length === 0) {
            return this;
        }
        // This is always an append operation which ignores `at`.
        if (this._children.length === 0) {
            return this.appendFragment(fragment);
        }
        let index: number;
        if (typeof at === "number") {
            index = at < 0 ? 0 : at;
        } else {
            index = this._children.indexOf(at);
            if (index < 0) {
                return this;
            }
        }
        if (index >= this._children.length) {
            return this.appendFragment(fragment);
        }
        const { Fragment, Children } = fragment.clear(); // eslint-disable-line jsdoc/require-jsdoc
        // Any component in a fragment has already been removed from its parent (if any), so there
        // is no need to remove children from their parents here.
        for (const component of Children) {
            component.onBeforeMount(this);
        }
        const insertBefore = this._children[index];
        this._children.splice(index, 0, ...Children);
        this._dom.insertBefore(Fragment, insertBefore.DOM);
        for (const component of Children) {
            component.onDidMount(this);
        }
        return this;
    }

    /** @inheritdoc */
    public remove(...components: INodeComponent<Node>[]): this {
        if (components.length === 0) {
            // Allow children to inspect their parent tree before actually removing them from the DOM.
            for (const component of this._children) {
                component.onBeforeUnmount();
            }
            while (this._children.length > 0) {
                const component = this._children.at(-1)!;
                this._dom.removeChild(component.DOM);
                this._children.pop();
                component.onDidUnmount();
            }
        } else {
            // Allow children to inspect their parent tree before actually removing them from the DOM.
            for (const component of components) {
                if (component.isContainedIn(this)) {
                    component.onBeforeUnmount();
                }
            }
            for (const component of components) {
                const index = this._children.indexOf(component);
                if (index !== -1) {
                    this._children.splice(index, 1);
                    this._dom.removeChild(component.DOM);
                    component.onDidUnmount();
                }
            }
        }
        return this;
    }

    /** @inheritdoc */
    public extract(to: INodeComponent<Node>[], ...components: INodeComponent<Node>[]): this {
        // Empty this component.
        if (components.length === 0) {
            // Allow children to inspect their parent tree before actually removing them from the DOM.
            for (const component of this._children) {
                component.onBeforeUnmount();
            }
            let child = this._children.at(-1);
            while (child) {
                // Rather slow but if `child` inspects the children of its parent
                // (this component) in `onDidUnmount` the state is correct.
                to.push(this._children.pop()!);
                this._dom.removeChild(child.DOM);
                child.onDidUnmount();
                child = this._children.at(-1);
            }
            return this;
        }
        // Regular extract of only some components.
        // Avoid multiple unnecessary `remove`/`onBeforeMount`/`onDidMount` operations.
        const uniques = new Set(components);
        // Allow children to inspect their parent tree before actually removing them from the DOM.
        for (const component of uniques) {
            if (component.isContainedIn(this)) {
                component.onBeforeUnmount();
            }
        }
        for (const component of uniques) {
            const index = this._children.indexOf(component);
            if (index !== -1) {
                to.push(this._children.splice(index, 1)[0]);
                this._dom.removeChild(component.DOM);
                component.onDidUnmount();
            }
        }
        return this;
    }

    /** @inheritdoc */
    public moveTo(target: IChildren, ...components: INodeComponent<Node>[]): this {
        if (target === this) {
            throw new Error("IChildren: 'moveTo' isn't supported inside IChildren.");
        }
        const extracted: INodeComponent<Node>[] = [];
        this.extract(extracted, ...components);
        target.append(...extracted);
        return this;
    }

    /** @inheritdoc */
    public moveToAt(target: IChildren, at: number | INodeComponent<Node>, ...components: INodeComponent<Node>[]): this {
        if (target === this) {
            throw new Error("IChildren: 'moveToAt' isn't supported inside IChildren.");
        }
        if (typeof at !== "number" && !target.Children.includes(at)) {
            throw new Error("IChildren: param 'at' for 'moveToAt' isn't a child of 'target'.");
        }
        const extracted: INodeComponent<Node>[] = [];
        this.extract(extracted, ...components);
        target.insert(at, ...extracted);
        return this;
    }

    /** @inheritdoc */
    public clear(): this {
        for (const component of this._children) {
            component.onBeforeUnmount();
        }
        while (this._children.length > 0) {
            const component = this._children.at(-1)!;
            this._dom.removeChild(component.DOM);
            this._children.pop();
            component.onDidUnmount();
            component.dispose();
        }
        // Remove remaining DOM only nodes.
        this._dom.replaceChildren();
        return this;
    }

    /** @inheritdoc */
    public override dispose(): void {
        this.clear();
        super.dispose();
    }
}


/**
 * Abstract base class for creating components that manage their own component tree/user interface
 * without exposing inner components as children of the component. For example, if a component is
 * needed that displays personal data such as first name, last name and date of birth, it may seem
 * simple to just extend the class `Div` (from `@vanilla-ts/dom`) and add a few paragraph components
 * for the data to be displayed.\
 * While this is perfectly fine from a technical point of view, the resulting component makes all
 * its children visible to the outside world, since `Div` implements the `IChildren` interface,
 * which makes it very difficult to “protect” the children from unwanted access. This could be
 * solved by overriding most or all of the `IChildren` functions, but the result would be a
 * component that 'looks' like a `Div` component but has a completely different and probably
 * unexpected behavior for consumers.\
 * For components with their own 'opaque' user interface like the one described above,
 * `AElementComponentWithInternalUI` is preferable as the base class. It allows to build an inner
 * user interface that isn't accessible from outside the component. Another advantage of using 
 * `AElementComponentWithInternalUI` is that extending classes do not (usually) have to worry about
 * releasing the inner components, as `AElementComponentWithInternalUI` already contains a suitable
 * implementation of `dispose()` for this purpose. It can also be specified whether the inner
 * container with its tree should be attached to the outer component tree or not.
 * 
 * The following example is a simple stepper component (together with an appropriate factory) with
 * sub-components that are not accessible from outside.
 * @example
 * export class Stepper extends AElementComponentWithInternalUI<Div> {
 *   private val: Span;
 * 
 *   constructor(private start: number = 0) {
 *     super();
 *     // Never call `this.buildUI()` yourself since this is done by `initialize()` (which _must_
 *     // be called)!
 *     super.initialize();
 *   }
 * 
 *   protected override buildUI(): this {
 *     this.ui = new Div().append(
 *       new Button("+").on("click", () => this.step(1)),
 *       this.val = new Span(this.start.toString()),
 *       new Button("-").on("click", () => this.step(-1)),
 *     );
 *     return this;
 *   }
 * 
 *   public step(amount: number): void {
 *     this.val.text((this.start += amount).toString());
 *   }
 * }
 *
 * export class StepperFactory<T> extends ComponentFactory<Stepper> {
 *   public stepper(start: number = 0, data?: T): Stepper {
 *     return this.setupComponent(new Stepper(start), data);
 *   }
 * }
 */
export abstract class AElementComponentWithInternalUI<T extends AElementComponentWithChildren<HTMLElementWithChildren, EventMap>, EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends AElementComponent<HTMLElementVoid, EventMap> {
    /** The container which constitutes the component tree/user interface of the component. */
    protected ui: T;
    #mountUI: boolean;
    #initialized = false;

    /** @inheritdoc */
    public override get Text(): NullableString | null {
        return this.ui.DOM.textContent;
    }

    /** @inheritdoc */
    public override text(_text: NullableString): this {
        throw new Error("'text()' can't be used on 'AElementComponentWithInternalUI'.");
    }

    /** @inheritdoc */
    public override get Disabled(): NullableBoolean {
        return this._disabled;
    }
    /** @inheritdoc */
    public override set Disabled(v: NullableBoolean) {
        this.disabled(v);
    }

    /** @inheritdoc */
    public override disabled(disabled: NullableBoolean): this {
        if (disabled !== this._disabled) {
            this._disabled = disabled;
            this._disabled
                ? this.addClass("disabled")
                : this.removeClass("disabled");
            this.ui.disabled(disabled);
        }
        return this;
    }

    /**
     * Builds the internal component tree/user interface of the component. Has to be implemented
     * by classes that extend `AElementComponentWithInternalUI`. Will automatically be called by
     * `init()` and _must never_ be called directly in derived classes.
     * @returns This instance.
     */
    protected abstract buildUI(): this;

    /**
     * _Must_ be called by derived classes, preferably as the last operation in the constructor.
     * This automatically calls `buildUI()` in derived classes (which _must never_ be called
     * directly there).
     * @param mountUI If `true`, this instance is set as the parent component of the UI container
     * (`ui`). This allows children of `ui` to traverse out of the component tree of this compoenent
     * with subsequent `.Parent` calls. If `false`, a chain of `.Parent` calls will end up with
     * `undefined` at `this.ui.Parent` which isolates all inner components from the component tree
     * existing outside this component.
     * @returns This instance.
     */
    protected initialize(mountUI: boolean = true): this {
        if (this.#initialized) {
            throw new Error("'init()' can only be called once.");
        }
        this.#initialized = true;
        this.#mountUI = mountUI;
        this.buildUI();
        if (this.#mountUI) {
            this.ui.onBeforeMount(<IElementWithChildrenComponent<HTMLDivElement>><unknown>this);
            this._dom = <HTMLElementVoid>this.ui.DOM;
            this.ui.onDidMount(<IElementWithChildrenComponent<HTMLDivElement>><unknown>this);
        } else {
            this._dom = <HTMLElementVoid>this.ui.DOM;
        }
        return this;
    }

    /**
     * Removes _all_ child components from the internal component tree/user interface of this
     * component. The child components are also disposed.
     * @see `IChildren.clear()`.
     * @returns This instance.
     */
    public clear(): this {
        if (!this.#initialized) {
            throw new Error("'dispose()' can only be called once after 'init()'.");
        }
        if (this.#mountUI) {
            this.ui.onBeforeUnmount();
            this.ui.clear();
            this.ui.onDidUnmount();
        } else {
            this.ui.clear();
        }
        return this;
    }

    /** @inheritdoc */
    public override dispose(): void {
        this.clear();
        super.dispose();
    }
}


/**
 * Abstract base implementation of a fragment.
 * @see IFragment
 */
export abstract class AFragmentComponent extends AComponent implements IFragment {
    /**
     * The HTML document fragment.
     */
    protected _dom!: DocumentFragment;

    /**
     * Contains the child elements of this fragment.
     */
    protected _children: INodeComponent<Node>[] = [];

    /** @inheritdoc */
    public override readonly ComponentType: ComponentType = ComponentType.FRAGMENT;

    /** @inheritdoc */
    public get DOM(): DocumentFragment {
        return this._dom;
    }

    /** @inheritdoc */
    public get Children(): INodeComponent<Node>[] {
        return this._children;
    }

    /** @inheritdoc */
    public get ElementChildren(): IIsElementComponent[] {
        return this._children.filter(
            (child) =>
                child.ComponentType === ComponentType.ELEMENT || child.ComponentType === ComponentType.ELEMENT_WITH_CHILDREN
        ) as IIsElementComponent[];
    }

    /** @inheritdoc */
    public append(...components: INodeComponent<Node>[]): this {
        if (components.length === 0) {
            return this;
        }
        // Avoid multiple unnecessary `remove` operations.
        const uniques = new Set(components);
        // It's unknown where the given components are possibly mounted so first remove them.
        for (const component of uniques) {
            component.Parent?.remove(component);
        }
        this._children.push(...uniques);
        for (const component of uniques) {
            this._dom.appendChild(component.DOM);
        }
        return this;
    }

    /** @inheritdoc */
    public remove(...components: INodeComponent<Node>[]): this {
        for (const component of components) {
            const index = this._children.indexOf(component);
            if (index !== -1) {
                this._children.splice(index, 1);
                component.DOM.parentNode?.removeChild(component.DOM);
            }
        }
        return this;
    }

    /** @inheritdoc */
    public clear(): { Fragment: DocumentFragment; Children: INodeComponent<Node>[]; } { // eslint-disable-line jsdoc/require-jsdoc
        /* eslint-disable jsdoc/require-jsdoc */
        const result = {
            Fragment: document.createDocumentFragment(),
            Children: this._children.splice(0)
        };
        /* eslint-enable */
        result.Fragment.append(...this._dom.childNodes);
        return result;
    }

    /**
     * _Note:_ This doesn't destroy/dispose the child components. If references to the child
     * components are stored elsewhere, they can be reused.
     * @see IDisposable.dispose()
     */
    public override dispose(): void {
        for (const component of this._children) {
            component.DOM.parentNode?.removeChild(component.DOM);
        }
        this._dom.replaceChildren();
        // @ts-ignore
        this._dom = undefined;
        this._children.length = 0;
        // @ts-ignore
        this._children = undefined;
        super.dispose();
    }
}

/**
 * Abstract base implementation of a component factory. Currently without any further functionality.
 * @see IComponentFactory
 */
export abstract class AComponentFactory<T extends IComponent> implements IComponentFactory<T> {
    /** @inheritdoc */
    public abstract setupComponent(component: T, data?: unknown): T;
}

/**
 * Utility class that creates a custom event. `T` is the type/name of the custom event, the `detail`
 * property of the event will have a `Sender` property `S` that is the component instance that emits
 * the event and optional typed payload data `D`.
 */
export abstract class ACustomComponentEvent<T extends string, S extends INodeComponent<Node>, D extends Record<string, AnyType> = object> extends CustomEvent<({ Sender: S; } & D)> { // eslint-disable-line jsdoc/require-jsdoc
    /**
     * Create a custom event with a `Sender` property and optional payload data.
     * @param type The type/name of the event.
     * @param sender The component instance that emits the event.
     * @param eventData Optional custom event payload data.
     * @param customEventInitDict Optional event properties. This is an object with the properties
     * `bubbles`, `cancelable` and `composed`, all of them are set to `true`, if
     * `customEventInitDict` is `undefined`.
     */
    constructor(type: T, sender: S, eventData?: D, customEventInitDict?: EventInit) {
        super(type, {
            /* eslint-disable jsdoc/require-jsdoc */
            ...customEventInitDict || { bubbles: true, cancelable: true, composed: true },
            detail: {
                Sender: sender,
                ...(eventData ? eventData : <D>{})
            }
            /* eslint-enable */
        });
    }
}
