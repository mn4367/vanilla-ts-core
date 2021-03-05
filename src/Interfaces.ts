import {
    AnyType,
    ComponentType,
    CSSRuleNames,
    HTMLElementVoid,
    HTMLElementWithChildren,
    NullableBoolean,
    NullableNumber,
    NullableString
} from "./Types.js";


/**
 * An event listener entry. This is the type which is used to add/remove event listeners on a
 * component by calling `on(...)`/`off(...)`. This is the component which is referred to in the
 * documentation of the `target` member.
 */
export interface IEventListener {
    /** The event type e.g. "click", "pointerdown", "my-event" */
    Type: keyof HTMLElementEventMap;//string;//keyof EventMap;
    /** The event callback function. */
    Listener(this: HTMLElement, ev: HTMLElementEventMap[keyof HTMLElementEventMap]): AnyType;
    /**
     * Event listener options.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
     */
    Options?: boolean | AddEventListenerOptions | undefined;
    /**
     * `true`, if listener execution is temporarily suspended, otherwise `false`.
     */
    Suspended: boolean;
}

/**
 * Modes for `allEvents()`.
 */
export enum ALL_EVENTS {
    /** 
     * Removes all event listeners which have been registered with `on()` permanently from the
     * component.
     */
    OFF = 0,
    /** 
     * Suspends the execution of all event listeners which have been registered with `on()` on the
     * component.
     */
    SUSPEND = 1,
    /** 
     * Resumes the execution of all event listeners which have been registered with `on()` on the
     * component.
     */
    RESUME = 2
}

/**
 * Interface indicating that something supports freeing resources. Used, for example, by class
 * instances that will or can no longer be used.
 */
export interface IDisposable {
    /**
     * `true`, if the component has been disposed, otherwise `false`.
     */
    Disposed: boolean;

    /**
     * Free resources/clean up. Sets the property `Disposed` to true.
     */
    dispose(): void;
}

/**
 * Interface to be implemented by classes that allow adding/removing child components.
 */
export interface IChildren {
    /**
     * The child components of this component, includes all children based on a node or element.
     */
    readonly Children: INodeComponent<Node>[];

    /**
     * The child components of this component, includes only children based on an element.
     */
    readonly ElementChildren: IIsElementComponent[];

    /**
     * The first component in the collection of this components children.
     */
    readonly First: INodeComponent<Node> | undefined;

    /**
     * The last component in the collection of this components children.
     */
    readonly Last: INodeComponent<Node> | undefined;

    /**
     * Append child components.
     * - Append the components as child elements to this component.
     * - Also append the underlying Node/HTML Element of each component to the underlying HTML
     *   element of this component.
     * 
     * This function can be used to reorder children inside this component, e.g.
     * `this.append(...this.Children.reverse())`.
     * 
     * There are no restrictions for child components, they can be newly created, mounted to another
     * instance of `IChildren`/`IFragment` or mounted to this instance. If `components` contains
     * multiple occurences of the same component, only the first occurence will be handled.
     * @param components The components to append.
     * @returns This instance.
     */
    append(...components: INodeComponent<Node>[]): this;

    /**
     * Append the children (components) of a fragment to this component. After appending the
     * fragment no longer has children.
     * - Append the components as child elements to this component.
     * - Also append the underlying Node/HTML Element of each component to the underlying HTML
     *   element of this component.
     * @param fragment The fragment.
     * @returns This instance.
     */
    appendFragment(fragment: IFragment): this;

    /**
     * Insert child components at a numeric index or the index of a component reference of this
     * component.
     * - Insert the components as child elements to this component and
     * - also insert the underlying Node/HTML Element of each component to the underlying HTML
     *   element of this component.
     * 
     * There are no restrictions for child components, they can be newly created, mounted to another
     * instance of `IChildren` or mounted to this instance. This function can be used to move
     * children inside this component, e.g. `this.insert(2, this.Children[4], this.Last)`.
     * 
     * __Notes:__
     * - If `at` is a component and at the same time an element of `components` an exception
     *   will be thrown.
     * - If `at` does not belong to the children of this instance, nothing is inserted.
     * @param at The target index in this instance. If `at` is lower than 0 it is considered to be
     * 0. If `at` is greater than or equal to the length of this collection the given components
     * will be appended. If `at` is a component the components will be inserted at the position of
     * `at` within this collection. If this instance has no elements, `at` is ignored and the
     * components are appended.
     * @param components The components to insert.
     * @throws `IChildren: <message>` if the component denoted by `at` is a child of
     * `components`.
     * @returns This instance.
     */
    insert(at: number | INodeComponent<Node>, ...components: INodeComponent<Node>[]): this;

