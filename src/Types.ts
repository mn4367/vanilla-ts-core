
/**
 * ESLint complains about `any` so it's declared here as an alias.
 */
export type AnyType = any; // eslint-disable-line @typescript-eslint/no-explicit-any

/**
 * The type of an arbitry object.
 */
export type AnyObject = Record<string, AnyType>;

/**
 * (Abstract) Constructor type (can be used as the type of a class).
 */
export type Constructor<T = AnyObject> = new (...args: AnyType[]) => T;
export type AConstructor<T = AnyObject> = abstract new (...args: AnyType[]) => T; // eslint-disable-line jsdoc/require-jsdoc
export type Ctor<T> = Constructor<T> | AConstructor<T>; // eslint-disable-line jsdoc/require-jsdoc

/**
 * Typed string for attribute values. 
 */
export type NullableString = string | null;

/**
 * Typed number for attribute values.
 */
export type NullableNumber = number | null;

/**
 * Typed boolean for attribute values. 
 */
export type NullableBoolean = boolean | null;

/**
 * HTML elements which do not allow adding child nodes (void elements).
 * @see https://html.spec.whatwg.org/multipage/syntax.html#void-elements
 */
export type HTMLElementVoid =
    HTMLAreaElement | HTMLBaseElement | HTMLBRElement | HTMLTableColElement | HTMLEmbedElement
    | HTMLHRElement | HTMLImageElement | HTMLInputElement | HTMLLinkElement | HTMLMetaElement
    | HTMLSourceElement | HTMLTrackElement;

/**
 * Tag names of void HTML elements.
 */
export type HTMLElementVoidTagName = "area" | "base" | "br" | "col" | "embed" | "hr"
    | "img" | "input" | "link" | "meta" | "source" | "track" | "wbr";

/**
 * HTML elements which can have child nodes.
 */
export type HTMLElementWithChildren =
    HTMLAnchorElement | HTMLAudioElement | HTMLQuoteElement | HTMLBodyElement | HTMLButtonElement
    | HTMLCanvasElement | HTMLTableCaptionElement | HTMLDataElement | HTMLDataListElement
    | HTMLModElement | HTMLDetailsElement | HTMLDivElement | HTMLDListElement | HTMLFieldSetElement
    | HTMLFormElement | HTMLHeadingElement | HTMLHeadElement | HTMLHtmlElement | HTMLIFrameElement
    | HTMLLabelElement | HTMLLegendElement | HTMLLIElement | HTMLMapElement | HTMLMenuElement
    | HTMLMeterElement | HTMLObjectElement | HTMLOListElement | HTMLOptGroupElement
    | HTMLOptionElement | HTMLOutputElement | HTMLParagraphElement | HTMLPictureElement
    | HTMLPreElement | HTMLProgressElement | HTMLScriptElement | HTMLSelectElement | HTMLSlotElement
    | HTMLSpanElement | HTMLStyleElement | HTMLTableElement | HTMLTableSectionElement
    | HTMLTemplateElement | HTMLTextAreaElement | HTMLTableCellElement | HTMLTimeElement
    | HTMLTitleElement | HTMLTableRowElement | HTMLUListElement | HTMLVideoElement;

/**
 * Tag names of HTML elements which can have child elements.
 */
export type HTMLElementWithChildrenTagName = Exclude<keyof HTMLElementTagNameMap, HTMLElementVoidTagName>;

/**
 * HTML elements which have a native `disabled` property (element types).
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled#overview
 */
export type HTMLElementWithDisabled =
    HTMLButtonElement | HTMLTextAreaElement | HTMLFieldSetElement | HTMLInputElement
    | HTMLOptGroupElement | HTMLOptionElement | HTMLSelectElement;

/**
 * HTML input types (attribute `type`).
 */
export type HTMLInputTypes = "button" | "checkbox" | "color" | "date" | "datetime-local" | "email"
    | "file" | "hidden" | "image" | "month" | "number" | "password" | "radio" | "range" | "reset"
    | "search" | "submit" | "tel" | "text" | "time" | "url" | "week";

/**
 * HTML elements which have a native `disabled` property (tag names).
 */
export const HTMLTagsWithNativeDisabled = [
    "BUTTON",
    "FIELDSET",
    "INPUT",
    "OPTGROUP",
    "OPTION",
    "SELECT",
    "TEXTAREA"
] as const;

