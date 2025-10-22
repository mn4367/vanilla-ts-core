import {
    AnyType,
    AutoCapitalizeAttrValues,
    ContentEditableAttrValues,
    CSSRuleNames,
    DirAttrValues,
    EnterKeyHintAttrValues,
    HTMLElementVoid,
    HTMLElementWithChildren,
    HTMLElementWithPhrasingContent,
    InputModeAttrValues,
    NullableBoolean,
    NullableNumber,
    NullableString,
    PopoverAttrValues,
    ResizableValues
} from "./Types.js";


/**
 * An event map that initially has no members.
 */
export interface EventMapVoid { }

/**
 * An event listener entry. This is the type which is used to add/remove event listeners on a
 * component by calling `on(...)`/`off(...)`. This is the component which is referred to in the
 * documentation of the `target` member.
 */
export interface IEventListener<EventMap extends EventMapVoid = HTMLElementEventMap> {
    /** The event type e.g. "click", "pointerdown", "my-event" */
    Type: keyof EventMap;
    /** The event callback function. */
    Listener(this: Node, ev: EventMap[keyof EventMap]): AnyType;
    /**
     * Event listener options.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
     */
    Options: boolean | AddEventListenerOptions | undefined;
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
 * The type of a component.
 */
export enum ComponentType {
    /** Basic component without any visual represantation. */
    COMPONENT = 1,
    /** Pure (text) node component. */
    NODE = 2,
    /** Component based on a void HTML element (`HTMLElementVoid`). */
    ELEMENT = 3,
    /** Component based on an HTML element with children (`HTMLElementWithChildren`). */
    ELEMENT_WITH_CHILDREN = 4,
    /** Fragment component. */
    FRAGMENT = 5,
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
 * This interface defines various global DOM attributes that are valid for all DOM components/HTML
 * elements.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes
 * @todo Extend with more global DOM attributes.
 */
export interface IGlobalDOMAttributes {
    /**
     * Get/set `autocapitalize` attribute value of the component.
     */
    AutoCapitalize: AutoCapitalizeAttrValues;

    /**
     * Set 'autocapitalize' attribute value of the component.
     * @param v The value to be set.
     * @returns This instance.
     */
    autoCapitalize(v: AutoCapitalizeAttrValues): this;

    /**
     * Get/set `autofocus` attribute value of the component.
     */
    Autofocus: boolean;

    /**
     * Set 'autofocus' attribute value of the component.
     * @param v The value to be set.
     * @returns This instance.
     */
    autofocus(v: boolean): this;

    /**
     * Get/set `contentEditable` attribute value of the component. Setting `false` or an empty
     * string will remove the attribute.
     */
    ContentEditable: ContentEditableAttrValues;

    /**
     * Set `contentEditable` attribute value of the component.
     * @param v The value to be set. `false` or an empty string will remove the attribute.
     * @returns This instance.
     */
    contentEditable(v: ContentEditableAttrValues): this;

    /**
     * Get/set `class` attribute value of the component. Setting `null` or an empty string will
     * remove the attribute, getting `null` indicates, that the attribute doesn't exist.
     */
    Clazz: NullableString;

    /**
     * Set `class` attribute value of the component.
     * @param v The value to be set. `null` or an empty string will remove the attribute.
     * @returns This instance.
     */
    clazz(v: NullableString): this;

    /**
     * Get/set `dir` attribute value of the component. Setting `null` or an empty string will remove
     * the attribute, getting `null` indicates, that the attribute doesn't exist or is empty.
     */
    Dir: DirAttrValues;

    /**
     * Set `dir` attribute value of the component.
     * @param v The value to be set. `null` or an empty string will remove the attribute.
     * @returns This instance.
     */
    dir(v: DirAttrValues): this;

    /**
     * Get/set `draggable` attribute value of the component.
     */
    Draggable: boolean;

    /**
     * Set `draggable` attribute value of the component.
     * @param v The value to be set. `false` will remove the attribute.
     * @returns This instance.
     */
    draggable(v: boolean): this;

    /**
     * Get/set `enterKeyHint` attribute value of the component. Setting `null` will remove the
     * attribute, getting `null` indicates, that the attribute doesn't exist.
     */
    EnterKeyHint: EnterKeyHintAttrValues;

    /**
     * Set `enterKeyHint` attribute value of the component.
     * @param v The value to be set.
     * @returns This instance.
     */
    enterKeyHint(v: EnterKeyHintAttrValues): this;

    /**
     * Get/set `id` attribute value of the component. Setting `null` or an empty string will remove
     * the attribute, getting `null` indicates, that the attribute doesn't exist.
     */
    ID: NullableString;

    /**
     * Set `id` attribute value of the component.
     * @param v The value to be set. `null` or an empty string will remove the attribute
     * @returns This instance.
     */
    id(v: NullableString): this;

    /**
     * Get/set inert attribute value of the component.
     */
    Inert: boolean;

    /**
     * Set `inert` attribute value of the component.
     * @param v The `inert` value to be set.
     * @returns This instance.
     */
    inert(v: boolean): this;

    /**
     * Get/set `inputMode` attribute value of the component. Setting `null` or an empty string will
     * remove the attribute, getting `null` indicates, that the attribute doesn't exist.
     */
    InputMode: InputModeAttrValues;

    /**
     * Set `inputMode` attribute value of the component.
     * @param v The value to be set. `null` will remove the attribute.
     * @returns This instance.
     */
    inputMode(v: InputModeAttrValues): this;

    /**
     * Get/set `lang` attribute value of the component. Setting `null` or an empty string will
     * remove the attribute, getting `null` indicates, that the attribute doesn't exist.
     */
    Lang: NullableString;

    /**
     * Set `lang` attribute value of the component.
     * @param v The value to be set. `null` or an empty string will remove the attribute.
     * @returns This instance.
     */
    lang(v: NullableString): this;

    /**
     * Get/set `nonce` attribute value of the component.
     */
    Nonce: string | undefined;

    /**
     * Set `nonce` attribute value of the component.
     * @param v The value to be set.
     * @returns This instance.
     */
    nonce(v: string | undefined): this;

    /**
     * Get/set `popover` attribute value of the component.
     */
    Popover: PopoverAttrValues;

    /**
     * Set `popover` attribute value of the component.
     * @param v The value to be set.
     * @returns This instance.
     */
    popover(v: PopoverAttrValues): this;