    /**
     * Insert components of a fragment at at numeric index or the index of a component reference of
     * this component.  After appending the fragment no longer has children.
     * - Insert the components as child elements to this component and
     * - also insert the underlying Node/HTML Element of each component to the underlying HTML
     *   element of this component.
     * - If `at` does not belong to the children of this instance, nothing is inserted.
     * @param at The target index in this instance. If `at` is lower than 0 it is considered to be
     * 0. If `at` is greater than or equal to the length of this collection the components of the
     * given fragment will be appended. If `at` is a component the components will be inserted at
     * the position of `at` within this collection. If this instance has no children, `at` is
     * ignored and the components are appended.
     * @param fragment The fragment to insert.
     * @returns This instance.
     */
    insertFragment(at: number | INodeComponent<Node>, fragment: IFragment): this;

    /**
     * Remove child components from this the component. Also removes the corresponding Nodes/HTML
     * elements from the DOM node of this component. If the length of `components`is `0`, _all_
     * components are removed. Removed components must _not_ be disposed.
     * @param components The components to remove. Any element of `components` that isn't a child of
     * this instance is ignored. 
     * @returns This instance.
     */
    remove(...components: INodeComponent<Node>[]): this;

    /**
     * Extract child components from this the component. Also removes the corresponding Nodes/HTML
     * elements from the DOM node of this component. The extracted components will be pushed to the
     * array given by `to`. If the length of `components` is `0` _all_ children of this component
     * will be extracted and pushed to `to`.
     * @param to An array to which the extracted components will be pushed.
     * @param components The components to be extracted. Any element of `components` that isn't a
     * child of this instance is ignored.
     * @returns This instance.
     */
    extract(to: INodeComponent<Node>[], ...components: INodeComponent<Node>[]): this;

    /**
     * Extracts and appends child components from this the instance to another `IChildren` instance.
     * If the length of `components` is `0` _all_ children of this component will be extracted
     * and appended to `target`. If `target` is this instance, an exception will be thrown.
     * @param target The target instance to which the components are to be appended.
     * @param components The components to be extracted and appended. Any element of `components`
     * that isn't a child of this instance is ignored. 
     * @throws `IChildren: <message>` if `target` is `this`.
     * @returns This instance.
     */
    moveTo(target: IChildren, ...components: INodeComponent<Node>[]): this;

    /**
     * Extracts and inserts child components from this the instance into another `IChildren`
     * instance. If the length of `components` is `0` _all_ children of this component will be
     * extracted and inserted into `target`. If `target` is this instance, an exception will be
     * thrown.
     * @param target The target instance into which the components are to be inserted.
     * @param at The target index in the collection of `target`. If `at` is lower than 0 it is
     * considered to be 0. If `at` is greater or equal to `target.length` the given components will
     * be appended. If `at` is a component in `target` the components will be inserted at the
     * position of `at` in `target`. If `at` is not a child of `target` an exception will be thrown.
     * @param components The components to be moved. Any element of `components` that isn't a child
     * of this instance is ignored.
     * @throws `IChildren: <message>` if `target` is `this` or if `at` isn't a child of `target`.
     * @returns This instance.
     */
    moveToAt(target: IChildren, at: number | INodeComponent<Node>, ...components: INodeComponent<Node>[]): this;

    /**
     * Removes _all_ child components from this the component. Also removes the corresponding
     * Nodes/HTML elements from their parent HTML elements. The removed components _must_ also be
     * disposed. In many cases the component must be considered largely unusable after this
     * operation.
     * @returns This instance.
     */
    clear(): this;
}

/**
 * Base inteface for all components.
 */
export interface IComponent extends IDisposable {
    /**
     * The type of this component. Since most of the implementation is based on interfaces it isn't
     * always clear if a component instance obtained from some function is a component without any
     * visual representation, a (text) node, a void component without children
     * (`IElementVoidComponent<HTMLHRElement>`), a component with children
     * (`IElementWithChildrenComponent<HTMLDivElement>`) or a fragment.
     */
    readonly ComponentType: ComponentType;

