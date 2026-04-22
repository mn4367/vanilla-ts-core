import {
    IComponent,
    IComponentFactory,
    INodeComponent
} from "./Interfaces.js";
import {
    AnyType,
    Constructor,
    Ctor,
    HTMLElementWithDisabled
} from "./Types.js";


//////////////////////////////
// #region Mixins
/**
 * For the following type (`UnionToIntersection`) and the `mixin*()`/`extend()` functions below see:
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
 * Creates or modifes a class by extending it with all properties/functions from other classes. The
 * resulting class will have the constructor and the properties/functions of `clazz` and also all
 * properties/functions of the classes given in `classes`.
 * @param createNew If `true`, a new class with the name `__extended__` (derived from `clazz`) is
 * created. This class then will be part of the prototype chain. If `createNew` is `false` then
 * `clazz` itself (!) will be extended, e.g. the prototype of it is modified thus it's no longer the
 * same as before. If a class with only a default constructor is desired result passing `class { }`
 * for `clazz` is a solution.
 * @param clazz The class to be extended.
 * @param classes The classes to be merged into the class given by `clazz`.
 * @returns A (new) class extended with all properties/functions from the given classes:
 * 1) If `createNew` is `true` and `clazz` is a normal class then first an anonymous class derived
 *    from `clazz` is created internally. This class will be part of the prototype chain. The mixins
 *    will go into this derived class and it will have the constructor of `clazz`, `clazz` itself
 *    remains untouched. The result is a new class with all properties/functions from `clazz` and
 *    `classes`.
 * 2) If `createNew` is true and `clazz` is an abstract class, the same as in 1) happens with the
 *    side effect that now instances can be created from the returned new class.
 * 3) If `createNew` is `false` and `clazz` is a regular class, the mixins will go into `clazz`. It
 *    has the same constructor as before but `clazz` is modified from now on! The return value is
 *    also not a new class but instead (the modified) `clazz`. The TypeScript compiler now knows all
 *    mixins to `clazz` on the the returned class but not yet on the type of `clazz` itself, so they
 *    have to be declared with an interface, e.g. `interface BaseClass extends Mixin1, Mixin2 { }`.
 *    After that, all properties/functions from `BaseClass`, `Mixin1` and `Mixin2` will be available
 *    for the TypeScript compiler on instances created with `new BaseClass()`.
 * 4) If `createNew` is `false` and `clazz` is an abstract class, the same as in 3) happens. Note:
 *    trying to create an instance from this class will fail because the returned result is still
 *    an abstract class (at least the TypeScript compiler will complain about it, JavaScript doesn't
 *    have abstract classes).
 * @example
 * ```typescript
 * class Mixin1 {
 *   get M1(): string { return "M1"; }
 * }
 *
 * class Mixin2 {
 *   get M2(): string { return "M2"; }
 * }
 *
 * abstract class AClass {
 *   get A(): string { return "A"; }
 * }
 *
 * class Class {
 *   get C(): string { return "C"; }
 * }
 *
 * // Create _new_ classes.
 * console.log("Create new class from class");
 * const newClassMixin = mixin(true, Class, Mixin1, Mixin2);
 * console.log(newClassMixin === Class); // => false
 * const testNew = new newClassMixin();
 * console.log(testNew.C, testNew.M1, testNew.M2); // => C M1 M2
 * console.log(newClassMixin.prototype);
 *
 * console.log("\nCreate new class from abstract class");
 * const newClassAMixin = mixin(true, AClass, Mixin1, Mixin2);
 * console.log(newClassAMixin === AClass); // => false
 * const newTestA = new newClassAMixin();
 * console.log(newTestA.A, newTestA.M1, newTestA.M2); // => A M1 M2
 * console.log(newClassAMixin.prototype);
 * // ---
 *
 * // Modify class.
 * console.log("\nModify class");
 * const classMixin = mixin(false, Class, Mixin1, Mixin2);
 * console.log(classMixin === Class); // => true
 * const test = new classMixin();
 * console.log(test.C, test.M1, test.M2); // => C M1 M2
 * const test2 = new Class(); // Has `Class` also all properties/functions from the mixins now? No!
 * console.log(test2.C, test2.M1, test2.M2); => // Error TS2339: Property 'M1' does not exist on type 'Class'.
 * // The error above is fixed with:
 * //   interface Class extends Mixin1, Mixin2 { }
 * // After doing so
 * //   console.log(test2.C, test2.M1, test2.M2); // => C M1 M2
 * // will work.
 * console.log(classMixin.prototype);
 *
 * console.log("\nModify abstract class");
 * const classAMixin = mixin(false, AClass, Mixin1, Mixin2);
 * console.log(classAMixin === AClass); // => true
 * // @ ts-ignore (just to silence the TypeScript compiler and to show that in pure JavaScript this would work).
 * const testA = new classAMixin(); // => Error TS2511: Cannot create an instance of an abstract class.
 * console.log(testA.A, testA.M1, testA.M2); // => A M1 M2
 * // For the error with `const testA2 = new AClass(); console.log(testA2.M1);` see previous example above.
 * console.log(classAMixin.prototype);
 * // ---
 * ```
 */