    /**
     * Get/set the ability to be resized of the component.\
     * __Note:__ _This is not a DOM attribute property!_ Instead it is a CSS property that is
     * available on almost all HTML elements so it is made available here as a pseudo DOM property
     * just for convenience. Please also note the requirements explained in the `@see` comment.\
     * The value `false` means that the CSS `resize` property on the component has no explicit value
     * set, this is valid for both reading and writing the property. For `textarea` elements this
     * usually means that the element _is_ resizable by default so `none` has to be used explicitly.
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/resize
     */
    Resizable: ResizableValues;

    /**
     * Set the ability to be resized of the component.\
     * __Note:__ _This is not a DOM attribute property!_ Instead it is a CSS property that is
     * available on almost all HTML elements so it is made available here as a pseudo DOM property
     * just for convenience. Please also note the requirements explained in the `@see` comment.
     * @param v The value to be set. The value `false` means that the CSS `resize` property on the
     * component has no explicit value set. For `textarea` elements this usually means that the
     * element _is_ resizable by default so `none` has to be used explicitly.
     * @returns This instance.
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/resize
     */
    resizable(v: ResizableValues): this;

    /**
     * Get/set `spellcheck` attribute value of the component.\
     * __Note:__ The default value for spellchecking depends on the element type and the
     * implementation in browsers, so in order to be sure that spellchecking is disabled it has to
     * be explicitly disabled by setting this property to `false`.
     */
    Spellcheck: boolean;

    /**
     * Set `spellcheck` attribute value of the component.\
     * __Note:__ The default value for spellchecking depends on the element type and the
     * implementation in browsers, so in order to be sure that spellchecking is disabled it has to
     * be explicitly disabled by setting this property to `false`.
     * @param v The value to be set. `true` enables spellchecking, `false` disables it (the
     * attribute will explicitly be set to "false").
     * @returns This instance.
     */
    spellcheck(v: boolean): this;

    /**
     * Get/set `tabIndex` attribute value of the component.
     */
    TabIndex: number;

    /**
     * Set `tabIndex` attribute value of the component.
     * @param v The value to be set. `null` is equivalent to `0` but the attribute will also be
     * removed, reading the attribute will always return a number.
     * @returns This instance.
     */
    tabIndex(v: NullableNumber): this;

    /**
     * Get/set `title` attribute value of the component. Setting `null` or an empty string will
     * remove the attribute, getting `null` indicates, that the attribute doesn't exist.
     */
    Title: NullableString;

    /**
     * Set `title` attribute value of the component.
     * @param title The value to be set. `null` or an empty string will remove the attribute.
     * @returns This instance.
     */
    title(title: NullableString): this;

    /**
     * Get/set `translate` attribute value of the component.
     */
    Translate: boolean;

    /**
     * Set `translate` attribute value of the component.
     * @param v The value to be set. `false` will remove the attribute.
     * @returns This instance.
     */
    translate(v: boolean): this;

    /**
     * Get/set `writingSuggestions` attribute value of the component.\
     * __Note:__ Writing suggestions usually are enabled by default in browsers, so they have to be
     * explicitly disabled by setting this property to `false`.
     */
    WritingSuggestions: boolean;

    /**
     * Set `writingSuggestions` attribute value of the component.\
     * __Note:__ Writing suggestions usually are enabled by default in browsers, so they have to be
     * explicitly disabled by setting this property to `false`.
     * @param v The value to be set. `true` enables writing suggestions, `false` disables it (the
     * attribute will explicitly be set to "false").
     * @returns This instance.
     */
    writingSuggestions(v: boolean): this;
}

/**
 * Interface that must be implemented by classes that enable the addition/removal of child
 * components. It is generally assumed that the DOM node of each child component is attached to or
 * removed from the outermost DOM element of the parent component, but this is not mandatory. It is
 * perfectly possible that child components are mounted anywhere in the component tree of the parent
 * component.
 * @see The comment for `clear()` on how this affects the implementation of this function.
 */
export interface IChildren {
    /**
     * The child components of this component, includes all children based on a node _or_ element.\
     * __Note:__ This must be a _copy_ of the (presumably internal) list of children to avoid
     * manipulation by the recipient.
     */
    readonly Children: INodeComponent<Node>[];

    /**
     * The child components of this component, _only_ includes children based on an element.\
     * __Note:__ This must be a _copy_ of the (presumably internal) list of element children to
     * avoid manipulation by the recipient.
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
     * instance of `IChildren`/`IFragment` or mounted to this instance.
     * @param components The components to append. To simplify use, each element of `components` may
     * be `undefined` or `null`. If `components` contains multiple occurences of the same component,
     * only the first occurence will be handled.
     * @returns This instance.
     */
    append(...components: (INodeComponent<Node> | undefined | null)[]): this;

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
     * __Note:__ If `at` is a component and at the same time an element of `components` an exception
     * will be thrown.
     * @param at The target index in this instance.:
     * - If `at` is lower than 0 it is considered to be 0. If `at` is greater than or equal to the
     *   length of this collection the given components will be appended.
     * - If `at` is a component and does not belong to the children of this instance, nothing is
     *   inserted, otherwise the component will be inserted at the position of `at` within this
     *   collection.
     * @param components The components to insert. To simplify use, each element of `components` may
     * be `undefined` or `null`. If `components` contains multiple occurences of the same component,
     * only the first occurence will be handled.
     * @throws `IChildren: <message>` if the component denoted by `at` is a child of
     * `components`.
     * @returns This instance.
     */
    insert(at: number | INodeComponent<Node>, ...components: (INodeComponent<Node> | undefined | null)[]): this;

    /**
     * Insert components of a fragment at at numeric index or the index of a component reference of
     * this component.  After appending the fragment no longer has children.
     * - Insert the components as child elements to this component and
     * - also insert the underlying Node/HTML Element of each component to the underlying HTML
     *   element of this component.
     * @param at The target index in this instance:
     * - If `at` is lower than 0 it is considered to be 0. If `at` is greater than or equal to the
     *   length of this collection the components of the given fragment will be appended.
     * - If `at` is a component and does not belong to the children of this instance, nothing is
     *   inserted, otherwise the components will be inserted at the position of `at` within this
     *   collection.
     * @param fragment The fragment to insert.
     * @returns This instance.
     */
    insertFragment(at: number | INodeComponent<Node>, fragment: IFragment): this;

