
//////////////////////////////
// #region Global types
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
 * String that can also be `null`.
 */
export type NullableString = string | null;

/**
 * Number that can also be `null`.
 */
export type NullableNumber = number | null;

/**
 * Boolean that can also be `null`.
 */
export type NullableBoolean = boolean | null;
// #endregion
//////////////////////////////

//////////////////////////////
// #region HTML element types
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
// #endregion
//////////////////////////////

//////////////////////////////
// #region Narrowed down HTML element types
/**
 * Tag names of HTML elements with phrasing content.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Content_categories#phrasing_content
 */
export type HTMLElementWithPhrasingContentTagName =
    | "abbr" | "audio" | "b" | "bdi" | "bdo" | "br" | "button" | "canvas" | "cite" | "code" | "data"
    | "datalist" | "dfn" | "em" | "embed" | "i" | "iframe" | "img" | "input" | "kbd" | "label"
    | "mark" | /*"math" |*/ "meter" | "noscript" | "object" | "output" | "picture" | "progress"
    | "q" | "ruby" | "s" | "samp" | "script" | "select" | "slot" | "small" | "span" | "strong"
    | "sub" | "sup" | /*"svg" |*/ "template" | "textarea" | "time" | "u" | "var" | "video" | "wbr";

/**
 * HTML elements with phrasing content.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Content_categories#phrasing_content
 */
export type HTMLElementWithPhrasingContent = HTMLElementTagNameMap[HTMLElementWithPhrasingContentTagName];
// export type HTMLElementWithPhrasingContent = HTMLElementTagNameMap[Exclude<HTMLElementWithPhrasingContentTagName, "svg" | "math">];

/**
 * HTML elements which have a native `disabled` property (element types).
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled#overview
 */
export type HTMLElementWithDisabled =
    HTMLButtonElement | HTMLTextAreaElement | HTMLFieldSetElement | HTMLInputElement
    | HTMLOptGroupElement | HTMLOptionElement | HTMLSelectElement;

/**
 * HTML elements which can have a `autocomplete` attribute.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete
 */
export type HTMLElementWithAutocomplete =
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

/**
 * HTML input types (attribute `type`).
 */
export type HTMLInputTypes = "button" | "checkbox" | "color" | "date" | "datetime-local" | "email"
    | "file" | "hidden" | "image" | "month" | "number" | "password" | "radio" | "range" | "reset"
    | "search" | "submit" | "tel" | "text" | "time" | "url" | "week";

/**
 * HTML elements which have a native `disabled` property (tag names).
 */
export const HTMLTagsWithNativeDisabled: Array<string> = [
    "BUTTON",
    "FIELDSET",
    "INPUT",
    "OPTGROUP",
    "OPTION",
    "SELECT",
    "TEXTAREA"
] as const;

/**
 * HTML elements which can be tabbed to by default.
 * @todo Verify this list.
 */
export const HTMLTagsWithNativeTabbing: Array<string> = [
    "A",
    "AREA",
    "BUTTON",
    "INPUT",
    "OBJECT",
    "SELECT",
    "TEXTAREA"
] as const;

/**
 * HTML elements which can have a `name` attribute.
 */
export type HTMLElementWithName =
    HTMLButtonElement | HTMLFormElement | HTMLFieldSetElement | HTMLIFrameElement | HTMLInputElement
    | HTMLObjectElement | HTMLOutputElement | HTMLSelectElement | HTMLTextAreaElement
    | HTMLMapElement | HTMLMetaElement | HTMLParamElement;

/**
 * HTML elements which can have a `value` attribute (string).
 */
export type HTMLElementWithSValue =
    // Regular
    HTMLButtonElement | HTMLInputElement | HTMLOptionElement | HTMLParamElement
    // Additional
    | HTMLSelectElement
    // Regular
    | HTMLTextAreaElement;

/**
 * HTML elements which can have a `value` attribute (number).
 */
export type HTMLElementWithNValue = HTMLLIElement | HTMLMeterElement | HTMLProgressElement;

/**
 * HTML elements which can have a `required` attribute.
 */
export type HTMLElementWithRequired = HTMLInputElement | HTMLSelectElement
    | HTMLTextAreaElement;

/**
 * HTML elements which can have a `readonly` attribute.
 */
export type HTMLElementWithReadonly = HTMLInputElement | HTMLTextAreaElement;

/**
 * HTML elements which can have a numeric `width` and/or `height` attribute.\
 * __Note:__ `width` and/or `height` are only valid for the `image` input type (a graphical submit
 * button).
 */
export type HTMLElementWithNWidthHeight = HTMLCanvasElement | HTMLImageElement
    | HTMLInputElement | HTMLVideoElement;

/**
 * HTML elements which can have a string `width` and/or `height` attribute.
 */
export type HTMLElementWithSWidthHeight = HTMLObjectElement | HTMLEmbedElement
    | HTMLIFrameElement;

/**
 * HTML elements which can have a `src` attribute.
 * __Note:__ `src` is only valid for the `image` input type (a graphical submit button).
 */
export type HTMLElementWithSrc = HTMLAudioElement | HTMLEmbedElement | HTMLIFrameElement
    | HTMLImageElement | HTMLInputElement | HTMLScriptElement | HTMLSourceElement | HTMLTrackElement
    | HTMLVideoElement;

/**
 * HTML elements which can have an `alt` attribute.
 * __Note:__ `alt` is only valid for the `image` input type (a graphical submit button).
 */
export type HTMLElementWithAlt = HTMLAreaElement | HTMLImageElement | HTMLInputElement;