/**
 * HTML elements which can have a `name` attribute.
 */
export type HTMLElementWithNameAttribute =
    HTMLButtonElement | HTMLFormElement | HTMLFieldSetElement | HTMLIFrameElement | HTMLInputElement
    | HTMLObjectElement | HTMLOutputElement | HTMLSelectElement | HTMLTextAreaElement
    | HTMLMapElement | HTMLMetaElement | HTMLParamElement;

/**
 * HTML elements which can have a `value` attribute (string).
 */
export type HTMLElementWithSValueAttribute =
    // Regular
    HTMLButtonElement | HTMLInputElement | HTMLOptionElement | HTMLParamElement
    // Additional
    | HTMLSelectElement;

/**
 * HTML elements which can have a `value` attribute (number).
 */
export type HTMLElementWithNValueAttribute = HTMLLIElement | HTMLMeterElement | HTMLProgressElement;

/**
 * HTML elements which can have a `required` attribute.
 */
export type HTMLElementWithRequiredAttribute = HTMLInputElement | HTMLSelectElement
    | HTMLTextAreaElement;

/**
 * HTML elements which can have a `readonly` attribute.
 */
export type HTMLElementWithReadonlyAttribute = HTMLInputElement | HTMLTextAreaElement;

/**
 * HTML elements which can have a numeric `width` and/or `height` attribute.\
 * _Note:_ `width` and/or `height` are only valid for the `image` input type (a graphical submit
 * button).
 */
export type HTMLElementWithNWidthHeightAttribute = HTMLCanvasElement | HTMLImageElement
    | HTMLInputElement | HTMLVideoElement;

/**
 * HTML elements which can have a string `width` and/or `height` attribute.
 */
export type HTMLElementWithSWidthHeightAttribute = HTMLObjectElement | HTMLEmbedElement
    | HTMLIFrameElement;

/**
 * HTML elements which can have a `src` attribute.
 * _Note:_ `src` is only valid for the `image` input type (a graphical submit button).
 */
export type HTMLElementWithSrcAttribute = HTMLAudioElement | HTMLEmbedElement | HTMLIFrameElement
    | HTMLImageElement | HTMLInputElement | HTMLScriptElement | HTMLSourceElement | HTMLTrackElement
    | HTMLVideoElement;

/**
 * HTML elements which can have an `alt` attribute.
 * _Note:_ `alt` is only valid for the `image` input type (a graphical submit button).
 */
export type HTMLElementWithAltAttribute = HTMLAreaElement | HTMLImageElement | HTMLInputElement;

/**
 * HTML elements which can have a `loading` attribute.
 */
export type HTMLElementWithLoadingAttribute = HTMLImageElement | HTMLIFrameElement;

/**
 * Possible values for the `loading` attribute. 
 */
export type LoadingAttributeValues = "lazy" | "eager";

/**
 * HTML input element types which can have a `placeholder` attribute.
 */
export type HTMLInputsWithPlaceholder = "text" | "search" | "url" | "tel" | "email" | "password"
    | "number";

/**
 * HTML input element types which can have a `minlength` and/or `maxlength` attribute.
 */
export type HTMLInputsWithMinMaxLength = "text" | "search" | "url" | "tel" | "email" | "password";

/**
 * HTML input element types which can have a `min` and/or `max` attribute.
 */
export type HTMLInputsWithMinMax = "date" | "month" | "week" | "time" | "datetime-local" | "number"
    | "range";

/**
 * HTML input element types which can have a `step` attribute.
 */
export type HTMLInputsWithStep = HTMLInputsWithMinMax;

/**
 * HTML input element types which can have a `list` attribute.
 */