    /**
     * Class name of this component (should always be `this.constructor.name`).
     */
    readonly ClassName: string;

    /**
     * Class path of the inheritance hierarchy of this component, for example
     * `BaseComponent.ComboBox.LabeledComboBox`.
     */
    readonly ClassPath: string;

    /**
     * Returns the parent class of this instance if it is an instance of `IComponent`, otherwise
     * `undefined` is returned.
     */
    readonly ParentClass: IComponent | undefined;

    /**
     * A pointer is a (preferably short) string that can be 'attached' to a component.
     * 
     * _Usage notes:_
     * - Do not store large strings/blocks of data in the pointer, `Pointer` is not intended to be
     *   used as a general convenient storage option for arbitrary data.
     * - Never implement components whose own functionality is based on or depends on the 'pointer'.
     * - Pointers should always be used from other components, but not from the component itself
     *   that holds the pointer.
     * - Frequent use of pointers is usually a sign of poor design.
     */
    Pointer: string | undefined;

    /**
     * Set the pointer content for this component.
     * @see `Pointer`
     * @param pointer The pointer (string) to be set. Passing `undefined` 'clears' the pointer.
     * @returns This instance.
     */
    pointer(pointer?: string): this;

    /**
     * Executes a function.
     * @param fnc The function to be executed.
     * @param thisArg The value to use as `this` when calling `fnc`.
     * @returns This instance.
     * @example
     * ```typescript
     * const div = new Div();
     * const fnc1 = () => console.log("Arrow function (no access to 'this')");
     * function fnc2(this: Div) { console.log("Function with access to 'this':", this.DOM.tagName); }
     * function fnc3(this: Div, param1: string, param2: string) {
     *   console.log(
     *     "Function with access to 'this' and parameters:",
     *     this.Children.length,
     *     param1,
     *     param2
     *   );
     * }
     * div.exec(() => console.log("Inline arrow function (no access to 'this')"))
     *   .exec(fnc1, div)
     *   .append(new P("Hello world"))
     *   .exec(fnc2, div)
     *   .append(new Button())
     *   .exec(fnc3, div, "foo", "bar")
     * ```
     */
    exec(fnc: (...args: AnyType[]) => unknown, thisArg?: unknown): this;
}

/**
 * Base interface for components based on a node or HTML element.
 */
export interface INodeComponent<T> extends IComponent {
    /**
     * The underlying DOM node or HTML element.\
     * __Note:__ Using this property to append/remove other DOM elements _to a component_, e.g.
     * `someComp.DOM.append(...)` must be done with great care since these DOM elements in many
     * cases won't be tracked at all, e.g. calling `someComp.Children.length` could yield `0` while
     * there are still some remaining DOM elements attached to `someComp.DOM`!
     */
    readonly DOM: T;

    /**
     * The parent component or fragment of this component.
     */
    readonly Parent: IElementWithChildrenComponent<HTMLElementWithChildren> | undefined;

    /**
     * The next sibling component of this component within the array of the `Children` of `Parent`.
     */
    readonly Next?: INodeComponent<Node> | undefined;

    /**
     * The previous sibling component of this component within the array of the `Children` of
     * `Parent`.
     */
    readonly Previous: INodeComponent<Node> | undefined;

    /**
     * Determines if this component is contained in the component tree of another component (at any
     * depth).\
     * __Note:__ It may seem like an error that the type of `component` is only `INodeComponent`,
     * although this type does not implement the interface `IChildren`, but it is possible to
     * implement components that do not allow access to contained child elements, but still manage
     * their own component tree internally. Such components may have to 'patch' their internal tree
     * structure to maintain an uninterrupted chain of parent/child components.
     * @param component The component in whose tree the occurrence of this component is to be
     * searched for.
     * @returns `true`, if this component is contained in the component tree of `component` (at any
     * depth), otherwise `false`.
     */
    isContainedIn(component: INodeComponent<Node>): boolean;

    /**
     * Determines if this component contains another component in its component tree (at any
     * depth).\
     * __Note:__ It may seem like an error that this component contains further components, although
     * it does not implement the interface `IChildren`, but it is possible to implement components
     * that do not allow access to contained child elements, but still manage their own component
     * tree internally. Such components may have to 'patch' their internal tree structure to
     * maintain an uninterrupted chain of parent/child components.
     * @param component The component to be searched for in the component tree of this component.
     * @returns `true`, if this component contains `component` in its component tree (at any depth),
     * otherwise `false`.
     */
    contains(component: INodeComponent<Node>): boolean;

