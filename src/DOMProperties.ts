
import {
    ACustomComponentEvent,
    AElementComponent
} from "./Classes.js";
import {
    ComponentFactory,
    ElementComponentWithChildren
} from "./Components.js";
import {
    INodeComponent,
    Phrase,
    Phrases
} from "./Interfaces.js";
import {
    HTMLElementWithAlt,
    HTMLElementWithAutocomplete,
    HTMLElementWithCrossorigin,
    HTMLElementWithDisabled,
    HTMLElementWithDownload,
    HTMLElementWithHref,
    HTMLElementWithHreflang,
    HTMLElementWithLabel,
    HTMLElementWithLoading,
    HTMLElementWithMultiple,
    HTMLElementWithName,
    HTMLElementWithNValue,
    HTMLElementWithNWidthHeight,
    HTMLElementWithOpen,
    HTMLElementWithPing,
    HTMLElementWithReadonly,
    HTMLElementWithReferrerPolicy,
    HTMLElementWithRel,
    HTMLElementWithRequired,
    HTMLElementWithSrc,
    HTMLElementWithSValue,
    HTMLElementWithSWidthHeight,
    HTMLElementWithTarget,
    HTMLElementWithType,
    NullableNumber,
    NullableString
} from "./Types.js";
import {
    mixinDOMProperties
} from "./Utils.js";


/**
 * This file contains various abstract classes that have default implementations of DOM attributes
 * and properties that are used in some DOM components. These attributes/properties are added as
 * mixins to some DOM components to avoid repeating the code in the components themselves.
 *
 * To prevent circular dependencies and reference/initialization errors due to module
 * loading/execution these classes must not be used from classes in this project! The only exception
 * to this rule is currently the {@link Option} component (in this module) which is used by the
 * {@link DataListAttr} DOM property class.
 * ---
 * @todo Extend with more DOM attributes/properties/utility DOM components.
 */


/////////////////////////////
// #region Attributes
/**
 * 'Alt' getter/setter and set method returning this instance.
 */
export abstract class AltAttr<T extends HTMLElementWithAlt, EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends AElementComponent<T, EventMap> {
    /**
     * Get/set the `alt` attribute value of the component. `null` or an empty string removes the
     * attribute.
     */
    public get Alt(): string {
        return this._dom.alt;
    }
    /** @inheritdoc */
    public set Alt(v: NullableString) {
        this.alt(v);
    }

    /**
     * Set `alt` attribute value of the component.
     * @param v The value to be set. `null` or an empty string removes the attribute.
     * @returns This instance.
     */
    public alt(v: NullableString): this {
        this.attrib("alt", v);
        return this;
    }
}

/**
 * Possible values for the `autocomplete` attribute.\
 * __Note__: Currently there is no typing for the `string` part of the union.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete
 */
export type AutocompleteAttributeValues = "on" | "off" | string | null; // eslint-disable-line @typescript-eslint/no-redundant-type-constituents

/**
 * 'Autocomplete' getter/setter and set method returning this instance.
 */
export abstract class AutocompleteAttr<T extends HTMLElementWithAutocomplete, EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends AElementComponent<T, EventMap> {
    /**
     * Get/set the `autocomplete` attribute value of the component. Allowed values are `on`, `off`,
     * strings and `null`. `null` or an empty string removes the attribute.
     */
    public get Autocomplete(): AutocompleteAttributeValues {
        return <AutocompleteAttributeValues>this._dom.autocomplete;
    }
    /** @inheritdoc */
    public set Autocomplete(v: AutocompleteAttributeValues) {
        this.autocomplete(v);
    }

    /**
     * Set `autocomplete` attribute value of the component. Allowed values are `on`, `off`, strings
     * and `null`. `null` or an empty string removes the attribute.
     * @param v The value to be set.
     * @returns This instance.
     */
    public autocomplete(v: AutocompleteAttributeValues): this {
        this.attrib("autocomplete", v);
        return this;
    }
}

/**
 * Custom 'checked' event for checkboxes and radio buttons. Like `change` and `input` this event is
 * only emitted on user input, not on checking/unchecking the checkbox or radio button by code!
 */
export class CheckedEvent<S extends INodeComponent<Node>, D extends object = {
    /** `true`, if the checkbox/radio button is checked, otherwise `false`. */
    Checked: boolean;
}> extends ACustomComponentEvent<"checked", S, D> { }

/**
 * 'Checked' getter/setter and set method returning this instance.
 */
export abstract class CheckedAttr<T extends HTMLInputElement, EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends AElementComponent<T, EventMap> {
    /**
     * Get/set the `checked` attribute value of the component (`checkbox` or `radio`).\
     * __Note:__ Only supported for the input elements of the types `checkbox` and `radio`.
     */
    public get Checked(): boolean {
        return this._dom.checked;
    }
    /** @inheritdoc */
    public set Checked(v: boolean) {
        this.checked(v);
    }