    /**
     * Remove child components from this the component. Also removes the corresponding Nodes/HTML
     * elements from the DOM node of this component. Removed components must _not_ be disposed of.
     * @param components The components to remove. Any element of `components` that isn't a child of
     * this instance is ignored. To simplify use, each element of `components` may be `undefined`
     * or `null`. If the length of `components`is `0`, _all_ components are removed. If `components`
     * contains multiple occurences of the same component, only the first occurence will be handled.
     * @returns This instance.
     */
    remove(...components: (INodeComponent<Node> | undefined | null)[]): this;

    /**
     * Extract child components from this the component to an array. Also removes the corresponding
     * Nodes/HTML elements from the DOM node of this component.
     * @param to An array to which the extracted components will be pushed.
     * @param components The components to be extracted. Any element of `components` that isn't a
     * child of this instance is ignored. To simplify use, each element of `components` may be
     * `undefined` or `null`. If the length of `components` is `0`, _all_ children of this component
     * will be extracted and pushed to `to`. If `components` contains multiple occurences of the
     * same component, only the first occurence will be handled.
     * @returns This instance.
     */
    extract(to: INodeComponent<Node>[], ...components: (INodeComponent<Node> | undefined | null)[]): this;

    /**
     * Extracts and appends child components from this the instance to another `IChildren` instance.
     * @param target The target instance into which the components are to be inserted. If `target`
     * is this instance, an exception will be thrown.
     * @param components The components to be extracted and appended. Any element of `components`
     * that isn't a child of this instance is ignored. To simplify use, each element of `components`
     * may be `undefined` or `null`. If the length of `components` is `0`, _all_ children of this
     * component will be extracted and appended to `target`. If `components` contains multiple
     * occurences of the same component, only the first occurence will be handled.
     * @throws `IChildren: <message>` if `target` is `this`.
     * @returns This instance.
     */
    moveTo(target: IChildren, ...components: (INodeComponent<Node> | undefined | null)[]): this;

    /**
     * Extracts and inserts child components from this the instance into another `IChildren`
     * instance.
     * @param target The target instance into which the components are to be inserted. If `target`
     * is this instance, an exception will be thrown.
     * @param at The target index in the collection of `target`. If `at` is lower than 0 it is
     * considered to be 0. If `at` is greater or equal to `target.length` the given components will
     * be appended. If `at` is a component in `target` the components will be inserted at the
     * position of `at` in `target`. If `at` is not a child of `target` an exception will be thrown.
     * @param components The components to be moved. Any element of `components` that isn't a child
     * of this instance is ignored. To simplify use, each element of `components` may be `undefined`
     * or `null`. If the length of `components` is `0`, _all_ children of this component will be
     * extracted and inserted into `target`. If `components` contains multiple occurences of the
     * same component, only the first occurence will be handled.
     * @throws `IChildren: <message>` if `target` is `this` or if `at` isn't a child of `target`.
     * @returns This instance.
     */
    moveToAt(target: IChildren, at: number | INodeComponent<Node>, ...components: (INodeComponent<Node> | undefined | null)[]): this;

    /**
     * Removes _all_ child components from this component. Also removes the corresponding Nodes/HTML
     * elements from their parent HTML elements. The removed components _must_ also be disposed of.
     * In some cases, the entire component must be considered largely unusable after this process
     * (except for components that do not implement any functions other than the inclusion of
     * children, such as a `Div` component).\
     * __Important note:__ `clear()` is not only meant to handle its own children but any component
     * that may exist besides the children collection! If, for example, the parent component has a
     * separate/additional component tree besides the children collection, `clear()` must also
     * remove and dispose of every component of this separate/additional tree!
     * @returns This instance.
     */
    clear(): this;
}

/**
 * Type of phrase content for elements with phrasing content (single phrase like one string or a
 * span element (which may contain further phrases)).
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Content_categories#phrasing_content
 */
export type Phrase = string | INodeComponent<HTMLElementWithPhrasingContent | Text>;

/**
 * Type of phrase content for elements with phrasing content (multiple phrases like strings or a
 * span elements (which may contain further phrases) or any combination of strings and phrases).
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Content_categories#phrasing_content
 */
export type Phrases = Array<Phrase>;

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
     * @param pointer The pointer (string) to be set. Passing `undefined` 'clears' the pointer.
     * @see {@link IElementComponent.Pointer}
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
     *   "Function with access to 'this' and parameters:",
     *   this.Children.length,
     *   param1,
     *   param2
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
export interface INodeComponent<T extends Node, EventMap extends EventMapVoid = HTMLElementEventMap> extends IComponent {
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
    readonly Next: INodeComponent<Node> | undefined;

    /**
     * The previous sibling component of this component within the array of the `Children` of
     * `Parent`.
     */
    readonly Previous: INodeComponent<Node> | undefined;

    /**
     * An array of copies of all currently registered event listeners.
     */
    readonly Listeners: IEventListener[];

    /**
     * Determines if this component is contained in the component tree of another component (at any
     * depth).\
     * __Note:__ It may seem like an error that the type of `component` is only `IElementComponent`,
     * although this type does not implement the interface `IChildren`, but it is possible to
     * implement components that do not allow access to contained child elements, but still manage
     * their own component tree internally. Such components may have to 'patch' their internal tree
     * structure to maintain an uninterrupted chain of parent/child components.
     * @param component The component in whose tree the occurrence of this component is to be
     * searched for.
     * @returns `true`, if this component is contained in the component tree of `component` (at any
     * depth), otherwise `false`.
     */
    isContainedIn(component: IElementComponent<HTMLElement>): boolean;

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
     * Returns `true`, if the component/node is connected to a DOM document object, otherwise
     * `false`. Equivalent to the property `DOM.isConnected`.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Node/isConnected
     */
    readonly Connected: boolean;