    /**
     * Returns `true`, if the node is connected to a DOM document object, otherwise `false`.
     * Equivalent to the property `DOM.isConnected`.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/isConnected
     */
    readonly Connected: boolean;

    /**
     * Get/set the `textContent` of the underlying Node/HTML.\
     * _Important notes:_
     * - The normal behaviour of setting `textContent` on a node/HTML element is to destroy all
     *   existing child nodes. Setting `Text` should therefore be made impossible at all for
     *   components, that rely on HTML child nodes! This can easily be done with `public override
     *   get Text(): NullableString ...` and leaving out the setter in an implementing class or
     *   through an implementation that protects the DOM nodes of child components. Additionally,
     *   `text(v: NullableString)` should be overridden so that it does somehing similar.
     * - Setting Text to `null` will remove *all* child nodes of the element including the DOM
     *   elements (property `DOM`) of all child components, so the same advice as above applies!
     * - Reading `Text` could be expensive since the `textContent` properties of all child nodes
     *   have to be evaluated recursively and concatenated by the browser!
     */
    Text: NullableString;

    /**
     * Set the property `textContent` of the underlying node or HTML element. See also the notes for
     * the property `Text`.
     * @param text The new text content.
     * @returns This instance.
     */
    text(text: NullableString): this;

    /**
     * Called before removing this component from the `Children` of another component.
     * Implementations can/should use the `Connected` property in `onBeforeUnmount` to avoid doing
     * things that are not feasible for non-connected nodes.
     */
    onBeforeUnmount(): void;

    /**
     * Called after this component has been removed from the `Children` of another component.
     * Implementations can/should use the `Connected` property in `onBeforeUnmount` to avoid doing
     * things that are not feasible for non-connected nodes.\
     * ___Note:___ When overriding this method in subclasses `super.onDidUnmount()` _must_ always be
     * called  at the end, otherwise functions and properties depending on `Index` won't work!!!
     */
    onDidUnmount(): void;

    /**
     * Called before adding this component to the `Children` of another component.
     * @param parent The parent component or fragment to which this component will be added.
     */
    onBeforeMount(parent: IElementWithChildrenComponent<HTMLElementWithChildren>): void;

    /**
     * Called after this component has been added to the `Children` of another component.\
     * ___Note:___ When overriding this method in subclasses `super.onDidMount()` _must_ always be
     * called at the end, otherwise functions and properties depending on `Index` won't work!!!
     * @param parent The parent component or fragment to which this component has been added.
     */
    onDidMount(parent: IElementWithChildrenComponent<HTMLElementWithChildren>): void;
}

/**
 * Base interface for HTML element based components.
 */
export interface IElementComponent<T, EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends INodeComponent<T> {
    /**
     * Get/set ID attribute of the underlying HTML element. Setting ID to `null` will remove the
     * `id` attribute from the element.
     */
    ID: NullableString;

    /**
     * Set the ID of the underlying HTML element.
     * @param id The ID to be set. If `id` is `null`, the `id` attribute will be removed from the
     * element.
     * @returns This instance.
     */
    id(id: NullableString): this;

    /**
     * Get/set class attribute of the underlying HTML element. Setting Clazz to `null` will remove
     * the `class` attribute from the element.
     */
    Clazz: NullableString;

    /**
     * Set the class attribute value on the underlying HTML element. No checks are carried out on
     * the validity of the attribute value.
     * @param clazz The class attribute value to be set. If clazz is `null`, the `class` attribute
     * will be removed from the element.
     * @returns This instance.
     */
    clazz(clazz: NullableString): this;

    /**
     * Add class name(s) to the class list of the underlying HTML element. All class names are
     * trimmed and if a trimmed class name is an empty string, it will be ignored.
     * @param classes The name of the class(es) to be added.
     * @returns This instance.
     */
    addClass(...classes: string[]): this;

    /**
     * Remove class name(s) from the class list of the underlying HTML element. All class names are
     * trimmed and if a trimmed class name is an empty string, it will be ignored.
     * @param classes The name of the class(es) to be removed.
     * @returns This instance.
     */
    removeClass(...classes: string[]): this;