    /**
     * Set `checked` attribute value of the component (`checkbox` or `radio`).
     * @param v The value to be set.
     * __Note:__ Only supported for the input elements of the types `checkbox` and `radio`.
     * @returns This instance.
     */
    public checked(v: boolean): this {
        // Only valid for `checkbox` but causes no problems for `radio`.
        this._dom.indeterminate = false;
        this._dom.checked = v;
        return this;
    }

    /**
     * Toggle the `checked` attribute value of the component (`checkbox` or `radio`).
     * __Note:__ Only supported for the input elements of the types `checkbox` and `radio`.
     * @returns This instance.
     */
    public toggleChecked(): this {
        this.checked(!this._dom.checked);
        return this;
    }
}

/**
 * Possible values for the `crossOrigin` attribute.
 */
export type CrossOrginAttributeValues = "anonymous" | "use-credentials" | "" | null;

/**
 * 'CrossOrigin' getter/setter and set method returning this instance.
 */
export abstract class CrossOrginAttr<T extends HTMLElementWithCrossorigin, EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends AElementComponent<T, EventMap> {
    /**
     * Get/set the `crossOrigin` attribute value of the component. Allowed values are `anonymous`,
     * `use-credentials` an empty string and `null` (both of the latter remove the attribute).
     */
    public get CrossOrigin(): CrossOrginAttributeValues {
        return <CrossOrginAttributeValues>this._dom.crossOrigin;
    }
    /** @inheritdoc */
    public set CrossOrigin(v: CrossOrginAttributeValues) {
        this._dom.crossOrigin = v;
    }

    /**
     * Set `crossOrigin` attribute value of the component. Allowed values are `anonymous`,
     * `use-credentials` an empty string and `null` (both of the latter remove the attribute).
     * @param v The value to be set.
     * @returns This instance.
     */
    public crossOrigin(v: CrossOrginAttributeValues): this {
        this.attrib("dirname", v);
        return this;
    }
}

/**
 * 'DataList' (suggestion values) getter/setter and set method returning this instance.\
 * __Note:__ Only some inputs can have a 'DataList' attribute (`list` attribute).
 * @see `@vanilla-ts/core HTMLInputsWithDataList`
 */
export abstract class DataListAttr<T extends HTMLInputElement, EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends AElementComponent<T, EventMap> {
    /**
     * Get/set the datalist (suggestion values) of the component. If the length of `values` is `0`,
     * the attribute is removed.
     */
    public get DataList(): string[] {
        const result: string[] = [];
        const dataListID = this.attr("list");
        if (dataListID) {
            const dataList = this._dom.querySelector("#" + dataListID);
            if (dataList) {
                for (const option of dataList.querySelectorAll("option")) {
                    result.push(option.value);
                }
            }
        }
        return result;
    }
    /** @inheritdoc */
    public set DataList(values: string[]) {
        this.dataList(values);
    }

    /**
     * Set new suggestion values.
     * @param values The new suggestion values. If the length of `values` is `0`, the attribute is
     * removed.
     * @returns This instance.
     */
    public dataList(values: string[]): this {
        let dataListID = this.attr("list");
        if (!dataListID) {
            if (values.length === 0) {
                return this;
            }
            dataListID = `dl${Date.now().valueOf()}${Math.floor(Math.random() * 1000)}`;
        }
        let dataList = document.getElementById(dataListID);
        if (dataList && values.length === 0) {
            this.attrib("list", null);
            dataList.remove();
            return this;
        }
        if (!dataList) {
            dataList = document.createElement("datalist");
            dataList.id = dataListID;
            this.attrib("list", dataListID);
            this._dom.appendChild(dataList);
        }
        while (dataList.lastChild) {
            dataList.lastChild.remove();
        }
        for (const value of values) {
            const option = document.createElement("option");
            option.value = value;
            dataList.append(option);
        }
        return this;
    }
}

/**
 * 'Dirname' getter/setter and set method returning this instance.
 */
export abstract class DirnameAttr<T extends HTMLTextAreaElement | HTMLInputElement, EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends AElementComponent<T, EventMap> {
    /**
     * Get/set the `dirName` attribute value of the component.  `null` or an empty string removes
     * the attribute. The type of an input element must be `hidden`, `text`, `search`, `tel`, `url`,
     * `email`, `password`, `submit`, `reset` or `button`.
     */
    public get DirName(): string {
        return this._dom.dirName;
    }
    /** @inheritdoc */
    public set DirName(v: NullableString) {
        this.dirName(v);
    }

    /**
     * Set `dirName` attribute value of the component. `null` or an empty string removes the
     * attribute.The type of an input element must be `hidden`, `text`, `search`, `tel`, `url`,
     * `email`, `password`, `submit`, `reset` or `button`.
     * @param v The value to be set.
     * @returns This instance.
     */
    public dirName(v: NullableString): this {
        this.attrib("dirname", v);
        return this;
    }
}

/**
 * 'Download' getter/setter and set method returning this instance.
 */