    /**
     * Get/set the `textContent` of the underlying Node/HTML.\
     * _Important notes:_
     * - Reading `Text` could be expensive since the `textContent` properties of all child nodes
     *   have to be evaluated recursively and concatenated by the browser!
     * - The normal behaviour of setting `textContent` on a node/HTML element is that this destroys
     *   all existing child nodes. Setting `Text` should therefore be handled in a different way for
     *   components that rely on HTML child nodes! This can easily be done with `public override
     *   get Text(): NullableString ...` and leaving out the setter in an implementing class or
     *   through an implementation that protects the DOM nodes of child components. Additionally,
     *   `text(v: NullableString)` should be overridden so that it either clears the component
     *   before setting `textContent` or throws an exception or simply does nothing.
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
     *
     * Notes:
     * - If this function is overridden in subclasses, `super.onBeforeUnmount(parent)` must be
     *   called first!
     * - Implementations can/should use the `Connected` property in `onBeforeUnmount()` to avoid
     *   doing things that are not feasible for non-connected nodes/trees/sub-trees.
     */
    onBeforeUnmount(): void;

    /**
     * Called after this component has been removed from the `Children` of another component.
     *
     * Notes:
     * - If this function is overridden in subclasses, `super.onDidUnmount(parent)` must be called
     *   last!
     * - Implementations can/should use the `Connected` property in `onDidUnmount()` to avoid doing
     *   things that are not feasible for non-connected nodes/trees/sub-trees.
     */
    onDidUnmount(): void;

    /**
     * Called before adding this component to the `Children` of another component.
     *
     * Notes:
     * - If this function is overridden in subclasses, `super.onBeforeMount(parent)` must be called
     *   first!
     * - Implementations can/should use the `Connected` property in `onBeforeMount()` to avoid doing
     *   things that are not feasible for non-connected nodes/trees/sub-trees.
     * @param parent The parent component or fragment to which this component will be added.
     */
    onBeforeMount(parent: IElementWithChildrenComponent<HTMLElementWithChildren>): void;

    /**
     * Called after this component has been added to the `Children` of another component.
     *
     * __Notes:__
     * - If this function is overridden in subclasses, `super.onDidMount(parent)` must be called
     *   last!
     * - Implementations can/should use the `Connected` property in `onDidMount()` to avoid doing
     *   things that are not feasible for non-connected nodes/trees/sub-trees.
     * @param parent The parent component or fragment to which this component has been added.
     */
    onDidMount(parent: IElementWithChildrenComponent<HTMLElementWithChildren>): void;

    /**
     * Dispatches an event to all registered listeners. Shorthand for `this._dom.dispatch()`.\
     * __Note__: This function always returns `this` so even if `event` is cancelable there is no
     * way to detect, if `event` was canceled. For detecting canceled events use `dispatch()`
     * instead.
     * @param event The event to emit/dispatch.
     * @returns This instance.
     */
    emit(event: Event): this;

    /**
     * Dispatches an event to all registered listeners. Shorthand for `this._dom.dispatch()`.\
     * __Note__: This function returns the result of `this._dom.dispatch()`. If the result of
     * dispatching the event is of no interest `emit()` can be used instead.
     * @param event The event to emit/dispatch.
     * @returns `false`, if the event was canceled, otherwise `true`.
     */
    dispatch(event: Event): boolean;

    /**
     * Add an event listener to this component. This function must work identical to the
     * `addEventListener` function. The listener is added to the `DOM` property of `this`.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
     * @param type Event type (click, blur etc.).
     * @param listener Listener function.
     * @param options Event listener options.
     * @returns This instance.
     */
    on<K extends keyof EventMap>(type: K, listener: (this: T, ev: EventMap[K]) => AnyType, options?: boolean | AddEventListenerOptions): this;

    /**
     * Add an event listener to this component that is invoked at most once after being added. This
     * function must work identical to the regular `addEventListener` function. The listener is
     * added to the `DOM` property of `this` and automatically removed when invoked.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
     * @param type Event type (click, blur etc.).
     * @param listener Listener function.
     * @param options Event listener options. In implementations, if `options` is a boolean value it
     * must be replaced with `{capture: options, once: true}`, if `options` is an object or
     * `undefined` or `null`, it must be replaced with `{...options, once: true}`.\
     * __Note:__ Listeners added with `once` are ignored by `allEvents()`, it is also impossible to
     * turn off, suspend or resume such listeners.
     * @returns This instance.
     */
    once<K extends keyof EventMap>(type: K, listener: (this: T, ev: EventMap[K]) => AnyType, options?: boolean | AddEventListenerOptions): this;

    /**
     * Remove an event listener from this component. This function must work identical to the
     * regular `removeEventListener` function. The listener is removed from the `DOM` property of
     * `this`.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener
     * @param type Event type (click, blur etc.).
     * @param listener Listener function.
     * @param options Event listener options.
     * @returns This instance.
     */
    off<K extends keyof EventMap>(type: K, listener: (this: T, ev: EventMap[K]) => AnyType, options?: boolean | AddEventListenerOptions): this;

    /**
     * Suspends an event listener if it can be found in the internal list of listeners _and_ if it
     * isn't already suspended. This is different from simply using `off()` and then `on()` again
     * with the listener because the execution order of installed listeners is retained with using
     * `suspend()`/`resume()`.
     * @param type Event type (click, blur etc.).
     * @param listener Listener function.
     * @param options Event listener options.
     * @returns This instance.
     */
    suspend<K extends keyof EventMap>(type: K, listener: (this: T, ev: EventMap[K]) => AnyType, options?: boolean | AddEventListenerOptions): this;

    /**
     * Resumes an event listener if it can be found in the internal list of listeners _and_ if it is
     * suspended. This is different from simply using `off()` and then `on()` again with the
     * listener because the execution order of installed listeners is retained with using
     * `suspend()`/`resume()`.
     * @param type Event type (click, blur etc.).
     * @param listener Listener function.
     * @param options Event listener options.
     * @returns This instance.
     */
    resume<K extends keyof EventMap>(type: K, listener: (this: T, ev: EventMap[K]) => AnyType, options?: boolean | AddEventListenerOptions): this;

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
 * Base interface for HTML element based components.
 */
export interface IElementComponent<T extends HTMLElement, EventMap extends EventMapVoid = HTMLElementEventMap> extends INodeComponent<T, EventMap>, IGlobalDOMAttributes {
    /**
     * The default CSS class name of the underlying HTML element. A common convention for CSS class
     * names is Kepab case, e.g. for the class `PersonInfoCard` the default CSS class name could be
     * `person-info-card`.\
     * __Note:__ This is an informative property that is ideally derived from the class name of the
     * component. The value _can_ be used to set a default CSS class name in the constructor (or
     * elsewhere), but it _should not be set automatically_! Setting class names automatically is a
     * use case for component factories.
     */
    readonly DefaultCSSClassName: string;