    /**
     * Replaces a class name in the class list of the underlying HTML element with another class
     * name. Both class names are trimmed and if at least one of the trimmed class names is an empty
     * string, the function does nothing.
     * @param clazz The name of the class to be replaced.
     * @param withClass The name of the class, that replaces the former class name.
     * @returns This instance.
     */
    replaceClass(clazz: string, withClass: string): this;

    /**
     * Toggles class name(s) in the class list of the underlying HTML element. All class names are
     * trimmed and if a trimmed class name is an empty string, it will be ignored.
     * @param classes The name of the class(es) to be toggled.
     * @returns This instance.
     */
    toggleClass(...classes: string[]): this;

    /**
     * Checks, if the class name(s) is/are contained in the class list of the underlying HTML
     * element.
     * @param classes The name of the class(es) to be searched for.
     * @returns `true` if _all_ of the class names specified in `...classes` are contained in the
     * class list of the underlying HTML file, otherwise `false`.
     */
    hasClass(...classes: string[]): boolean;

    /**
     * Add/set/remove a string attribute of the underlying HTML element.
     * @param name The name of the attribute.
     * @param value The value of the attribute. If value is `null`, the attribute will be removed
     * from the element. If the value is an empty string the attribute is equivalent to a boolean
     * attribute (like in `<input, type="text" readonly>`).
     * @returns This instance.
     */
    attrib(name: string, value: NullableString): this;

    /**
     * Return the string value of an attribute of the underlying HTML element.
     * @param name The name of the attribute.
     * @returns The string value of the attribute named `name` or `null`, if the attribute doesn't
     * exist on `this`.
     */
    attr(name: string): NullableString;

    /**
     * Add/set/remove a numeric attribute of the underlying HTML element.
     * @param name The name of the attribute.
     * @param value The value of the attribute. If `value` is `null`, the attribute will be removed
     * from the element.
     * @returns This instance.
     */
    attribN(name: string, value: NullableNumber): this;

    /**
     * Return the numeric value of an attribute of the underlying HTML element.
     * @param name The name of the attribute.
     * @returns The numeric value of the attribute named `name` or `null`, if the attribute doesn't
     * exist on `this`.
     */
    attrN(name: string): NullableNumber;

    /**
     * Add/set/remove a boolean attribute of the underlying HTML element.
     * @param name The name of the attribute.
     * @param value The value of the attribute. If value is `null` or `false`, the attribute will be
     * removed from the element. If `value` is true, the value of the attribute will be set to an
     * empty string.
     * @returns This instance.
     */
    attribB(name: string, value: NullableBoolean): this;

    /**
     * Return the boolean value of an attribute of the underlying HTML element. 
     * Return values:
     * - `true` if the attribute is present and its string value is `true` (case insensitive), `1`
     *   or an empty string.
     * - `false` if the attribute is present and its string value does not fulfill the criteria
     *   for `true` (see above).
     * - `null` if the attribute is not present.
     * @param name The name of the attribute.
     * @returns The boolean value of the attribute named `name` or `null`, if the attribute doesn't
     * exist on `this`.
     */
    attrB(name: string): NullableBoolean;

    /**
     * Get/set disabled property on the underlying HTML element.
     */
    Disabled: NullableBoolean;

    /**
     * Set appearance of the underlying HTML to an enabled/disabled state.
     * 
     * Notes:
     * - This property exists only on some HTML elements natively (`button`, `fieldset`, `optgroup`,
     *   `option`, `select`, `textarea`, `input`). Nevertheless it's considered to be so basic for a
     *   UI library that handling it is a requirement for all UI components, so on most components
     *   it has to be faked by CSS or other means.
     * - If an element/component has children, setting `disabled` on _this_ element/component should
     *   also propagate `disabled` to _all_ child elements/components!
     * @param disabled `true` to disable the element, `false` to disable it.
     * @returns This instance.
     */
    disabled(disabled: NullableBoolean): this;



    /**
     * Get/set disabled property on the underlying HTML element.
     */
    ParentDisabled: boolean;