/**
 * HTML elements which can have a `crossorigin` attribute.
 */
export type HTMLElementWithCrossorigin = HTMLAudioElement | HTMLImageElement | HTMLLinkElement
    | HTMLScriptElement | HTMLVideoElement;

/**
 * HTML elements which can have a `download` attribute.
 */
export type HTMLElementWithDownload = HTMLAnchorElement | HTMLAreaElement;

/**
 * HTML elements which can have an `href` attribute.
 */
export type HTMLElementWithHref = HTMLAnchorElement | HTMLAreaElement | HTMLBaseElement
    | HTMLLinkElement;

/**
 * HTML elements which can have an `hreflang` attribute.
 */
export type HTMLElementWithHreflang = HTMLAnchorElement | HTMLLinkElement;

/**
 * HTML elements which can have a `loading` attribute.
 */
export type HTMLElementWithLoading = HTMLImageElement | HTMLIFrameElement;

/**
 * HTML elements which can have an `multiple` attribute. For `HTMLInputElement` this is only valid
 * for the types `email` and `file`.
 */
export type HTMLElementWithMultiple = HTMLInputElement | HTMLSelectElement;

/**
 * HTML elements which can have an `open` attribute.
 */
export type HTMLElementWithOpen = HTMLDetailsElement | HTMLDialogElement;

/**
 * HTML elements which can have a `ping` attribute.
 */
export type HTMLElementWithPing = HTMLAnchorElement | HTMLAreaElement;

/**
 * HTML input element types which can have a `pattern` attribute.
 */
export type HTMLInputsWithPattern = "text" | "search" | "url" | "tel" | "email" | "password";

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
 * HTML elements which can have a `referrerPolicy` attribute.
 */
export type HTMLElementWithReferrerPolicy = HTMLAnchorElement | HTMLAreaElement | HTMLIFrameElement
    | HTMLImageElement | HTMLLinkElement | HTMLScriptElement;

/**
 * HTML elements which can have a `rel` attribute.
 */
export type HTMLElementWithRel = HTMLAnchorElement | HTMLAreaElement | HTMLLinkElement;

/**
 * HTML input element types which can have a `size` attribute.
 */
export type HTMLInputsWithSize = "text" | "search" | "url" | "tel" | "email" | "password";

/**
 * HTML input element types which can have a `step` attribute.
 */
export type HTMLInputsWithStep = HTMLInputsWithMinMax;

/**
 * HTML elements which can have a `target` attribute.
 */
export type HTMLElementWithTarget = HTMLAnchorElement | HTMLAreaElement | HTMLBaseElement
    | HTMLFormElement;

/**
 * HTML elements which can have a `type` attribute.
 */
export type HTMLElementWithType = HTMLButtonElement | HTMLInputElement | HTMLEmbedElement
    | HTMLObjectElement | HTMLOListElement | HTMLScriptElement | HTMLSourceElement
    | HTMLStyleElement | HTMLMenuElement | HTMLLinkElement;

/**
 * HTML input element types which can have a `list` attribute.
 */
export type HTMLInputsWithDataList = "text" | "search" | "url" | "tel" | "email" | "date" | "month"
    | "week" | "time" | "datetime-local" | "number" | "range" | "color";
// #endregion
//////////////////////////////

//////////////////////////////
// #region Global DOM attribute values
/**
 * Valid values for the DOM attribute `contentEditable`.
 */
export type AutoCapitalizeAttrValues = "none" | "off" | "sentences" | "on" | "words" | "characters";

/**
 * Valid values for the DOM attribute `contentEditable`.
 */
export type ContentEditableAttrValues = boolean | "" | "plaintext-only";

/**
 * Valid values for the DOM attribute `dir`.
 */
export type DirAttrValues = "ltr" | "rtl" | "auto" | "" | null;

/**
 * Valid values for the DOM attribute `enterKeyHint`.
 */
export type EnterKeyHintAttrValues = "enter" | "done" | "go" | "next" | "previous" | "search"
    | "send" | null;

/**
 * Valid values for the DOM attribute `inputMode`.
 */
export type InputModeAttrValues = "none" | "text" | "decimal" | "numeric" | "tel" | "search"
    | "email" | "url" | "" | null;

/**
 * Valid values for the DOM attribute `popover`.
 */
export type PopoverAttrValues = "auto" | "manual" | null;

/**
 * Possible values for the ability of an element to be resized.
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/resize and the note for the corresponding
 * property `Resizable` in interface `IGlobalDOMAttributes<Z>`.
 */
export type ResizableValues = false | "none" | "both" | "horizontal" | "vertical" | "block" | "inline";
// #endregion
//////////////////////////////

/**
 * Default values for constructing events (`{ bubbles: true, cancelable: false, composed: true }`).
 */
export const DEFAULT_EVENT_INIT_DICT = { bubbles: true, cancelable: false, composed: true }; // eslint-disable-line jsdoc/require-jsdoc

/**
 * Default values for constructing cancelable events
 * (`{ bubbles: true, cancelable: true, composed: true }`).
 */
export const DEFAULT_CANCELABLE_EVENT_INIT_DICT = { bubbles: true, cancelable: true, composed: true }; // eslint-disable-line jsdoc/require-jsdoc

/**
 * Names of CSS style properties.
 */
export type CSSPropertyNames = keyof Omit<
    CSSStyleDeclaration,
    number |
    typeof Symbol.iterator |
    "getPropertyValue" |
    "setProperty" |
    "removeProperty" |
    "getPropertyPriority" |
    "item"
>;