    /**
     * Add class name(s) to the class list of the underlying HTML element. All elements of `classes`
     * that are `null` or `undefined` are ignored. All class names are trimmed and if a trimmed
     * class name is an empty string, it will be ignored.
     * @param classes The name of the class(es) to be added.
     * @returns This instance.
     */
    addClass(...classes: (string | null | undefined)[]): this;

    /**
     * Remove class name(s) from the class list of the underlying HTML element. All elements of
     * `classes` that are `null` or `undefined` are ignored. All class names are trimmed and if a
     * trimmed class name is an empty string, it will be ignored.
     * @param classes The name of the class(es) to be removed.
     * @returns This instance.
     */
    removeClass(...classes: (string | null | undefined)[]): this;

    /**
     * Replaces a class name in the class list of the underlying HTML element with another class
     * name. If `clazz` or `withClass` (or both) is `null` or `undefined`, the function does
     * nothing. Both class names are trimmed and if at least one of the trimmed class names is an
     * empty string, the function does nothing.
     * @param clazz The name of the class to be replaced.
     * @param withClass The name of the class, that replaces the former class name.
     * @returns This instance.
     */
    replaceClass(clazz: string | null | undefined, withClass: string | null | undefined): this;

    /**
     * Toggles class name(s) in the class list of the underlying HTML element. All elements of
     * `classes` that are `null` or `undefined` are ignored. All class names are trimmed and if a
     * trimmed class name is an empty string, it will be ignored.
     * @param classes The name of the class(es) to be toggled.
     * @returns This instance.
     */
    toggleClass(...classes: (string | null | undefined)[]): this;

    /**
     * Checks, if the class name(s) is/are contained in the class list of the underlying HTML
     * element. All elements of `classes` that are `null` or `undefined` are ignored. All class
     * names are trimmed and if a trimmed class name is an empty string, it will be ignored.
     * @param classes The name of the class(es) to be searched for.
     * @returns `true` if _all_ of the class names specified in `...classes` are contained in the
     * class list of the underlying HTML file, otherwise `false`. `false` is also returned, if the
     * evaluation of `classes` (see above) returns an empty array.
     */
    hasClass(...classes: (string | null | undefined)[]): boolean;

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
     * Add/set/remove a 'boolean' attribute of the underlying HTML element.
     * @param name The name of the attribute.
     * @param value The value of the attribute. If value is `null` or `false`, the attribute will be
     * removed from the element. If `value` is true, technically the value of the attribute will be
     * set to an empty string which results in an attribute that shows no `="..."` part in the DOM
     * inspectors of browsers.
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
     * Check if the underlying HTML element has an attribute with a specific name.
     * @param name The name of the attribute.
     * @returns `true`, if the underlying HTML element has an attribute with the name `name`,
     * otherwise false.
     */
    hasAttrib(name: string): boolean;

    /**
     * Get the value of a `data-*` attribute of the underlying HTML element.
     * @param name The name of the `data-*` attribute. `name` is the part that comes after the
     * prefix `data-` of the attributes name so calling `Data("id")` will return the value of an
     * attribute with the name `data-id`. `name` will always be converted to lowercase before
     * getting the attribute value so calling `Data("Id")` yields the same result as `Data("id")`.
     * @returns The string value of an attribute with the name `data-<lowercase-name>` or `null` if
     * no attribute with this name exists on the underlying HTML element. An empty string indicates
     * that the attribute is a 'boolean' attribute.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*
     */
    Data(name: string): NullableString;

    /**
     * Sets the value of a `data-*` attribute of the underlying HTML element or removes the
     * attribute.
     * @param name The name of the `data-*` attribute. `name` is the part that comes after the
     * prefix `data-` of the attributes name so calling `data("id", "123")` will set the attribute
     * `data-id` to the value `123`. `name` will always be converted to lowercase before setting the
     * attribute value so calling `data("Id", "123")` yields the same result as `data("id", "123")`.
     * @param value The value to be set for the attribute. If `value` is `null`, the attribute will
     * be removed from the underlying HTML element. If `value` is an empty string a 'boolean'
     * attribute with the implicit value `true` is created, see also the function `attribB()`.
     * @returns This instance.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/data-*
     */
    data(name: string, value: NullableString): this;

    /**
     * Getter/setter for the appearance and behavior of a component in relation to an
     * activated/deactivated state.
     *
     * Notes:
     * - Not all HTML elements support `disabled` natively (so far only `button`, `input`, `select`,
     *   `textarea`, `fieldset`, `optgroup` and `option`) so for all other elements this state has
     *   to be faked by CSS or other means.
     * - If a component has children, setting `Disabled` to `true` on it must also propagate some
     *   sort of a faked 'Disabled === true' state to _all child components_. The same applies in
     *   the opposite case: setting `Disabled` to `false` again on the component must also handle
     *   the 'Disabled' state in the complete sub-tree in a way, that retains their 'real'
     *   `Disabled` state for components at any nested level in the sub-tree recursively.
     *   To support this, any component must implement the property `ParentDisabled` and the
     *   function `parentDisabled()` accordingly (for both see below).
     * - To determine whether a component is actually in a disabled state, the expression
     *   `Disabled === true || ParentDisabled === true` must be used, as `Disabled` alone only
     *   represents the isolated state of the component, without its state in relation to the outer
     *   component tree.
     */
    Disabled: boolean;

    /**
     * Set the appearance and behavior of a component in relation to an activated/deactivated state.
     * @param disabled `true` to disable the component, `false` to enable it.
     * @see {@link IElementComponent.Disabled}
     * @returns This instance.
     */
    disabled(disabled: boolean): this;

    /**
     * Get the state of `ParentDisabled` of this component. The return value is `true` only if the
     * component is a child of a component tree where at least one component in the upper tree
     * hierarchy explicitly has been disabled with `Disabled === true` or `disabled(true)`.
     */
    readonly ParentDisabled: boolean;

    /**
     * If a component has children, this function must be called inside the implementation of the
     * components function `disable()` on all child components, it must never be called manually
     * by users of components! When iterating over the children, any child that already has been
     * disabled explicitly with `Disabled === true` must be ignored as it is itself responsible for
     * maintaing the correct state of `Disabled` and `ParentDisabled`.
     * @param disabled `true`, if a component up in the component hierarchy has been explicitly set
     * to `Disabled === true` and `false` in the opposite case.
     * @returns This instance.
     */
    parentDisabled(disabled: boolean): this;