    /**
     * Set appearance of the underlying HTML to an enabled/disabled state.
     * 
     * Notes:
     * - This property exists only on some HTML elements natively (`disabled`). Nevertheless it's
     *   considered to be so basic for a UI library that handling it is a requirement for all UI
     *   components, so on most components it has to be faked by CSS or other means.
     * - Implementors should pass this state to all child elements!
     * @param disabled `true` to disable the element, `false` to disable it.
     * @returns This instance.
     */
    parentDisabled(disabled: boolean): this;



    /**
     * Get/set the visibility state of the underlying HTML element.
     * @see function `visible()`
     */
    Visible: boolean;

    /**
     * Set the visibility state of the underlying HTML element.
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/display#none
     * @param visible `true` to make the element visible, `false` to make it invisible.
     * @returns This instance.
     */
    visible(visible: boolean): this;

    /**
     * Get/set the hidden state of the underlying HTML element.
     * @see function `hidden()`
     */
    Hidden: boolean;

    /**
     * Show or hide the underlying HTML element.
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/visibility#hidden
     * @param hidden `true` to hide the element, `false` to show it.
     * @returns This instance.
     */
    hidden(hidden: boolean): this;

    /**
     * Get/set style rule value of the underlying HTML element.
     */
    Style: CSSStyleDeclaration;

    /**
     * Set style rule value on the underlying HTML element.
     * @param ruleName The CSS style rule name.
     * @param value The style value to be set.
     */
    style(ruleName: CSSRuleNames, value: string): this;

    /**
     * Get/set title attribute of the underlying HTML element. Setting Title to `null` will remove
     * the `title` attribute from the element.
     */
    Title: NullableString;

    /**
     * Set the title attribute value of the underlying HTML element.
     * @param title The title attribute value to be set. If title is `null`, the title attribute
     * will be removed from the element.
     * @returns This instance.
     */
    title(title: NullableString): this;

    /**
     * All currently registered event listeners (as a copy).
     */
    readonly Listeners: IEventListener[];

    // emit?: (eventName: string, ...args: AnyType) => void;

    /**
     * Add a regular event listener to this component. This function must work identical to the
     * `addEventListener` function. The listener is added to the `DOM` property of `this`.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
     * @param type Event type (click, blur etc.).
     * @param listener Listener function.
     * @param options Event listener options.
     * @returns This instance.
     */
    on<K extends keyof EventMap>(type: K, listener: (this: HTMLElement, ev: EventMap[K]) => AnyType, options?: boolean | AddEventListenerOptions): this;

    /**
     * Add a regular event listener to this component that is invoked at most once after being
     * added. This function must work identical to the regular `addEventListener` function. The
     * listener is added to the `DOM` property of `this` and automatically removed when invoked.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
     * @param type Event type (click, blur etc.).
     * @param listener Listener function.
     * @param options Event listener options. In implementations, if `options` is a boolean value it
     * must be replaced with `{capture: options, once: true}`, if `options` is an object or
     * `undefined` or `null`, it must be replaced with `{...options, once: true}`.\
     * __Note:__ Listeners added with `once` are ignored by `setAllEvents()`, it is also impossible
     * to turn off, suspend or resume such listeners.
     * @returns This instance.
     */
    once<K extends keyof EventMap>(type: K, listener: (this: HTMLElement, ev: EventMap[K]) => AnyType, options?: boolean | AddEventListenerOptions): this;

    /**
     * Remove a regular event listener from this component. This function must work identical to the
     * regular `removeEventListener` function. The listener is removed from the `DOM` property of
     * `this`.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener
     * @param type Event type (click, blur etc.).
     * @param listener Listener function.
     * @param options Event listener options.
     * @returns This instance.
     */
    off<K extends keyof EventMap>(type: K, listener: (this: HTMLElement, ev: EventMap[K]) => AnyType, options?: boolean | AddEventListenerOptions): this;

    /**
     * Suspends an event listener if it can be found in the internal list of listeners and if it
     * isn't already suspended. This is different from simply using `off()` and then `on()` again
     * with the listener because the execution order of installed listeners is retained with using
     * `suspend()`/`resume()`.
     * @param type Event type (click, blur etc.).
     * @param listener Listener function.
     * @param options Event listener options.
     * @returns This instance.
     */
    suspend<K extends keyof EventMap>(type: K, listener: (this: HTMLElement, ev: EventMap[K]) => AnyType, options?: boolean | AddEventListenerOptions): this;