export function mixin<
    CreateNew extends boolean,
    T extends Ctor<unknown>,
    R extends Ctor<unknown>[],
    ResultCtor = CreateNew extends true
    ? new (...args: ConstructorParameters<T>) => UnionToIntersection<InstanceType<[T, ...R][number]>>
    : T extends Constructor<unknown>
    ? new (...args: ConstructorParameters<T>) => UnionToIntersection<InstanceType<[T, ...R][number]>>
    : abstract new (...args: ConstructorParameters<T>) => UnionToIntersection<InstanceType<[T, ...R][number]>>
>(createNew: CreateNew, clazz: T, ...classes: R): ResultCtor {
    const __extended__ = createNew
        ? class extends clazz { } // eslint-disable-line jsdoc/require-jsdoc
        : clazz;
    for (const ctor of classes) {
        for (const name of Object.getOwnPropertyNames(ctor.prototype)) {
            const descriptor = Object.getOwnPropertyDescriptor(ctor.prototype, name);
            if (descriptor && (name !== "constructor")) {
                Object.defineProperty(
                    __extended__.prototype,
                    name,
                    descriptor
                );
            }
        }
    }
    return <ResultCtor><unknown>__extended__;
}

/**
 * Merges all DOM properties from an array of DOM component classes into a single DOM component
 * class. This function basically does nothing else than `mixin()`, it only exists to be used
 * explicitly for merging DOM properties into existing DOM components, it should not be used
 * for other tasks/in other contexts.
 * @param component The component _into which_ the DOM properties are to be merged.
 * @param components The components _from which_ the DOM properties are to be merged. These classes
 * shouldn't be real components, only extensions from `ANodeComponent` or `AElementComponent` which
 * contain nothing more than the implementation of only a single DOM attribute.
 * @returns `component` which is extended with a merge of all DOM properties from `classes`,
 * excluding their constructors. `component` will still have its original constructor.
 * @see Function `mixin()` and the classes `Checkbox` in `Checkbox.ts`, `Input` in `Input.ts` (both
 * in _@vanilla-ts/dom_) and `CheckedAttr` in `DOMAttributes.ts` in this project for examples for
 * using this technique.
 */
export function mixinDOMProperties<
    T extends Ctor<INodeComponent<HTMLElement>>,
    R extends Ctor<INodeComponent<HTMLElement>>[],
    ResultCtor = T extends Constructor<unknown>
    ? new (...args: ConstructorParameters<T>) => UnionToIntersection<InstanceType<[T, ...R][number]>>
    : abstract new (...args: ConstructorParameters<T>) => UnionToIntersection<InstanceType<[T, ...R][number]>>