    /**
     * Get/set the visibility state of the underlying HTML element.
     * @see {@link visible()}
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
     * @see {@link hidden()}
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
     * @param ruleName The CSS style rule name (camelCase name e.g. `backgroundColor`).
     * @param value The style value to be set. If `value` is `null`, the style rule will be removed
     * from the underlying HTML element. In this case `important` is ignored.
     * @param important If true, the style priority will be set to `!important`.
     */
    style(ruleName: CSSRuleNames, value: NullableString, important?: boolean): this;

    /**
     * Sets the focus to the DOM element of this component.\
     * __Note:__ For many components, especially components with nested components, this must be
     * overridden in order to focus the desired DOM element.
     * @param options Options for focusing.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus
     * @returns This instance.
     */
    focus(options?: FocusOptions): this;

    /**
     * Removes the focus from this component.\
     * __Note:__ For many components, especially components with nested components, this must be
     * overridden in order to remove the focus from the desired DOM element.
     * @returns This instance.
     */
    blur(): this;
}

/**
 * Base interface for HTML element based components, that *do not allow* adding children.
 */
export interface IElementVoidComponent<T extends HTMLElementVoid, EventMap extends EventMapVoid = HTMLElementEventMap> extends IElementComponent<T, EventMap> { }

/**
 * Base interface for HTML element based components, that *do allow* adding children.
 */
export interface IElementWithChildrenComponent<T extends HTMLElementWithChildren, EventMap extends EventMapVoid = HTMLElementEventMap> extends IElementComponent<T, EventMap>, IChildren {
    /**
     * Set phrasing content of the component. This is a pure convenience setter which allows to
     * add/replace phrasing content in an easy way without having to resort to `clear()` +
     * `append()`. This setter is primarly intended to be used with components like `Span`, `P` or
     * similar.
     *
     * __Notes:__
     * - __Setting phrasing content must remove _and dispose of (!)_ all current children of the
     *   component and append the new phrasing content.__
     * - __Setting phrasing content with `Phrase` is therefore always a destroying operation!__
     * - A getter must not be implemented because the type of `Phrase` is `Phrase | Phrases`, but
     *   some components also allow adding flow content (e.g. `<div>`) and in such cases
     *   `Phrase | Phrases` would not fit as a return type. _Currently all implementing classes
     *   throw an error if `Phrase` is accessed as a getter!_
     * - If the length of `phrase` is greater than `1` then for any element of `phrase` that is of
     *   type `string`, an instance of a class that implements `INodeComponent<Text>` must be
     *   created with this string, so even pure text elements of `Children` are 'real' components.
     * - If the length of `phrase` is `1` and the element in `phrase` is of type `string` the setter
     *   _must not_ create an instance of a class that implements `INodeComponent<Text>` from the
     *   string but instead set `textContent` to the string. This is done for speed reasons and
     *   based on the assumption that a single string does not require its own component (setting a
     *   dedicated single instance of `INodeComponent<Text>` remains of course possible).
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Content_categories#phrasing_content
     * @example
     * ```typescript
     * import { Em, Span, Text } from "@vanilla-ts/dom";
     *
     * const span = new Span();
     *
     * // ANY CONTENT SET WITH `Phrase` BEFORE WILL BE DISPOSED OF BY ALL OF THE FOLLOWING
     * // REASSIGNMENTS OF `Phrase`!!!
     *
     * // This only sets `textContent` to 'Hello World!'.
     * span.Phrase = "Hello world!";
     * // This replaces all children/`textContent` with an instance of an `Em` component.
     * span.Phrase = new Em("Hello world!");
     * // This replaces all children/`textContent` with `INodeComponent<Text>`/`Em` components.
     * span.Phrase = ["Hello ", new Em("world"), "!"];
     * // Setting a dedicated single `Text` _component_ is also possible (instead of `string`).
     * span.Phrase = new Text("Hello world!");
     * ```
     */
    set Phrase(phrase: Phrase | Phrases);
    get Phrase(): never; // eslint-disable-line jsdoc/require-jsdoc

    /**
     * This is the same as `Phrase` except that it _does not destroy_ phrasing content that is
     * already contained in the component. An implementation _must first remove all contained
     * components without further touching them_ before adding new components so users of `Rephrase`
     * must therefore manage/clear/dispose of the removed components themselves!
     * @see {@link Phrase}
     */
    set Rephrase(phrase: Phrase | Phrases);
    get Rephrase(): never; // eslint-disable-line jsdoc/require-jsdoc

    /**
     * Set phrasing content of the component. This is a pure convenience function which allows to
     * add/replace phrasing content in an easy way without having to resort to `clear()` +
     * `append()`. This function is primarly intended to be used with components like `Span`, `P` or
     * similar.
     *
     * __Notes:__
     * - __Setting phrasing content must remove _and dispose of(!)_ all current children of the
     *   component and append the new phrasing content.__
     * - __Setting phrasing content with `Phrase` is therefore always a destroying operation!__
     * - If the length of `phrase` is greater than `1` then for any element of `phrase` that is of
     *   type `string`, an instance of a class that implements `INodeComponent<Text>` must be
     *   created with this string, so even pure text elements of `Children` are 'real' components.
     * - If the length of `phrase` is `1` and the element in `phrase` is of type `string` the
     *   function _must not_ create an instance of a class that implements `INodeComponent<Text>`
     *   from the string but instead set `textContent` to the string. This is done for speed reasons
     *   and based on the assumption that a single string does not require its own component
     *   (setting a dedicated single instance of `INodeComponent<Text>` remains of course possible).
     * @param phrase The phrasing content to be set as the new content for the component.
     * @returns This instance.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Content_categories#phrasing_content
     * @example
     * ```typescript
     * import { Em, Span } from "@vanilla-ts/dom";
     * // The following 3 code lines all do not not create a `INodeComponent<Text>` but instead set
     * // `textContent` to 'Hello World!'.
     * const span = new Span("Hello world!");
     *
     * // ANY CONTENT SET WITH `phrase()` BEFORE WILL BE DISPOSED OF BY ALL OF THE FOLLOWING
     * // CALLS OF `phrase()`!!!
     *
     * const span = new Span().phrase("Hello world!");
     * // The initial `textContent` 'Foo' is replaced with 'Hello World!' (also `textContent`).
     * const span = new Span("Foo").phrase("Hello world!");
     *
     * // The following 3 code lines all append _components_ build from the given parameters
     * // (`INodeComponent<Text>` components/`Em` component).
     * const span = new Span("Hello ", new Em("world"), "!");
     * const span = new Span().phrase("Hello ", new Em("world"), "!");
     * // The initial `textContent` 'Foo' is replaced with components build from the given
     * // parameters (`INodeComponent<Text>`/`Em`).
     * const span = new Span("Foo").phrase("Hello ", new Em("world"), "!");
     * ```
     */
    phrase(...phrase: Phrases): this;