export abstract class DownloadAttr<T extends HTMLElementWithDownload, EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends AElementComponent<T, EventMap> {
    /**
     * Get/set the `download` attribute of the component. `null` or an empty string removes the
     * attribute.
     */
    public get Download(): string {
        return this._dom.download;
    }
    /** @inheritdoc */
    public set Download(v: NullableString) {
        this.download(v);
    }

    /**
     * Sets the `download` attribute of the component.
     * @param v The value to be set. `null` or an empty string removes the attribute.
     * @returns This instance.
     */
    public download(v: NullableString): this {
        this.attrib("download", v);
        return this;
    }
}

/**
 * 'For' getter/setter and set method returning this instance.
 */
export abstract class ForAttr<T extends HTMLLabelElement | HTMLOutputElement, EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends AElementComponent<T, EventMap> {
    /**
     * Get/set `for` attribute value of underlying HTML element. When used with `<label>`, the `for`
     * attribute has a value which is the id of the form element it relates to. When used with an
     * `<output>`, the `for` attribute has a value which is a space separated list of the id values
     * of the elements which are used to create the output.
     */
    public get For(): NullableString {
        return this.attr("for");
    }
    /** @inheritdoc */
    public set For(v: NullableString) {
        this.for(v);
    }

    /**
     * Set `for` attribute value of underlying HTML element. When used with `<label>`, the `for`
     * attribute has a value which is the id of the form element it relates to. When used with
     * `<output>`, the `for` attribute has a value which is a space separated list of the id values
     * of the elements which are used to create the output.
     * @param v The `for` attribute to be set or `null` to remove the attribute.
     * @returns This instance.
     */
    public for(v: NullableString): this {
        this.attrib("for", v);
        return this;
    }
}

/**
 * 'Href' getter/setter and set method returning this instance.
 */
export abstract class HrefAttr<T extends HTMLElementWithHref, EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends AElementComponent<T, EventMap> {
    /**
     * Get/set the `href` attribute of the component. `null` or an empty string removes the
     * attribute.
     */
    public get Href(): string {
        return this._dom.href;
    }
    /** @inheritdoc */
    public set Href(v: NullableString) {
        this.href(v);
    }

    /**
     * Sets the `href` attribute of the component.
     * @param v The value to be set. `null` or an empty string removes the attribute.
     * @returns This instance.
     */
    public href(v: NullableString): this {
        this.attrib("href", v);
        return this;
    }
}

/**
 * 'Hreflang' getter/setter and set method returning this instance.
 */
export abstract class HreflangAttr<T extends HTMLElementWithHreflang, EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends AElementComponent<T, EventMap> {
    /**
     * Get/set the `hreflang` attribute of the component. `null` or an empty string removes the
     * attribute.
     */
    public get Hreflang(): string {
        return this._dom.hreflang;
    }
    /** @inheritdoc */
    public set Hreflang(v: NullableString) {
        this.hreflang(v);
    }

    /**
     * Sets the `hreflang` attribute of the component.
     * @param v The value to be set. `null` or an empty string removes the attribute.
     * @returns This instance.
     */
    public hreflang(v: NullableString): this {
        this.attrib("hreflang", v);
        return this;
    }
}

/**
 * 'Open' getter/setter and set method returning this instance.
 */
export abstract class OpenAttr<T extends HTMLElementWithOpen, EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends AElementComponent<T, EventMap> {
    /**
     * Get/set the `open` attribute of the component.
     */
    public get Open(): boolean {
        return this._dom.open;
    }
    /** @inheritdoc */
    public set Open(v: boolean) {
        this._dom.open = v;
    }

    /**
     * Sets the `open` attribute of the component.
     * @param v The value to be set.
     * @returns This instance.
     */
    public open(v: boolean): this {
        this._dom.open = v;
        return this;
    }
}

/**
 * 'Ping' getter/setter and set method returning this instance.
 */
export abstract class PingAttr<T extends HTMLElementWithPing, EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends AElementComponent<T, EventMap> {
    /**
     * Get/set the `ping` attribute of the component. If the length of `v` is `0`, the attribute is
     * removed.
     */
    public get Ping(): string[] {
        return this._dom.ping.split(" ");
    }
    /** @inheritdoc */
    public set Ping(v: string[]) {
        this.ping(...v);
    }

    /**
     * Sets the `ping` attribute of the component.
     * @param v The value to be set. If the length of `v` is `0`, the attribute is removed.
     * @returns This instance.
     */
    public ping(...v: string[]): this {
        this.attrib("loading", v.length === 0 ? null : v.join(" "));
        return this;
    }
}

/**
 * 'Label' getter/setter and set method returning this instance.
 */
export abstract class LabelAttr<T extends HTMLElementWithLabel, EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends AElementComponent<T, EventMap> {
    /**
     * Get/set the `label` attribute value of the component. `null` or an empty string removes the
     * attribute.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#label
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/optgroup#label
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/track#label
     */
    public get Label(): string {
        return this._dom.label;
    }
    /** @inheritdoc */
    public set Label(v: NullableString) {
        this.label(v);
    }