>(component: T, ...components: [...R]): ResultCtor {
    return mixin(false, component, ...components);
}

/**
 * Merges all factory functions from an array of component factory classes into a single component
 * factory class. This function basically does nothing else than `mixin()`, it only exists to be
 * used explicitly for merging factory functions into an existing component factory, it should not
 * be used for other tasks/in other contexts.
 * @param factory The component factory _into which_ the factory functions are to be merged. This
 * factory usually _should only implement the `setupComponent()` function_.
 * @param factories The component factories _from which_ the factory functions are to be merged.
 * _None of these classes must implement `setupComponent()`, they all must only implement functions
 * that return component instances!_
 * @returns A _new_ class which _extends_ `factory` that contains a merge of all factory functions
 * from `factories`, excluding their constructors (usually just default constructors).
 * @see Function `mixin()` and the classes `VTSApplication` and `VTS_App` in `Components.ts` in this
 * project for examples for using this function.
 */
export function mixinComponentFactories<
    T extends Ctor<IComponentFactory<IComponent>>,
    R extends Ctor<IComponentFactory<IComponent>>[],
    ResultCtor = T extends Constructor<unknown>
    ? new (...args: ConstructorParameters<T>) => UnionToIntersection<InstanceType<[T, ...R][number]>>
    : abstract new (...args: ConstructorParameters<T>) => UnionToIntersection<InstanceType<[T, ...R][number]>>
>(factory: T, ...factories: [...R]): ResultCtor {
    return mixin(true, factory, ...factories);
}
// #endregion
//////////////////////////////

//////////////////////////////
// #region DOM
/**
 * Constant that holds the current status of the various modifier keys.
 */
export const ModifierKeys = (() => {
    const keys = {
        /* eslint-disable jsdoc/require-jsdoc */
        Shift: false,
        Ctrl: false,
        Alt: false,
        AltGr: false,
        Meta: false,
        Fn: false,
        CapsLock: false,
        NumLock: false,
        ScrollLock: false,
        /* eslint-enable */
    };
    const update = (event: KeyboardEvent): void => { // eslint-disable-line jsdoc/require-jsdoc
        keys.Shift = event.shiftKey;
        keys.Ctrl = event.ctrlKey;
        keys.Alt = event.altKey;
        keys.AltGr = !!event.getModifierState?.("AltGraph");
        keys.Meta = event.metaKey;
        // For support of the following statuses, see:
        // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState
        keys.Fn = !!event.getModifierState?.("Fn");
        keys.CapsLock = !!event.getModifierState?.("CapsLock");
        keys.NumLock = !!event.getModifierState?.("NumLock");
        keys.ScrollLock = !!event.getModifierState?.("ScrollLock");
    };
    typeof window !== "undefined" && window.addEventListener("keydown", (event: KeyboardEvent) => update(event), { capture: true }); // eslint-disable-line jsdoc/require-jsdoc
    typeof window !== "undefined" && window.addEventListener("keyup", (event: KeyboardEvent) => update(event), { capture: true }); // eslint-disable-line jsdoc/require-jsdoc
    return keys as Readonly<{
        /* eslint-disable jsdoc/require-jsdoc */
        Shift: boolean;
        Ctrl: boolean;
        Alt: boolean;
        AltGr: boolean;
        Meta: boolean;
        Fn: boolean;
        CapsLock: boolean;
        NumLock: boolean;
        ScrollLock: boolean;
        /* eslint-enable */
    }>;
})();

/**
 * CSS selector that selects all tabbable elements.\
 * __Important note:__ This selection is most likely very incomplete. It does not guarantee that the
 * selected elements are actually tabbable, it only selects elements that _potentially could be_
 * tabbable.
 */