export type HTMLInputsWithDataList = "text" | "search" | "url" | "tel" | "email" | "date" | "month"
    | "week" | "time" | "datetime-local" | "number" | "range" | "color";

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
 * For the following type (`UnionToIntersection`) and the `Mixin` functions below see:
 * @see https://stackoverflow.com/a/69172633
 * @see https://stackoverflow.com/a/50375286
 * @see https://www.typescriptlang.org/play?#code/PTAEGMCcFMBMEsAuBnUBzA9tViOgBaKIAOyAXCMogIbgDWGAbtJAGYA2GA7gHTgYBbYNWABWAAwBmAOyiATAA4AbAChQoRAE9i0UAFUAdvAwGAKhgCSBxC2TRwiYwYA8egHygAvGvWgAFHqg0AAeNgawqNQGmqAA-P50ZPoAlF4ejBjwsKBJBtDMkKkhYRH+Pr6giaDwBqwsoBbloKme6ZmwTfGNFbn5LADcKj5aOqAAwuzUyMim2rqeoHlc-jyr1JBo5KBRmgDaALotHjuD6j6sAK4GDk6gALLwwTXOpkGh0OGoE1MzcwA0oAASm8SqhTAc3H5VnxJtNAdBWFtdtDAYcyE0lis1hstjsDkd9EYTOYrDZIHYbiZnFYqFFwNBZjpnMjVqjdgYLgIAEYsfZuDwAbyaMEQF0gBlAAhYaGgfnAsNQAtAAF8AdD5T94YjkqcVUN1Jdro4TJLpbLYCx4MxYElvtNGdA1asNXCEVs7b8dPjQEKKi7kFrkDxWBhIABRWj4OUKrVpH1NdQAeS5ACt7IgeDLEImuAYAAqQDA6SBaABy1ClyGjmoRPGIhdwI2gyWDoYj4CjBgr80FCd8IFAmgwFwgUXQ0EQoEgWVAGFYGjmo6oNTQ1QliHw8FQXGomj76n4BiooAtyCg8GIuEgXlAybTDkzE5z+cLxa0ABFsOfL6Hq67WHWDYYE2AJdlKyT7tU85+GBugAISeAsADkh5UJAFwOKGSGgAAZDhJ5ftOP6FPGFRkbeqbpjwFqsDU0AFkWLBaH4kEVBa07WoBwHAf8rG+LBfx8eop7flefE6pByp9sqEkVDJgzChOYoSuxVpwLqUk+P6oAAGIYHgvq+CGGB+KkSpSeomkHgqoAAELrKRvhcuspk+nqln6hANn2QAXo56jOT5rmGX6JjIBg7DQDwnBoH4SGBUhsm+BZepaTZdyaB6IIfKUDxPAYfh6RgAL2ZAJXUD5ZmpQeYWTgIMQLJiGUeqZur1a2JmpAOGB0D47XOZArndb16j9RVrWgMNKhAA
 * The mixin pattern used here is based on this description:
 * @see https://www.typescriptlang.org/docs/handbook/mixins.html#alternative-pattern
 */
export type UnionToIntersection<U> =
    (U extends AnyType ? (k: U) => void : never) extends (
        k: infer I
    ) => void
    ? I
    : never;

/**
 * Extend an existing or create a new class with all properties merged from the given classes. This
 * function retains the type information from the classes to be merged.\
 * _Note:_ The order of the given classes has an impact on the properties of the new/extended class.
 * If multiple classes have properties with the same name, the property of the last of these
 * classes will override preceding properties with the same name.\
 * _Note:_ This is a flat mixin! Only the own properties of the given classes are merged, properties
 * of the prototype chain will be ignored!
 * @param toFirst If `toFirst` is `false`, constructors from the given classes won't be merged at
 * all, the returned class is a new class that only has a default constructor. If `toFirst` is
 * `true`, the _first_ given class will be extended with the properties of the rest of the classes,
 * except their constructors, the constructor from the first class will be retained.
 * @param classes The classes to be merged into a single new class.
 * @returns A (new) class with all properties merged from `classRefs`.
 */
export function mixin<T extends Ctor<unknown>, R extends T[]>(toFirst: boolean, ...classes: [...R]):
    new (...args: AnyType[]) => UnionToIntersection<InstanceType<[...R][number]>> {
    // @1
    return toFirst ? extend(classes[0], ...classes.slice(1)) : extend(class { }, ...classes); // eslint-disable-line jsdoc/require-jsdoc
}

/**
 * Extend a class with all properties from other classes (except the constructors).
 * @param clazz The class to be extended.
 * @param classes The classes to be merged into the class given by `class`:
 * @returns The extended class.
 */