    /**
     * Set `label` attribute value of the component.
     * @param v The value to be set. `null` or an empty string removes the attribute.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option#label
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/optgroup#label
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/track#label
     * @returns This instance.
     */
    public label(v: NullableString): this {
        this.attrib("label", v);
        return this;
    }
}

/**
 * Possible values for the `loading` attribute.
 */
export type LoadingAttributeValues = "lazy" | "eager" | null;

/**
 * 'Loading' getter/setter and set method returning this instance.
 */
export abstract class LoadingAttr<T extends HTMLElementWithLoading, EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends AElementComponent<T, EventMap> {
    /**
     * Get/set the `loading` attribute value of the component. Allowed values are `lazy`, `eager`
     * and `null`. `null` or an empty string removes the attribute.
     */
    public get Loading(): LoadingAttributeValues {
        return <LoadingAttributeValues>this._dom.loading;
    }
    /** @inheritdoc */
    public set Loading(v: LoadingAttributeValues) {
        this.loading(v);
    }

    /**
     * Set `loading` attribute value of the component. Allowed values are `lazy`, `eager` and
     * `null`. `null` or an empty string removes the attribute.
     * @param v The value to be set.
     * @returns This instance.
     */
    public loading(v: LoadingAttributeValues): this {
        this.attrib("loading", v);
        return this;
    }
}

/**
 * 'Min/Max' getter/setter and set method returning this instance.
 */
export abstract class MinMaxAttr<T extends HTMLInputElement, EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends AElementComponent<T, EventMap> {
    /**
     * Get/set the `min` attribute value of the component. `null` or an empty string removes the
     * attribute.
     */
    public get Min(): string {
        return this._dom.min;
    }
    /** @inheritdoc */
    public set Min(v: NullableString) {
        this.min(v);
    }

    /**
     * Set `min` attribute value of the component.
     * @param v The value to be set. `null` or an empty string removes the attribute.
     * @returns This instance.
     */
    public min(v: NullableString): this {
        this.attrib("min", v);
        return this;
    }

    /**
     * Get/set the `max` attribute value of the component. `null` removes the attribute.
     */
    public get Max(): string {
        return this._dom.max;
    }
    /** @inheritdoc */
    public set Max(v: NullableString) {
        this.max(v);
    }

    /**
     * Set `max` attribute value of the component.
     * @param v The value to be set. `null` removes the attribute.
     * @returns This instance.
     */
    public max(v: NullableString): this {
        this.attrib("max", v);
        return this;
    }
}

/**
 * 'MinLength/MaxLength' getters/setters and set methods returning this instance.
 */
export abstract class MinMaxLengthAttr<T extends HTMLInputElement | HTMLTextAreaElement, EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends AElementComponent<T, EventMap> {
    /**
     * Get/set the `minLength` attribute of this input. A value lower than or equal to `0` or `null`
     * removes the attribute.
     */
    public get MinLength(): number {
        return this._dom.minLength;
    }
    /** @inheritdoc */
    public set MinLength(v: NullableNumber) {
        this.minLength(v);
    }

    /**
     * Set the `minLength` attribute of this input.
     * @param v The value to be set. A value lower than or equal to `0` or `null` removes the
     * attribute.
     * @returns This instance.
     */
    public minLength(v: NullableNumber): this {
        if (v === null || v <= 0) {
            this.attrib("minlength", null);
            return this;
        }
        const maxLength = this._dom.maxLength;
        // maxLength not set, no further check.
        if (maxLength === -1) {
            this._dom.minLength = v;
            return this;
        }
        // Adapt `maxLength` attribute to have a valid range (in this case a fixed length).
        if (v > maxLength) {
            this._dom.maxLength = v;
        }
        this._dom.minLength = v;
        return this;
    }

    /**
     * Get/set the `maxLength` attribute value of this input. A value lower than or equal to `0` or
     * `null` removes the attribute.
     */
    public get MaxLength(): number {
        return this._dom.maxLength;
    }
    /** @inheritdoc */
    public set MaxLength(v: NullableNumber) {
        this.maxLength(v);
    }

    /**
     * Set the `maxLength` attribute of this input.
     * @param v The value to be set. A value lower than or equal to `0` or `null` removes the
     * attribute.
     * @returns This instance.
     */
    public maxLength(v: NullableNumber): this {
        if (v === null || v <= 0) {
            this.attrib("maxlength", null);
            return this;
        }
        const minLength = this._dom.minLength;
        // `minLength` not set, no further check.
        if (minLength === -1) {
            this._dom.maxLength = v;
            return this;
        }
        // Adapt `minLength` attribute to have a valid range (in this case a fixed length).
        if (v < minLength) {
            this._dom.minLength = v;
        }
        this._dom.maxLength = v;
        return this;
    }
}

/**
 * 'Multiple' getter/setter and set method returning this instance.
 */