const tabbableElementsSelector = [
    "button:not([tabindex='-1'])",
    "input:not([tabindex='-1'])",
    "select:not([tabindex='-1'])",
    "textarea:not([tabindex='-1'])",
    "details:not([tabindex='-1'])",
    "area:not([tabindex='-1'])",
    "a:not([tabindex='-1'])",
    "audio[controls]:not([tabindex='-1'])",
    "video[controls]:not([tabindex='-1'])",
    "form:not([tabindex='-1'])",
    "[href]:not([tabindex='-1'])",
    "[contenteditable]",
    "[tabindex]:not([tabindex='-1'])"
].join(", ");

/**
 * Implements a tab key cycle within a given HTML element. This means that when the tab key is
 * pressed within `elem` and the currently active element is the last tabbable element within
 * `elem`, the focus will be set to the first tabbable element within `elem`. If the shift key is
 * pressed together with the tab key and the currently focused element is the first tabbable
 * element within `elem`, the focus will be set to the last tabbable element within `elem`.\
 * __Important note:__ This implementation is most likely very incomplete. It only handles some
 * basic cases. A complete implementation of tabbable elements would be much more complex. It can
 * also take some time to find all tabbable elements within `elem`, especially if the selector
 * returns many elements. Therefore, this function should only be used in sub sections of an app
 * like in a dialog or in panels which require tab key trapping.
 * @param elem The HTML element within which the tab key cycle is to be applied.
 * @param ev The keyboard event that triggered the tab key cycle.
 * @param preventPropagation If `true`, the event propagation will be stopped when the tab key cycle
 * is applied. Default: `true`.
 * @param selector A CSS selector that selects all tabbable elements within `elem`.\
 * Default: See {@link tabbableElementsSelector}.
 * @see https://allyjs.io/data-tables/focusable.html#editable-elements
 * @see https://allyjs.io/api/is/tabbable.html
 * @todo Improve the implementation to cover more cases of tabbable elements.
 */
export function tabKeyFocusCycle(elem: HTMLElement, ev: KeyboardEvent, preventPropagation: boolean = true, selector: string = tabbableElementsSelector): void {
    const tabbableElements = Array.from(elem.querySelectorAll(selector))
        .filter(e => {
            return e instanceof HTMLElement
                && !e.classList.contains("disabled")
                && !(<HTMLElementWithDisabled>e).disabled
                && !e.hidden
                && !e.inert
                && e.style.display !== "none"
                && e.style.visibility !== "hidden"
                && (e.hasAttribute("contenteditable") ? ["", "true"].includes(e.contentEditable.trim().toLowerCase()) : true);
        });
    const firstTabbableElement = <HTMLElement>tabbableElements[0];
    const lastTabbableElement = <HTMLElement>tabbableElements[tabbableElements.length - 1];
    if (ev.shiftKey) {
        if (!firstTabbableElement || ev.target === firstTabbableElement) {
            ev.preventDefault();
            preventPropagation && ev.stopImmediatePropagation();
            lastTabbableElement?.focus?.();
        }
    } else {
        if (!lastTabbableElement || ev.target === lastTabbableElement) {
            ev.preventDefault();
            preventPropagation && ev.stopImmediatePropagation();
            firstTabbableElement?.focus?.();
        }
    }
}

/**
 * Get a rectangle (`DOMRect`) that contains the position and size of an HTML element The position
 * is calculated relative to the parent element of `elem`. The size includes the border width and
 * padding of `elem`.
 * @param elem The HTML element for which the rectangle is to be calculated.
 * @returns A rectangle containing the position (relative to its parent element) and size (including
 * border width and padding) of an HTML element.
 */
export function getClientRect(elem: HTMLElement): DOMRect {
    const childRect = elem.getBoundingClientRect();
    const parentRect = elem.parentElement?.getBoundingClientRect();
    return new DOMRect(
        childRect.left - (parentRect?.left ?? 0),
        childRect.top - (parentRect?.top ?? 0),
        elem.offsetWidth,
        elem.offsetHeight
    );
}