    /**
     * This is the same as `phrase()` except that it _does not destroy_ phrasing content that is
     * already contained in the component. An implementation _must first remove all contained
     * components without further touching them_ before adding new components so users of `Rephrase`
     * must therefore manage/clear/dispose of the removed components themselves!
     * @see {@link Phrase}
     */
    rephrase(...phrase: Phrases): this;
}

/**
 * Union interface for all _HTML element_ based components.
 */
export type IIsElementComponent = /*INodeComponent<Node> &*/ (IElementVoidComponent<HTMLElementVoid> | IElementWithChildrenComponent<HTMLElementWithChildren>);

/**
 * Base interface for a fragment component, similar to the HTML `DocumentFragment` element. The main
 * purpose is to add components contained in this fragment component in bulk to instances of
 * `IElementWithChildrenComponent`.\
 * Another creative use is, for example, as a 'dustbin' for components that are no longer required
 * and can be destroyed at the same time. Such a task can be completed with a single instruction
 * (see also the `append()` function):
 * @example
 * ```typescript
 * new FragmentComponent()
 *   .append(
 *     someComponent,
 *     anotherComponent,
 *     ...moreComponents
 * ).clear().dispose();
 * ```
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
     * The child components of this fragment component, includes all children based on a node or
     * element.
     */
    Children: INodeComponent<Node>[];

    /**
     * The child components of this fragment component, includes only children based on an element.
     */
    ElementChildren: IIsElementComponent[];

    /**
     * Append child components.
     * - Append the components as child elements to this fragment component.
     * - Also append the underlying Node/HTML Element of each component to the `DocumentFragment`
     *   element of this fragment component.
     *
     * There are no restrictions for child components, they can be newly created, mounted to another
     * instance of `IFragment`/`IChildren` or mounted to this instance.
     * @param components The components to append. To simplify use, each element of `components` may
     * be `undefined` or `null`. If `components` contains multiple occurences of the same component,
     * only the first occurence will be handled.
     * @returns This instance.
     */
    append(...components: (INodeComponent<Node> | undefined | null)[]): this;

    /**
     * Remove child components from this the fragment component. Also removes the corresponding
     * Nodes/HTML elements from the `DocumentFragment` element of this fragment component.
     * @param components The components to remove. Any element of `components` that isn't a child of
     * this instance is ignored. To simplify use, each element of `components` may be `undefined` or
     * `null`. If the length of `components`is `0`, _all_ components are removed. If `components`
     * contains multiple occurences of the same component, only the first occurence will be handled.
     * @returns This instance.
     */
    remove(...components: (INodeComponent<Node> | undefined | null)[]): this;

    /**
     * Extract child components from this the fragment component to an array. Also removes the
     * corresponding Nodes/HTML elements from the `DocumentFragment` element of this fragment
     * component.
     * @param to An array to which the extracted components will be pushed.
     * @param components The components to remove. Any element of `components` that isn't a child of
     * this instance is ignored. To simplify use, each element of `components` may be `undefined` or
     * `null`. If the length of `components`is `0`, _all_ components are removed. If `components`
     * contains multiple occurences of the same component, only the first occurence will be handled.
     * @returns This instance.
     */
    extract(to: INodeComponent<Node>[], ...components: (INodeComponent<Node> | undefined | null)[]): this;

    /**
     * Get and remove all children of this fragment component. As a result the fragment component no
     * longer holds child components.
     * @returns An object that contains an array with all child components of the fragment component
     * and a pure HTML document fragment component that contains the DOM elements of all child
     * components.
     */
    release(): { Fragment: DocumentFragment; Children: INodeComponent<Node>[]; }; // eslint-disable-line jsdoc/require-jsdoc

    /**
     * Removes _and disposes of(!)_ all children of this fragment component.
     * @returns This instance.
     */
    clear(): this;
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

/**
 * An event bus event. Passed to the functions `on()` and `once()` as the second parameter.
 */
export interface EventBusEvent {
    /** `true`, if the event was canceled by a preceding listener, otherwise `false`. */
    readonly Canceled: boolean;
    /** Cancels the event, for further listeners the member `Canceled` will be `true`. */
    cancel(): void;
    /** Stops propagating the event to further listeners. */
    stopPropagation(): void;
}

/**
 * Interface for an event bus.
 */
export interface IEventBus<EventMap extends Record<keyof EventMap, AnyType>> {
    /**
     * Get the name of this event bus instance.
     */
    readonly Name: string;

    /**
     * An array of copies of all currently registered event listeners of this event bus.
     */
    readonly Listeners: IEventListener[];

    /**
     * Dispatches an event with event data to all registered listeners.
     * @param type Event type.
     * @param eventData The event data to dispatch. This parameter can be omitted only for events
     * whose data type has been set to `undefined` or `null` in the event map, for all other event
     * types it's mandatory!
     * @returns This instance.
     */
    emit<K extends keyof EventMap>(type: K, eventData?: EventMap[K]): this;

    /**
     * Dispatches an event with event data to all registered listeners.
     * @param type Event type.
     * @param eventData The event data to dispatch. This parameter can be omitted only for events
     * whose data type has been set to `undefined` or `null` in the event map, for all other event
     * types it's mandatory!
     * @param cancelable `true`, if the event can be canceled by listeners, otherwise `false`.
     * The default value is always `false`.
     * @returns `false`, if the event was canceled, otherwise `true`.
     * @see {@link IEventBus.on()}
     */
    dispatch<K extends keyof EventMap>(type: K, eventData?: EventMap[K], cancelable?: boolean): boolean;