export abstract class MultipleAttr<T extends HTMLElementWithMultiple, EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends AElementComponent<T, EventMap> {
    /**
     * Get/set the `multiple` attribute of the component.
     */
    public get Multiple(): boolean {
        return this._dom.multiple;
    }
    /** @inheritdoc */
    public set Multiple(v: boolean) {
        this._dom.multiple = v;
    }

    /**
     * Sets the `multiple` attribute of the component.
     * @param v The value to be set.
     * @returns This instance.
     */
    public multiple(v: boolean): this {
        this._dom.multiple = v;
        return this;
    }
}

/**
 * 'Name' getter/setter and set method returning this instance.
 */
export abstract class NameAttr<T extends HTMLElementWithName, EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends AElementComponent<T, EventMap> {
    /**
     * Get/set `name` attribute value of the component. `null` or an empty string removes the
     * attribute.
     */
    public get Name(): string {
        return this._dom.name;
    }
    /** @inheritdoc */
    public set Name(v: NullableString) {
        this.name(v);
    }

    /**
     * Set `name` attribute value of the component.
     * @param v The value to be set. `null` or an empty string removes the attribute.
     * @returns This instance.
     */
    public name(v: NullableString): this {
        this.attrib("name", v);
        return this;
    }
}

/**
 * 'Disabled' getter/setter and set method returning this instance. In addition to the regular
 * `Disabled` getter/setter/method this also handles the 'native' DOM attribute `disabled`.
 */
export abstract class NativeDisabledAttr<T extends HTMLElementWithDisabled, EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends AElementComponent<T, EventMap> {
    /**
     * Set 'native' `disabled` attribute value of the component.
     * @param v The value to be set.
     * @returns This instance.
     */
    public override disabled(v: boolean): this {
        if (v !== this._disabled) {
            super.disabled(v);
            /**
             * If a parent has been disabled, the underlying 'native' DOM element must also be
             * disabled, otherwise just set its state to `this._disabled`.
             */
            if (this._parentDisabled) {
                this._dom.disabled = true;
            } else {
                this._dom.disabled = this._disabled;
            }
        }
        return this;
    }

    /** @inheritdoc */
    public override parentDisabled(v: boolean): this {
        if (v !== this._parentDisabled) {
            super.parentDisabled(v);
            /**
             * If a parent has been disabled somewhere up in the tree, the underlying 'native' DOM
             * element must also be disabled.
             */
            if (this._parentDisabled) {
                this._dom.disabled = true;
            } else {
                /**
                 * If 'Disabled' has been set explicitly to `true`, the underlying DOM element is
                 * already in a disabled state, so there is nothing to do. But if 'Disabled' is
                 * `false`, the underlying DOM element must reflect the state of `ParentDisabled`
                 * (set by some component up in the tree).
                 */
                if (!this.Disabled) {
                    this._dom.disabled = this._parentDisabled;
                }
            }
        }
        return this;
    }
}

/**
 * 'Pattern' getter/setter and set method returning this instance.
 */
export abstract class PatternAttr<T extends HTMLInputElement, EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends AElementComponent<T, EventMap> {
    /**
     * Get/set the `pattern` attribute value of the component. `null` or an empty string removes the
     * attribute.
     */
    public get Pattern(): string {
        return this._dom.pattern;
    }
    /** @inheritdoc */
    public set Pattern(v: NullableString) {
        this.pattern(v);
    }

    /**
     * Set `pattern` attribute value of the component.
     * @param v The value to be set. `null` or an empty string removes the attribute.
     * @returns This instance.
     */
    public pattern(v: NullableString): this {
        this.attrib("pattern", v);
        return this;
    }
}

/**
 * 'Placeholder' getter/setter and set method returning this instance.
 */
export abstract class PlaceholderAttr<T extends HTMLInputElement | HTMLTextAreaElement, EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends AElementComponent<T, EventMap> {
    /**
     * Get/set the `placeholder` attribute value of the component. `null` or an empty string removes
     * the attribute.
     */
    public get Placeholder(): string {
        return this._dom.placeholder;
    }
    /** @inheritdoc */
    public set Placeholder(v: NullableString) {
        this.placeholder(v);
    }

    /**
     * Set `placeholder` attribute value of the component.
     * @param v The value to be set. `null` or an empty string removes the attribute.
     * @returns This instance.
     */
    public placeholder(v: NullableString): this {
        this.attrib("placeholder", v);
        return this;
    }
}

/**
 * 'Readonly' getter/setter and set method returning this instance.
 */
export abstract class ReadonlyAttr<T extends HTMLElementWithReadonly, EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends AElementComponent<T, EventMap> {
    /**
     * Get/set the `readOnly` attribute value of the component.\
     * __Note:__ Not supported for the input elements of the types `hidden`, `range`, `color`,
     * `checkbox`, `radio`, and `button`, so it should be overrideen with a `noop` attribute there.
     */
    public get Readonly(): boolean {
        return this._dom.readOnly;
    }
    /** @inheritdoc */
    public set Readonly(v: boolean) {
        this._dom.readOnly = v;
    }