/**
 * Checks whether the coordinates of a point lie within a rectangle. 'Within' is also fulfilled if
 * the point lies exactly on one edge or two edges of the rectangle.
 * @param rect The rectangle.
 * @param point The point.
 * @returns `true`, if `point` is inside `rect`, otherwise `false`.
 */
export function rectContains(rect: DOMRect, point: DOMPoint): boolean {
    return (point.x >= rect.left)
        && (point.y >= rect.top)
        && (point.x <= rect.right)
        && (point.y <= rect.bottom);
}
// #endregion
//////////////////////////////

//////////////////////////////
// #region Misc
/**
 * Converts a string to a kebap case string.
 * @param s The string to be converted.
 * @returns A kebap case string.
 * @see https://developer.mozilla.org/en-US/docs/Glossary/Kebab_case
 * @see https://stackoverflow.com/a/67243723
 */
export function toKebabCase(s: string): string {
    return s.replace(/[A-Z]+(?![a-z])|[A-Z]/g, (c, o) => (o ? "-" : "") + c.toLowerCase());
}

/**
 * Checks a value against the boundaries of `boundary1` and `boundary2`.
 * @param n The value to check against the boundaries given by `boundary1` and `boundary2`.
 * @param boundary1 One end of the range to check against.
 * @param boundary2 The other end of the range to check against.
 * @returns `n`, if `n` is equal to `boundary1` or `boundary2` or lies between `boundary1` and
 * `boundary2` or the boundary which is nearest to `n` (`boundary1` or `boundary2`).\
 * __Note:__ Contrary to https://github.com/tc39/proposal-math-clamp?tab=readme-ov-file#examples
 * this implementation does not throw a `RangeError` if `boundary1` is greater than `boundary2`!
 */
export function clamp(n: number, boundary1: number, boundary2: number): number {
    return boundary1 === boundary2
        ? boundary1
        : boundary1 < boundary2
            ? Math.max(Math.min(n, boundary2), boundary1)
            : Math.max(Math.min(n, boundary1), boundary2);
}

/**
 * Return type of the function `getDebouncedFnc`.
 */
interface IDebounceFunctionReturn<F extends (...args: AnyType) => AnyType> extends Array<IDebouncedFunction<F> | (() => void)> {
    /** Original function as debounced function. */
    0: (...args: Parameters<F>) => Promise<ReturnType<F>>;
    /** Cancellation of debouncing. */
    1: () => void;
    /** Call the original function. `cancel=true` cancels the debouncing at the same time. */
    2: (cancel?: boolean) => ReturnType<F>;
    /** Check whether debouncing is still active. */
    3: () => boolean;
}

/**
 * Type of the function created with `getDebouncedFnc`.
 */
interface IDebouncedFunction<F extends (...args: AnyType) => AnyType> {
    (...args: Parameters<F>): Promise<ReturnType<F>>;
}