    /**
     * Add an event listener to this event bus.
     * @param type Event type.
     * @param listener Listener function. This function will be called with the event data from the
     * emitter as its first parameter. The second parameter is an object which allows to cancel the
     * event and also to stop its propagation to further listeners:
     * - `Canceled`: `true`, if the event has been canceled by a preceding listener, otherwise
     *   `false`.
     * - `cancel()`: This 'cancels' the event. Further listeners receiving the event can use the
     *   member `Canceled` to check if the event has been canceled by a preceding listener. The
     *   return value of `IEventBus.dispatch("type", data, true)` will be `false`, if any of the
     *   listeners has called `cancel()` on this object.
     * - `stopPropagation()`: Stops the propagation of the event to further listeners.
     *
     * Listener functions can omit the second parameter if it isn't needed.
     * @example
     * ```typescript
     * interface SomeEventMap {
     *   "test": "Cancel me!";
     *   "obj": {
     *     StringProp: string;
     *     BooleanProp: boolean;
     *   };
     *   "ComplexType": {
     *     "Prop1": string;
     *     "SubObj": {
     *       "Subrop": object;
     *     }
     *   }
     *   "MsgOnly": undefined;
     * }
     *
     * class EventBus extends AEventBus<SomeEventMap> { }
     * const eb = new EventBus("AppEventBus");
     *
     * const listener1 = (eventData: SomeEventMap["test"], event: EventBusEvent) => {
     *   console.log("listener1: Event data:", eventData, "Event:", event);
     *   // Cancel event.
     *   event.cancel();
     *   // Stop further propagation (`listener2` will never be called).
     *   event.stopPropagation();
     * };
     *
     * const listener2 = (eventData: SomeEventMap["test"], event: EventBusEvent) => {
     *   // By commenting out `event.stopPropagation();` in `listener1` this log message will appear on
     *   // the console and the `Canceled` memeber of `event` is `true`.
     *   console.log("listener2: Event data:", eventData, "Event:", event);
     * };
     *
     * eb.on("test", listener1);
     * eb.on("test", listener2);
     *
     * // Event is cancelable.
     * console.log("Executing 'dispatch(\"test\", \"Cancel me!\", true)' ...");
     * let canceled = !eb.dispatch("test", "Cancel me!", true);
     * console.log("dispatch(\"test\", \"Cancel me!\", true) returned:", canceled); // => true
     *
     * // Event is not cancelable (`false` is the default value and can be omitted).
     * console.log("Executing 'dispatch(\"test\", \"Cancel me!\", false)' ...");
     * canceled = !eb.dispatch("test", "Cancel me!", false);
     * console.log("dispatch(\"test\", \"Cancel me!\", false) returned:", canceled); // => false
     *
     * // Dispatch another event with `emit()`.
     * const listener3 = (eventData: SomeEventMap["obj"]) => {
     *   console.log("listener3: Event data:", eventData);
     * };
     * eb.once("obj", listener3);
     * eb.emit("obj", {
     *   StringProp: "Events can be any type of data.",
     *   BooleanProp: true
     * }); // => listener3: Event data: {StringProp: "Events can be any type of data.", BooleanProp: true}
     *
     * // Dispatching pure messages without any additional data is also possible. Please note that
     * // in such cases the event data passed to the listener function will always be `null`, even
     * // if the data type defined in the event map is `undefined`!
     * const listener4 = (eventData: SomeEventMap["MsgOnly"]) => {
     *   console.log("listener4: Event data:", eventData);
     * };
     * eb.on("MsgOnly", listener4);
     * eb.emit("MsgOnly"); // => listener4: Event data: null
     * ```
     * @returns This instance.
     */
    on<K extends keyof EventMap>(type: K, listener: (eventData: EventMap[K], event: EventBusEvent) => AnyType): this;

    /**
     * Add an event listener to this event bus that is invoked at most once after being added. The
     * listener is automatically inactive after its invocation.\
     * __Note:__ Listeners added with `once` are ignored by `allEvents()`, it is also impossible
     * to turn off, suspend or resume such listeners.
     * @param type Event type.
     * @param listener Listener function.
     * @returns This instance.
     * @see {@link IEventBus.on()}
     */
    once<K extends keyof EventMap>(type: K, listener: (eventData: EventMap[K], event: EventBusEvent) => AnyType): this;

    /**
     * Remove an event listener from this event bus.
     * @param type Event type.
     * @param listener Listener function.
     * @returns This instance.
     */
    off<K extends keyof EventMap>(type: K, listener: (eventData: EventMap[K], event: EventBusEvent) => AnyType): this;

    /**
     * Suspends an event listener if it can be found in the internal list of listeners _and_ if it
     * isn't already suspended. This is different from simply using `off()` and then `on()` again
     * with the listener because the execution order of installed listeners is retained with using
     * `suspend()`/`resume()`.
     * @param type Event type.
     * @param listener Listener function.
     * @returns This instance.
     */
    suspend<K extends keyof EventMap>(type: K, listener: (eventData: EventMap[K]) => AnyType): this;

    /**
     * Resumes an event listener if it can be found in the internal list of listeners _and_ if it is
     * suspended. This is different from simply using `off()` and then `on()` again with the
     * listener because the execution order of installed listeners is retained with using
     * `suspend()`/`resume()`.
     * @param type Event type (click, blur etc.).
     * @param listener Listener function.
     * @returns This instance.
     */
    resume<K extends keyof EventMap>(type: K, listener: (eventData: EventMap[K]) => AnyType): this;

    /**
     * Suspends or resumes the execution of _all currently_ registered event listeners on this event
     * bus or removes all listeners permanently from this event bus. `allEvents()` must ignore
     * listeners added with `once()`. If all listeners are suspended and then an additional listener
     * is added this listener will be active.
     * @param mode Can be one of `OFF`, `SUSPEND` or `RESUME`. `SUSPEND` and `RESUME` are used to
     * suspend or resume the listeners execution. All listeners will be kept on the event bus.
     * `OFF` instead will permanently remove alle registered listeners from event bus. There
     * is no way to restore these listeners (except they are held elesewhere and are re-registered
     * via `on()`).
     */
    allEvents(mode: ALL_EVENTS): this;

    /**
     * Disposes of the event bus. After that, the bus can no longer be used, calling any of it's
     * functions will result in a `TypeError` due to an undefined object.
     * @returns This instance.
     */
    dispose(): this;
}