    /**
     * Set `readOnly` attribute value of the component.
     * @param v The value to be set.
     * __Note:__ Not supported for the input elements of the types `hidden`, `range`, `color`,
     * `checkbox`, `radio`, and `button`, so it should be overrideen with a `noop` attribute there.
     * @returns This instance.
     */
    public readonly(v: boolean): this {
        this._dom.readOnly = v;
        return this;
    }
}

/**
 * Possible values for the `referrerPolicy` attribute.
 */
export type ReferrerPolicyAttributeValues = "no-referrer" | "no-referrer-when-downgrade" | "origin"
    | "origin-when-cross-origin" | "same-origin" | "strict-origin"
    | "strict-origin-when-cross-origin" | "unsafe-url" | null;

/**
 * 'ReferrerPolicy' getter/setter and set method returning this instance.
 */
export abstract class ReferrerPolicyAttr<T extends HTMLElementWithReferrerPolicy, EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends AElementComponent<T, EventMap> {
    /**
     * Get/set the `referrerpolicy` attribute of the component. `null` or an empty string removes
     * the attribute.
     */
    public get ReferrerPolicy(): ReferrerPolicyAttributeValues {
        return <ReferrerPolicyAttributeValues>this._dom.referrerPolicy;
    }
    /** @inheritdoc */
    public set ReferrerPolicy(v: ReferrerPolicyAttributeValues) {
        this.referrerPolicy(v);
    }

    /**
     * Sets the `referrerpolicy` attribute of the component.
     * @param v The value to be set. `null` or an empty string removes the attribute.
     * @returns This instance.
     */
    public referrerPolicy(v: ReferrerPolicyAttributeValues): this {
        this.attrib("referrerpolicy", v);
        return this;
    }
}

/**
 * 'Rel' getter/setter and set method returning this instance.
 */
export abstract class RelAttr<T extends HTMLElementWithRel, EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends AElementComponent<T, EventMap> {
    /**
     * Get/set the `rel` attribute of the component. `null` or an empty string removes the
     * attribute.
     */
    public get Rel(): string {
        return this._dom.rel;
    }
    /** @inheritdoc */
    public set Rel(v: NullableString) {
        this.rel(v);
    }

    /**
     * Sets the `rel` attribute of the component.
     * @param v The value to be set. `null` or an empty string removes the attribute.
     * @returns This instance.
     */
    public rel(v: NullableString): this {
        this.attrib("rel", v);
        return this;
    }
}

/**
 * 'Required' getter/setter and set method returning this instance.
 */
export abstract class RequiredAttr<T extends HTMLElementWithRequired, EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends AElementComponent<T, EventMap> {
    /**
     * Get/set the `required` attribute value of the component.
     */
    public get Required(): boolean {
        return this._dom.required;
    }
    /** @inheritdoc */
    public set Required(v: boolean) {
        this._dom.required = v;
    }

    /**
     * Set `required` attribute value of the component.
     * @param v The value to be set.
     * @returns This instance.
     */
    public required(v: boolean): this {
        this._dom.required = v;
        return this;
    }
}

/**
 * 'Size' getter/setter and set method returning this instance.
 */
export abstract class SizeAttr<T extends HTMLInputElement | HTMLSelectElement, EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends AElementComponent<T, EventMap> {
    /**
     * Get/set the `size` attribute value of the component. A value lower than or equal to `0` or
     * `null` or an empty string removes the attribute.
     */
    public get Size(): number {
        return this._dom.size;
    }
    /** @inheritdoc */
    public set Size(v: NullableNumber) {
        this.size(v);
    }

    /**
     * Set `size` attribute value of the component.
     * @param v The value to be set. A value lower than or equal to `0` or `null` or an empty string
     * removes the attribute.
     * @returns This instance.
     */
    public size(v: NullableNumber): this {
        this.attrib("size", v === null ? null : v <= 0 ? null : v.toString());
        return this;
    }
}

/**
 * 'Src' getter/setter and set method returning this instance.
 */
export abstract class SrcAttr<T extends HTMLElementWithSrc, EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends AElementComponent<T, EventMap> {
    /**
     * Get/set the `src` attribute value of the component. `null` or an empty string removes the
     * attribute.
     */
    public get Src(): string {
        return this._dom.src;
    }
    /** @inheritdoc */
    public set Src(v: NullableString) {
        this.src(v);
    }

    /**
     * Set `src` attribute value of the component.
     * @param v The value to be set. `null` or an empty string removes the attribute.
     * @returns This instance.
     */
    public src(v: NullableString): this {
        this.attrib("src", v);
        return this;
    }
}

/**
 * 'Step' getter/setter and set method returning this instance.
 */
export abstract class StepAttr<T extends HTMLInputElement, EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends AElementComponent<T, EventMap> {
    /**
     * Get/set the `step` attribute value of the component. `null` or an empty string removes the
     * attribute.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/number#controlling_step_size
     */
    public get Step(): string {
        return this._dom.step;
    }
    /** @inheritdoc */
    public set Step(v: NullableString) {
        this.step(v);
    }