/**
 * Creates a function that is called with a delay of `timeout` milliseconds via debouncing. If this
 * function is called several times *before* `timeout` has expired, the timeout is reset each time
 * and the call is delayed again by `timeout` milliseconds.
 * @param fnc The function that is to be called with a delay (as a promise).
 * @param timeout Time in milliseconds after which `fnc` is to be called.
 * @param immediateLeadingInvoke If `true`, then the *first* call of `fnc` is executed *without*
 * delay, all *further* calls are then executed with delay. After `fnc` has been called with a
 * delay, the next call to `fnc` is executed immediately and so on. This option is therefore
 * suitable for bundling groups of calls that are further apart in time so that the first call of
 * `fnc` at the beginning of a group is executed immediately and only the subsequent calls are
 * delayed. Default: `false`.
 * @returns An array with four elements:
 *
 * - First element (function): A function with the same signature as the function passed to
 *   `getDebouncedFnc()`. This is the function that must be called in order to actually call the
 *   passed function (`fnc()`).
 * - Second element (function): This function can be used to cancel debouncing, i.e. `fnc()` is
 *   never called and debouncing starts again only if `fnc()` is called again.
 * - Third element (function): Calls the initially passed function (`fnc()`) immediately. With the
 *   parameter `true` the debouncing is aborted at the same time, otherwise `fnc()` is called again
 *   later.
 * - Fourth element (function): Checks whether debouncing is still active, i.e. `fnc()` is still
 *   waiting for its delayed call.
 *
 * Largely adopted (and expanded) from:
 * @see https://github.com/Bwca/np__merry-solutions__debounce
 *
 * The following example displays `bar` and `rab` on the console almost immediately and again `bar`
 * after approx. 5 seconds.
 * @example
 * function reverseFnc(s: string): string {
 *     console.log(s);
 *     return s.split("").reverse().join("");
 * }
 *
 * const [reverse, _, immediate] = getDebouncedFnc(reverseFnc, 5000, false);
 *
 * reverse("foo");
 * reverse("bar");
 * console.log(immediate(false));
 */
export function getDebouncedFnc<F extends (...args: AnyType) => AnyType>(fnc: F, timeout: number, immediateLeadingInvoke: boolean = false): IDebounceFunctionReturn<F> {
    let timeoutHandler: ReturnType<typeof setTimeout> | undefined = undefined;
    let _args: Parameters<F>;
    let leadingInvoked = false;

    const _clearTimeout = (): void => { // eslint-disable-line jsdoc/require-jsdoc
        timeoutHandler && clearTimeout(timeoutHandler);
        timeoutHandler = undefined;
    };

    const debouncedFnc: IDebouncedFunction<F> = (...args: Parameters<F>): Promise<ReturnType<F>> => // eslint-disable-line jsdoc/require-jsdoc
        new Promise((resolve: (value: ReturnType<F> | PromiseLike<ReturnType<F>>) => void): void => {
            _args = args;
            _clearTimeout();
            if (immediateLeadingInvoke && !leadingInvoked) {
                leadingInvoked = true;
                resolve(fnc(...args as AnyType[])); // eslint-disable-line @typescript-eslint/no-unsafe-argument
            } else {
                timeoutHandler = setTimeout((): void => {
                    _clearTimeout();
                    leadingInvoked = false;
                    resolve(fnc(...args as AnyType[])); // eslint-disable-line @typescript-eslint/no-unsafe-argument
                }, timeout);
            }
        });

    const cancel: () => void = (): void => { // eslint-disable-line jsdoc/require-jsdoc
        _clearTimeout();
    };

    const immediate: (cancel?: boolean) => ReturnType<F> = (cancel: boolean = true): ReturnType<F> => { // eslint-disable-line jsdoc/require-jsdoc
        cancel && _clearTimeout();
        return fnc(..._args as AnyType[]); // eslint-disable-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-argument
    };

    const active: () => boolean = (): boolean => { // eslint-disable-line jsdoc/require-jsdoc
        return timeoutHandler !== undefined;
    };

    return [debouncedFnc, cancel, immediate, active];
}

/** Type of a UUID. */
export type UUID = `${string}-${string}-${string}-${string}-${string}`;

/**
 * A function that returns a UUID.
 * @returns A UUID in RFC version 4 format.
 */