    /**
     * Resumes an event listener if it can be found in the internal list of listeners and if it is
     * suspended. This is different from simply using `off()` and then `on()` again with the
     * listener because the execution order of installed listeners is retained with using
     * `suspend()`/`resume()`.
     * @param type Event type (click, blur etc.).
     * @param listener Listener function.
     * @param options Event listener options.
     * @returns This instance.
     */
    resume<K extends keyof EventMap>(type: K, listener: (this: HTMLElement, ev: EventMap[K]) => AnyType, options?: boolean | AddEventListenerOptions): this;

    /**
     * Suspends or resumes the execution of _all currently_ registered regular event listeners on
     * this component or removes all listeners permanently from this component. `allEvents()` must
     * ignore listeners added with `once()`. If all listeners are suspended and then an additional
     * listener is added this listener will be active.
     * @param mode Can be one of `OFF`, `SUSPEND` or `RESUME`. `SUSPEND` and `RESUME` are used to
     * suspend or resume the listeners execution. All listeners will be kept on the component.
     * `OFF` instead will permanently remove alle registered listeners from this component. There
     * is no way to restore these listeners (except they are held elesewhere and are re-registered
     * via `on()`).
     */
    allEvents(mode: ALL_EVENTS): this;
}

/**
 * Base interface for HTML element based components, that *do not allow* adding children.
 */
export interface IElementVoidComponent<T, EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends IElementComponent<T, EventMap> { }

/**
 * Base interface for HTML element based components, that *do allow* adding children.
 */
export interface IElementWithChildrenComponent<T, EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends IElementComponent<T, EventMap>, IChildren { }

/**
 * Union interface for all _HTML element_ based components.
 */
export type IIsElementComponent = /*INodeComponent<Node> &*/ (IElementVoidComponent<HTMLElementVoid> | IElementWithChildrenComponent<HTMLElementWithChildren>);

/**
 * Base interface for a fragment component, similar to the HTML DocumentFragment. The main purpose
 * of a fragment is to add components in bulk to instances of `IElementWithChildrenComponent`.
 */
export interface IFragment extends IComponent, IDisposable {
    /**
     * The HTML document fragment element.\
     * __Note:__ Using this property to append/remove other DOM elements _to a fragment, e.g.
     * `someFragment.DOM.append(...)` must be done with great care since these DOM elements in many
     * cases won't be tracked at all, e.g. calling `someFragment.Children.length` could yield `0`
     * while there are still some remaining DOM elements attached to `someComp.DOM`!
     */
    readonly DOM: DocumentFragment;

    /**
     * The child components of this fragmnet, includes all children based on a node or element.
     */
    Children: INodeComponent<Node>[];

    /**
     * The child components of this fragment, includes only children based on an element.
     */
    ElementChildren: IIsElementComponent[];

    /**
     * Append child components.
     * - Append the components as child elements to this fragment.
     * - Also append the underlying Node/HTML Element of each component to the DocumentFragment
     *   element of this fragment.
     * 
     * There are no restrictions for child components, they can be newly created, mounted to another
     * instance of `IFragment`/`IChildren` or mounted to this instance. If `components` contains
     * multiple occurences of the same component, only the first occurence will be handled.
     * @param components The components to append.
     * @returns This instance.
     */
    append(...components: INodeComponent<Node>[]): this;

    /**
     * Remove child components from this the fragment. Also removes the corresponding Nodes/HTML
     * elements from the DocumentFragment of this fragment. Any element of `components` that isn't a
     * child of this instance is ignored.
     * @param components The components to remove.
     * @returns This instance.
     */
    remove(...components: INodeComponent<Node>[]): this;

    /**
     * Get and remove all children of this fragment. As a result the fragment no longer holds child
     * components.
     * @returns An object with all child components of the fragment and the HTML document fragment.
     */
    clear(): { Fragment: DocumentFragment; Children: INodeComponent<Node>[]; }; // eslint-disable-line jsdoc/require-jsdoc
}

/**
 * Interface for a component factory. Used to setup components after creating an instance e.g. 
 * assign CSS classes and other needed properties.
 */
export interface IComponentFactory<T extends IComponent> {
    /**
     * Set up a component.
     * @param component The component to be set up.
     * @param data Additional data which can be passed to `setupComponent`. This can be used to
     * configure the behaviour of `setupComponent`.
     * @returns A component that has been setup.
     */
    setupComponent(component: T, data?: unknown): T;
}