    /**
     * Set `step` attribute value of the component.
     * @param v The value to be set. `null` or an empty string removes the attribute.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/number#controlling_step_size
     * @returns This instance.
     */
    public step(v: NullableString): this {
        this.attrib("step", v);
        return this;
    }

    /**
     * Decrement the value of this component.
     * @param n The amount to decrement, default `1`. Any other value is a multiplier of the step
     * attribute value.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/stepDown
     * @returns This instance.
     */
    public stepDown(n: number = 1): this {
        this._dom.stepDown(n);
        return this;
    }

    /**
     * Increment the value of this component.
     * @param n The amount to increment, default `1`. Any other value is a multiplier of the step
     * attribute value.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/stepUp
     * @returns This instance.
     */
    public stepUp(n: number = 1): this {
        this._dom.stepUp(n);
        return this;
    }
}

/**
 * Possible values for the `target` attribute.
 */
export type TargetAttributeValues = "_self" | "_blank" | "_parent" | "_top" | "_unfencedTop" | string | null; // eslint-disable-line @typescript-eslint/no-redundant-type-constituents

/**
 * 'Target' getter/setter and set method returning this instance.
 */
export abstract class TargetAttr<T extends HTMLElementWithTarget, EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends AElementComponent<T, EventMap> {
    /**
     * Get/set the `target` attribute of the component. Apart from a string `target` can also have
     * the special values `_self`, `_blank`, `_parent`, `_top` and `_unfencedTop`. `null` or an
     * empty string removes the attribute.
     */
    public get Target(): TargetAttributeValues {
        return this._dom.target;
    }
    /** @inheritdoc */
    public set Target(v: TargetAttributeValues) {
        this.target(v);
    }

    /**
     * Sets the `target` attribute of the component.
     * @param v The value to be set. Apart from a string `target` can also have the special values
     * `_self`, `_blank`, `_parent`, `_top` and `_unfencedTop`. `null` or an empty string removes
     * the attribute.
     * @returns This instance.
     */
    public target(v: TargetAttributeValues): this {
        this.attrib("target", v);
        return this;
    }
}

/**
 * 'Type' getter/setter and set method returning this instance.
 */
export abstract class TypeAttr<T extends HTMLElementWithType, EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends AElementComponent<T, EventMap> {
    /**
     * Get/set the `type` attribute of the component. `null` or an empty string removes the
     * attribute.
     */
    public get Type(): NullableString {
        return this.attr("type");
    }
    /** @inheritdoc */
    public set Type(v: NullableString) {
        this.type(v);
    }

    /**
     * Sets the `type` attribute of the component.
     * @param v The value to be set. `null` or an empty string removes the attribute.
     * @returns This instance.
     */
    public type(v: NullableString): this {
        this.attrib("type", v);
        return this;
    }
}

/**
 * 'Value' (string|number) getter/setter and set method returning this instance.\
 * __Notes:__
 * - This is a hybrid attribute: for some elements (mostly `input`) the type of `value` is `string`
 *   while for others the type is `number`.
 * - The attribute `Value` must be overridden by `input` elements of type `image` since `value`
 *   isn't avaliable for this type, so using `Value`/`value()` should do nothing.
 */
export abstract class ValueAttr<T extends HTMLElementWithSValue | HTMLElementWithNValue, EventMap extends HTMLElementEventMap = HTMLElementEventMap, V = T extends HTMLElementWithSValue ? string : T extends HTMLElementWithNValue ? number : never> extends AElementComponent<T, EventMap> {
    /**
     * Get/set the `value` attribute value of the component.
     */
    public get Value(): V {
        return <V>this._dom.value;
    }
    /** @inheritdoc */
    public set Value(v: V) {
        (<V>this._dom.value) = v;
    }

    /**
     * Get/set the `value` attribute value of the component.
     * @param v The value to be set.
     * @returns This instance.
     */
    public value(v: V) {
        (<V>this._dom.value) = v;
        return this;
    }
}

/**
 * 'Width' and 'Height' (string|number) getter/setter and set method returning this instance.\
 * __Note:__ This is a hybrid attribute: for some elements the type of `width`/`height` is `string`
 * while for others the type is `number`.
 */
export abstract class WidthHeightAttr<T extends HTMLElementWithSWidthHeight | HTMLElementWithNWidthHeight, EventMap extends HTMLElementEventMap = HTMLElementEventMap, V = T extends HTMLElementWithSWidthHeight ? string : T extends HTMLElementWithNWidthHeight ? number : never> extends AElementComponent<T, EventMap> {
    /**
     * Get/set the `width` attribute value of the component.
     */
    public get Width(): V {
        return <V>this._dom.width;
    }
    /** @inheritdoc */
    public set Width(v: V) {
        (<V>this._dom.width) = v;
    }