export function extend<T>(clazz: Ctor<T>, ...classes: Ctor<T>[]) {
    classes.forEach(classRef => {
        Object.getOwnPropertyNames(classRef.prototype).forEach(name => {
            const descriptor = Object.getOwnPropertyDescriptor(classRef.prototype, name);
            if (descriptor && (name !== 'constructor')) {
                Object.defineProperty(
                    clazz.prototype,
                    name,
                    descriptor
                );
            }
        });
    });
    /**
     * Returning `clazz as Constructor<AnyType>` instead of `clazz` prevents
     * a compiler error in the line marked with // @1
     */
    return clazz as Constructor<AnyType>;
}

// #region CSS style rules
/**
 * Names of CSS style rules.
 */
export type CSSRuleNames =
    "align-content" |
    "align-items" |
    "align-self" |
    "alignment-baseline" |
    "all" |
    "animation" |
    "animation-delay" |
    "animation-direction" |
    "animation-duration" |
    "animation-fill-mode" |
    "animation-iteration-count" |
    "animation-name" |
    "animation-play-state" |
    "animation-timing-function" |
    "appearance" |
    "aspect-ratio" |
    "backface-visibility" |
    "background" |
    "background-attachment" |
    "background-blend-mode" |
    "background-clip" |
    "background-color" |
    "background-image" |
    "background-origin" |
    "background-position" |
    "background-position-x" |
    "background-position-y" |
    "background-repeat" |
    "background-size" |
    "baseline-shift" |
    "block-size" |
    "border" |
    "border-block" |
    "border-block-color" |
    "border-block-end" |
    "border-block-end-color" |
    "border-block-end-style" |
    "border-block-end-width" |
    "border-block-start" |
    "border-block-start-color" |
    "border-block-start-style" |
    "border-block-start-width" |
    "border-block-style" |
    "border-block-width" |
    "border-bottom" |
    "border-bottom-color" |
    "border-bottom-left-radius" |
    "border-bottom-right-radius" |
    "border-bottom-style" |
    "border-bottom-width" |
    "border-collapse" |
    "border-color" |
    "border-end-end-radius" |
    "border-end-start-radius" |
    "border-image" |
    "border-image-outset" |
    "border-image-repeat" |
    "border-image-slice" |
    "border-image-source" |
    "border-image-width" |
    "border-inline" |
    "border-inline-color" |
    "border-inline-end" |
    "border-inline-end-color" |
    "border-inline-end-style" |
    "border-inline-end-width" |
    "border-inline-start" |
    "border-inline-start-color" |
    "border-inline-start-style" |
    "border-inline-start-width" |
    "border-inline-style" |
    "border-inline-width" |
    "border-left" |
    "border-left-color" |
    "border-left-style" |
    "border-left-width" |
    "border-radius" |
    "border-right" |
    "border-right-color" |
    "border-right-style" |
    "border-right-width" |
    "border-spacing" |
    "border-start-end-radius" |
    "border-start-start-radius" |
    "border-style" |
    "border-top" |
    "border-top-color" |
    "border-top-left-radius" |
    "border-top-right-radius" |
    "border-top-style" |
    "border-top-width" |
    "border-width" |
    "bottom" |
    "box-shadow" |
    "box-sizing" |
    "break-after" |
    "break-before" |
    "break-inside" |
    "caption-side" |
    "caret-color" |
    "clear" |
    /** @deprecated */
    "clip" |
    "clip-path" |
    "clip-rule" |
    "color" |
    "color-interpolation" |
    "color-interpolation-filters" |
    "color-scheme" |
    "column-count" |
    "column-fill" |
    "column-gap" |
    "column-rule" |
    "column-rule-color" |
    "column-rule-style" |
    "column-rule-width" |
    "column-span" |
    "column-width" |
    "columns" |
    "contain" |
    "content" |
    "counter-increment" |
    "counter-reset" |
    "counter-set" |
    "css-float" |
    "css-text" |
    "cursor" |
    "direction" |
    "display" |
    "dominant-baseline" |
    "empty-cells" |
    "fill" |
    "fill-opacity" |
    "fill-rule" |
    "filter" |
    "flex" |
    "flex-basis" |
    "flex-direction" |
    "flex-flow" |
    "flex-grow" |
    "flex-shrink" |
    "flex-wrap" |
    "float" |
    "flood-color" |
    "flood-opacity" |
    "font" |
    "font-family" |
    "font-feature-settings" |
    "font-kerning" |
    "font-optical-sizing" |
    "font-size" |
    "font-size-adjust" |
    "font-stretch" |
    "font-style" |
    "font-synthesis" |
    "font-variant" |
    /** @deprecated */
    "font-variant-alternates" |
    "font-variant-caps" |
    "font-variant-east-asian" |
    "font-variant-ligatures" |
    "font-variant-numeric" |
    "font-variant-position" |
    "font-variation-settings" |
    "font-weight" |
    "gap" |
    "grid" |
    "grid-area" |
    "grid-auto-columns" |
    "grid-auto-flow" |
    "grid-auto-rows" |
    "grid-column" |
    "grid-column-end" |
    "grid-column-gap" |
    "grid-column-start" |
    "grid-gap" |
    "grid-row" |
    "grid-row-end" |
    "grid-row-gap" |
    "grid-row-start" |
    "grid-template" |
    "grid-template-areas" |
    "grid-template-columns" |
    "grid-template-rows" |
    "height" |
    "hyphens" |
    /** @deprecated */
    "image-orientation" |
    "image-rendering" |
    "inline-size" |
    "inset" |
    "inset-block" |
    "inset-block-end" |
    "inset-block-start" |
    "inset-inline" |
    "inset-inline-end" |
    "inset-inline-start" |
    "isolation" |
    "justify-content" |
    "justify-items" |
    "justify-self" |
    "left" |
    /* readonly length: number; */
    "letter-spacing" |
    "lighting-color" |
    "line-break" |
    "line-height" |
    "list-style" |
    "list-style-image" |
    "list-style-position" |
    "list-style-type" |
    "margin" |
    "margin-block" |
    "margin-block-end" |
    "margin-block-start" |
    "margin-bottom" |
    "margin-inline" |
    "margin-inline-end" |
    "margin-inline-start" |
    "margin-left" |
    "margin-right" |
    "margin-top" |
    "marker" |
    "marker-end" |
    "marker-mid" |
    "marker-start" |
    "mask" |
    "mask-type" |
    "max-block-size" |
    "max-height" |
    "max-inline-size" |
    "max-width" |
    "min-block-size" |
    "min-height" |
    "min-inline-size" |
    "min-width" |
    "mix-blend-mode" |
    "object-fit" |
    "object-position" |
    "offset" |
    "offset-anchor" |
    "offset-distance" |
    "offset-path" |
    "offset-rotate" |
    "opacity" |
    "order" |
    "orphans" |
    "outline" |
    "outline-color" |
    "outline-offset" |
    "outline-style" |
    "outline-width" |
    "overflow" |
    "overflow-anchor" |
    "overflow-wrap" |
    "overflow-x" |
    "overflow-y" |
    "overscroll-behavior" |
    "overscroll-behavior-block" |
    "overscroll-behavior-inline" |
    "overscroll-behavior-x" |
    "overscroll-behavior-y" |
    "padding" |
    "padding-block" |
    "padding-block-end" |
    "padding-block-start" |
    "padding-bottom" |
    "padding-inline" |
    "padding-inline-end" |
    "padding-inline-start" |
    "padding-left" |
    "padding-right" |
    "padding-top" |
    "page-break-after" |
    "page-break-before" |
    "page-break-inside" |
    "paint-order" |
    /* readonly parentRule: CSSRule | null; */
    "perspective" |
    "perspective-origin" |
    "place-content" |
    "place-items" |
    "place-self" |
    "pointer-events" |
    "position" |
    "quotes" |
    "resize" |
    "right" |
    "rotate" |
    "row-gap" |
    "ruby-position" |
    "scale" |
    "scroll-behavior" |
    "scroll-margin" |
    "scroll-margin-block" |
    "scroll-margin-block-end" |
    "scroll-margin-block-start" |
    "scroll-margin-bottom" |
    "scroll-margin-inline" |
    "scroll-margin-inline-end" |
    "scroll-margin-inline-start" |
    "scroll-margin-left" |
    "scroll-margin-right" |
    "scroll-margin-top" |
    "scroll-padding" |
    "scroll-padding-block" |
    "scroll-padding-block-end" |
    "scroll-padding-block-start" |
    "scroll-padding-bottom" |
    "scroll-padding-inline" |
    "scroll-padding-inline-end" |
    "scroll-padding-inline-start" |
    "scroll-padding-left" |
    "scroll-padding-right" |
    "scroll-padding-top" |
    "scroll-snap-align" |
    "scroll-snap-stop" |
    "scroll-snap-type" |
    "shape-image-threshold" |
    "shape-margin" |
    "shape-outside" |
    "shape-rendering" |
    "stop-color" |
    "stop-opacity" |
    "stroke" |
    "stroke-dasharray" |
    "stroke-dashoffset" |
    "stroke-linecap" |
    "stroke-linejoin" |
    "stroke-miterlimit" |
    "stroke-opacity" |
    "stroke-width" |
    "tab-size" |
    "table-layout" |
    "text-align" |
    "text-align-last" |
    "text-anchor" |
    "text-combine-upright" |
    "text-decoration" |
    "text-decoration-color" |
    "text-decoration-line" |
    "text-decoration-skip-ink" |
    "text-decoration-style" |
    "text-decoration-thickness" |
    "text-emphasis" |
    "text-emphasis-color" |
    "text-emphasis-position" |
    "text-emphasis-style" |
    "text-indent" |
    "text-orientation" |
    "text-overflow" |
    "text-rendering" |
    "text-shadow" |
    "text-transform" |
    "text-underline-offset" |
    "text-underline-position" |
    "top" |
    "touch-action" |
    "transform" |
    "transform-box" |
    "transform-origin" |
    "transform-style" |
    "transition" |
    "transition-delay" |
    "transition-duration" |
    "transition-property" |
    "transition-timing-function" |
    "translate" |
    "unicode-bidi" |
    "user-select" |
    "vertical-align" |
    "visibility" |
    /** @deprecated This is a legacy alias of `alignContent`. */
    "webkit-align-content" |
    /** @deprecated This is a legacy alias of `alignItems`. */
    "webkit-align-items" |
    /** @deprecated This is a legacy alias of `alignSelf`. */
    "webkit-align-self" |
    /** @deprecated This is a legacy alias of `animation`. */
    "webkit-animation" |
    /** @deprecated This is a legacy alias of `animationDelay`. */
    "webkit-animation-delay" |
    /** @deprecated This is a legacy alias of `animationDirection`. */
    "webkit-animation-direction" |
    /** @deprecated This is a legacy alias of `animationDuration`. */
    "webkit-animation-duration" |
    /** @deprecated This is a legacy alias of `animationFillMode`. */
    "webkit-animation-fill-mode" |
    /** @deprecated This is a legacy alias of `animationIterationCount`. */
    "webkit-animation-iteration-count" |
    /** @deprecated This is a legacy alias of `animationName`. */
    "webkit-animation-name" |
    /** @deprecated This is a legacy alias of `animationPlayState`. */
    "webkit-animation-play-state" |
    /** @deprecated This is a legacy alias of `animationTimingFunction`. */
    "webkit-animation-timing-function" |
    /** @deprecated This is a legacy alias of `appearance`. */
    "webkit-appearance" |
    /** @deprecated This is a legacy alias of `backfaceVisibility`. */
    "webkit-backface-visibility" |
    /** @deprecated This is a legacy alias of `backgroundClip`. */
    "webkit-background-clip" |
    /** @deprecated This is a legacy alias of `backgroundOrigin`. */
    "webkit-background-origin" |
    /** @deprecated This is a legacy alias of `backgroundSize`. */
    "webkit-background-size" |
    /** @deprecated This is a legacy alias of `borderBottomLeftRadius`. */
    "webkit-border-bottom-left-radius" |
    /** @deprecated This is a legacy alias of `borderBottomRightRadius`. */
    "webkit-border-bottom-right-radius" |
    /** @deprecated This is a legacy alias of `borderRadius`. */
    "webkit-border-radius" |
    /** @deprecated This is a legacy alias of `borderTopLeftRadius`. */
    "webkit-border-top-left-radius" |
    /** @deprecated This is a legacy alias of `borderTopRightRadius`. */
    "webkit-border-top-right-radius" |
    /** @deprecated */
    "webkit-box-align" |
    /** @deprecated */
    "webkit-box-flex" |
    /** @deprecated */
    "webkit-box-ordinal-group" |
    /** @deprecated */
    "webkit-box-orient" |
    /** @deprecated */
    "webkit-box-pack" |
    /** @deprecated This is a legacy alias of `boxShadow`. */
    "webkit-box-shadow" |
    /** @deprecated This is a legacy alias of `boxSizing`. */
    "webkit-box-sizing" |
    /** @deprecated This is a legacy alias of `filter`. */
    "webkit-filter" |
    /** @deprecated This is a legacy alias of `flex`. */
    "webkit-flex" |
    /** @deprecated This is a legacy alias of `flexBasis`. */
    "webkit-flex-basis" |
    /** @deprecated This is a legacy alias of `flexDirection`. */
    "webkit-flex-direction" |
    /** @deprecated This is a legacy alias of `flexFlow`. */
    "webkit-flex-flow" |
    /** @deprecated This is a legacy alias of `flexGrow`. */
    "webkit-flex-grow" |
    /** @deprecated This is a legacy alias of `flexShrink`. */
    "webkit-flex-shrink" |
    /** @deprecated This is a legacy alias of `flexWrap`. */
    "webkit-flex-wrap" |
    /** @deprecated This is a legacy alias of `justifyContent`. */
    "webkit-justify-content" |
    "webkit-line-clamp" |
    /** @deprecated This is a legacy alias of `mask`. */
    "webkit-mask" |
    /** @deprecated This is a legacy alias of `maskBorder`. */
    "webkit-mask-box-image" |
    /** @deprecated This is a legacy alias of `maskBorderOutset`. */
    "webkit-mask-box-image-outset" |
    /** @deprecated This is a legacy alias of `maskBorderRepeat`. */
    "webkit-mask-box-image-repeat" |
    /** @deprecated This is a legacy alias of `maskBorderSlice`. */
    "webkit-mask-box-image-slice" |
    /** @deprecated This is a legacy alias of `maskBorderSource`. */
    "webkit-mask-box-image-source" |
    /** @deprecated This is a legacy alias of `maskBorderWidth`. */
    "webkit-mask-box-image-width" |
    /** @deprecated This is a legacy alias of `maskClip`. */
    "webkit-mask-clip" |
    "webkit-mask-composite" |
    /** @deprecated This is a legacy alias of `maskImage`. */
    "webkit-mask-image" |
    /** @deprecated This is a legacy alias of `maskOrigin`. */
    "webkit-mask-origin" |
    /** @deprecated This is a legacy alias of `maskPosition`. */
    "webkit-mask-position" |
    /** @deprecated This is a legacy alias of `maskRepeat`. */
    "webkit-mask-repeat" |
    /** @deprecated This is a legacy alias of `maskSize`. */
    "webkit-mask-size" |
    /** @deprecated This is a legacy alias of `order`. */
    "webkit-order" |
    /** @deprecated This is a legacy alias of `perspective`. */
    "webkit-perspective" |
    /** @deprecated This is a legacy alias of `perspectiveOrigin`. */
    "webkit-perspective-origin" |
    "webkit-text-fill-color" |
    "webkit-text-stroke" |
    "webkit-text-stroke-color" |
    "webkit-text-stroke-width" |
    /** @deprecated This is a legacy alias of `transform`. */
    "webkit-transform" |
    /** @deprecated This is a legacy alias of `transformOrigin`. */
    "webkit-transform-origin" |
    /** @deprecated This is a legacy alias of `transformStyle`. */
    "webkit-transform-style" |
    /** @deprecated This is a legacy alias of `transition`. */
    "webkit-transition" |
    /** @deprecated This is a legacy alias of `transitionDelay`. */
    "webkit-transition-delay" |
    /** @deprecated This is a legacy alias of `transitionDuration`. */
    "webkit-transition-duration" |
    /** @deprecated This is a legacy alias of `transitionProperty`. */
    "webkit-transition-property" |
    /** @deprecated This is a legacy alias of `transitionTimingFunction`. */
    "webkit-transition-timing-function" |
    /** @deprecated This is a legacy alias of `userSelect`. */
    "webkit-user-select" |
    "white-space" |
    "widows" |
    "width" |
    "will-change" |
    "word-break" |
    "word-spacing" |
    "word-wrap" | /** @deprecated */
    "writing-mode" |
    "z-index";
// #endregion