export const generateUUID: () => UUID =
    typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID.bind(crypto)
        : () => {
            return <UUID>"10000000-1000-4000-8000-100000000000".replace(/[018]/g, c =>
                (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
            );
        };

/**
 * A function that returns a string starting with `_` followed by six random alphanumeric
 * characters. The intended use case is to create unique IDs for HTML elements. The characters are
 * chosen out of the range `0` to `9` and `a` to `z` so a result could be `_j9e20f`. This function
 * is also used internally for generating IDs for components where an ID is needed/recommended but
 * not explicitly provided.
 * @returns A string starting with `_` followed by six random alphanumeric characters.
 */
export const cid = (): string => {
    return "_" + Math.floor(Math.random() * 2176782336 /* 36 ** 6 */).toString(36).padStart(6, "0");
};

/**
 * Checks if an object has a property with the value `undefined`.
 * @param obj The object to be checked.
 * @param prop The (name of the) property to be checked.
 * @returns `true` if `obj` has a property `prop` with the value `undefined`, otherwise `false`.
 */
export function isUndefined(obj: Record<string | number | symbol, AnyType>, prop: string | number | symbol): boolean {
    return Object.hasOwn(obj, prop) && obj[prop] === undefined;
}

/**
 * Checks if an object has a property with the value `null`.
 * @param obj The object to be checked.
 * @param prop The (name of the) property to be checked.
 * @returns `true` if `obj` has a property `prop` with the value `null`, otherwise `false`.
 */
export function isNull(obj: Record<string | number | symbol, AnyType>, prop: string | number | symbol): boolean {
    return Object.hasOwn(obj, prop) && obj[prop] === null;
}

/**
 * Sets the value of an optional property from an object on another object of the same type. A
 * common use case is to update/create a property of an existing options or configuration object.
 * The function works as follows:
 * - After execution `on` will _always_ have a property `prop`.
 * - If neither `from` nor `on` has `prop` the value of `on[prop]` will be set to `def`.
 * - If `from` _does not_ have the property `prop` at all, the future value of `on[prop]` depends on
 *   the current existence of `prop` in `on`: If it doesn't already exist its value will be set to
 *   `def`, otherwise `on[prop]` remains unchanged.
 * - If `from` _does_ have the property `prop` but with the value of `undefined`, `on[prop]` will be
 *   set to `def`.
 * - If `from` _does_ have the property `prop` and its value is unequal to `undefined`, `on[prop]`
 *   will be set to `from[prop]`.
 * @param from The object from which the property value is to be taken.
 * @param on The object on which the taken property value is to be set.
 * @param prop The (name of the) property that has the value to be set.
 * @param def The default value for the property if
 * - `prop` exists in `from` _and_ has the value `undefined` or
 * - neither `from` nor `on` has the property `prop`.
 */
export function setProp<T extends Record<string | number | symbol, AnyType>, K extends keyof T>(from: T, on: T, prop: K, def: Exclude<T[K], undefined>): void {
    on[prop] = getProp(from, on, prop, def);
}

/**
 * Gets the value of an optional property from an object, taking into account an existing object of
 * the same type. A common use case is to update/create a property of an existing options or
 * configuration object with the value returned from this function. The function works as follows:
 * - If neither `from` nor `ref` has `prop` the returned value is `def`.
 * - If `from` _does not_ have the property `prop` at all, the returned value depends on the
 *   current existence of `prop` in `ref`: If it doesn't already exist the returned value is `def`,
 *   otherwise the returned value is `ref[prop]`.
 * - If `from` _does_ have the property `prop` but with the value of `undefined`, the returned value
 *   is `def`.
 * - If `from` _does_ have the property `prop` and its value is unequal to `undefined`, the returned
 *   value is `from[prop]`.
 * @param from The object from which the property value is to be returned.
 * @param ref The object which may contain the current value of `prop` or not.
 * @param prop The (name of the) property that is to be returned.
 * @param def The default value for the property if
 * - `prop` exists in `from` _and_ has the value `undefined` or
 * - neither `from` nor `ref` has the property `prop`.
 * @returns A value depending on the content of `from` and `ref` as described above.
 */
export function getProp<T extends Record<string | number | symbol, AnyType>, K extends keyof T>(from: T, ref: T, prop: K, def: Exclude<T[K], undefined>): Exclude<T[K], undefined> {
    return isUndefined(from, prop)
        ? def
        : from[prop] ?? ref[prop] ?? def;
}
// #endregion
//////////////////////////////