    /**
     * Set `width` attribute value of the component.
     * @param v The value to be set.
     * @returns This instance.
     */
    public width(v: V): this {
        (<V>this._dom.width) = v;
        return this;
    }

    /**
     * Get/set the `height` attribute value of the component.
     */
    public get Height(): V {
        return <V>this._dom.height;
    }
    /** @inheritdoc */
    public set Height(v: V) {
        (<V>this._dom.height) = v;
    }

    /**
     * Set `height` attribute value of the component.
     * @param v The value to be set.
     * @returns This instance.
     */
    public height(v: V): this {
        (<V>this._dom.height) = v;
        return this;
    }
}
// #endregion Attibutes
/////////////////////////////


/////////////////////////////
// #region Properties
/**
 * 'SelectionStart' getter/setter and set method returning this instance.
 */
export abstract class SelectionStartProp<T extends HTMLInputElement | HTMLTextAreaElement, EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends AElementComponent<T, EventMap> {
    /**
     * Get/set the `selectionStart` property value of the component.
     */
    public get SelectionStart(): NullableNumber {
        return this._dom.selectionStart;
    }
    /** @inheritdoc */
    public set SelectionStart(v: NullableNumber) {
        this.selectionStart(v);
    }

    /**
     * Set `selectionStart` property value of the component.
     * @param v The value to be set.
     * @returns This instance.
     */
    public selectionStart(v: NullableNumber): this {
        this._dom.selectionStart = v;
        return this;
    }
}

/**
 * 'SelectionEnd' getter/setter and set method returning this instance.
 */
export abstract class SelectionEndProp<T extends HTMLInputElement | HTMLTextAreaElement, EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends AElementComponent<T, EventMap> {
    /**
     * Get/set the `selectionEnd` property value of the component.
     */
    public get SelectionEnd(): NullableNumber {
        return this._dom.selectionEnd;
    }
    /** @inheritdoc */
    public set SelectionEnd(v: NullableNumber) {
        this.selectionEnd(v);
    }

    /**
     * Set `selectionEnd` property value of the component.
     * @param v The value to be set.
     * @returns This instance.
     */
    public selectionEnd(v: NullableNumber): this {
        this._dom.selectionEnd = v;
        return this;
    }
}
// #endregion Properties
/////////////////////////////


/////////////////////////////
// #region Utility DOM components
/**
 * Option component (`<option>`).\
 * __Note:__ This class is part of `@vanilla-ts/core` and not of `@vanilla-ts/dom` because it is
 * used in the {@link DataListAttr} DOM property (to avoid cyclic package dependencies).
 */
export class Option<EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends ElementComponentWithChildren<HTMLOptionElement, EventMap> { // eslint-disable-line @typescript-eslint/no-unsafe-declaration-merging
    /**
     * Create Option component.
     * @param phrase The phrasing content for the `<option>` element. Due to the limited styling
     * capabilities of <option> elements, it is strongly recommended to use a text string text only.
     */
    constructor(...phrase: Phrases) {
        super("option");
        phrase.length > 0 && this.phrase(...phrase);
    }

    /**
     * Get/set the `selected` attribute value of the component.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/option#selected
     */
    public get Selecetd(): boolean {
        return this._dom.selected;
    }
    /** @inheritdoc */
    public set Selecetd(v: boolean) {
        this._dom.selected = v;
    }

    /**
     * Set `selected` attribute value of the component.
     * @param v The value to be set.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/option#selected
     * @returns This instance.
     */
    public selected(v: boolean): this {
        this._dom.selected = v;
        return this;
    }

    static {
        /** Mixin additional DOM attributes/properties. */
        mixinDOMProperties(
            this,
            LabelAttr<HTMLOptionElement>,
            NativeDisabledAttr<HTMLOptionElement>,
            ValueAttr<HTMLOptionElement>
        );
    }
}

// Augment class definition with the DOM attributes/properties introduced by `mixinDOMProperties()`
// above.
export interface Option<EventMap extends HTMLElementEventMap = HTMLElementEventMap> extends // eslint-disable-line jsdoc/require-jsdoc
    LabelAttr<HTMLOptionElement, EventMap>,
    ValueAttr<HTMLOptionElement, EventMap>,
    NativeDisabledAttr<HTMLOptionElement, EventMap> { }

/**
 * Factory for `Option` components.
 */
export class OptionFactory<T> extends ComponentFactory<Option> {
    /**
     * Create Option component.
     * @param phrase The phrasing content for the `<option>` element. Due to the limited styling
     * capabilities of <option> elements, it is strongly recommended to use a text string text only.
     * @param data Optional arbitrary data passed to the `setupComponent()` function of the factory.
     * @returns Header component.
     */
    public option(phrase?: Phrase | Phrases, data?: T): Option {
        return this.setupComponent(
            !phrase
                ? new Option()
                : Array.isArray(phrase)
                    ? new Option(...phrase)
                    : new Option(phrase),
            data
        );
    }
}
// #endregion Utility DOM components
/////////////////////////////
