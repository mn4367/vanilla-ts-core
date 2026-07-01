import {
    ANodeComponent,
} from "./Classes.js";
import {
    INodeComponent
} from "./Interfaces.js";
import {
    AnyType
} from "./Types.js";


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
 * An event listener entry. This is the type which is used to add/remove event listeners on a
 * component by calling `on(...)`/`off(...)`. This is the component which is referred to in the
 * documentation of the `target` member.
 */
export interface IEventListener {
    /** The event type e.g. "click", "pointerdown", "my-event" */
    Type: string;
    /** The event callback function. */
    Listener: EventListener;
    /**
     * A wrapped event callback function. This property is only set if a listener has been installed
     * on a component using `once()`, otherwise it is `undefined`.
     */
    WrappedListener?: EventListener;
    /**
     * Event listener options.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
     */
    Options: boolean | AddEventListenerOptions | undefined;
    /**
     * `true`, if listener execution is temporarily suspended, otherwise `false`.
     */
    Suspended: boolean;
    /**
     * Auxiliary listeners associated with this event listener. Some events (e.g. `pointerhold`)
     * require the registration of multiple listeners to work properly, for example, a `pointerhold`
     * listener requires at least a `pointerdown` and a `pointerup` listener. In such cases, the
     * additional listeners that are required for the main listener to work properly are stored in
     * this property. Functions like `off()` and `suspend()` need access to these listeners.
     */
    AuxiliaryListeners?: IEventListener[];
}

/**
 * An event map that initially has no members.
 */
export interface EventMapVoid { } // eslint-disable-line @typescript-eslint/no-empty-object-type

/** Default event map for components. To be extended with further global events as needed. */
export interface DefaultEventMap extends HTMLElementEventMap {
    /** Occurs when the pointer is held down on a component. */
    "pointerhold": PointerHoldEvent;
};

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
     * `bubbles`, `cancelable` and `composed`. If `customEventInitDict` is `undefined`, `bubbles`
     * and `composed` are set to `true` and `cancelable` is set to `false`.
     */
    constructor(type: T, sender: S, eventData?: D, customEventInitDict?: EventInit) {
        super(type, {
            /* eslint-disable jsdoc/require-jsdoc */
            ...(customEventInitDict || DEFAULT_EVENT_INIT_DICT),
            detail: {
                Sender: sender,
                ...(eventData ? eventData : <D>{})
            }
            /* eslint-enable */
        });
    }

    /**
     * Shorthand for the getting the `detail` property of the event.
     * @returns The detail property of the event.
     */
    public get $(): { Sender: S; } & D { // eslint-disable-line jsdoc/require-jsdoc
        return this.detail;
    }
}

/**
 * Options for the `pointerhold` event listener. __Notes:__
 * - Adding a `pointerhold` event listener to nodes which are not of type `Element` (e.g. `Text` or
 *   `Comment`) works like, for example, adding a `click` handler to to such nodes: the handler will
 *   be installed, but most of the events are simply not fired since nodes of type `Node` do not
 *   support these kinds of events. If a `pointerhold` handler is registered (using
 *   `on("pointerhold")`) _without_ the options object an object with `{ Delay: 500, Interval:100,
 *   OnClick: false }` will be used as the default.
 * - Adding a `pointerhold` event listener using `once` usually makes no sense, the same is true, if
 *   `once: true` is set in the options object; in both cases the event would be fired only once.
 */
export type PointerHoldOptions = {
    /**
     * The delay in milliseconds before the `pointerhold` event is fired after the pointer is held
     * down. Values less than `0` or equal to `0` will be treated as `0`.\
     * Default: `500`.
     */
    Delay?: number;
    /**
     * The interval in milliseconds at which the `pointerhold` event is repeatedly fired while the
     * pointer is held down. If `Interval` has the value `undefined`, the `pointerhold` event will
     * only be fired _once_ after the initial delay, so the behavior is similar to a single delayed
     * `click` event (for which there may be exotic use cases). Values less than or equal to `0`
     * will be treated as `0`, meaning that the event will be fired as fast as possible while the
     * pointer is held down.\
     * Default: `100`.
     */
    Interval?: number;
    /**
     * Whether the `pointerhold` event should also be fired on a regular `click` event. This is
     * useful for cases where the user wants to handle both a 'regular' single click and a pointer
     * hold in the same way. If `OnClick` is set to `true`, the `pointerhold` event will be fired
     * while the pointer is held down as well as on a regular click, provided `Delay` and `Interval`
     * don't conflict with the time span between `pointerdown` and `pointerup` events.\
     * Default: `false`.
     */
    OnClick?: boolean;
};

/** Custom 'pointerhold' event for components. */
export class PointerHoldEvent extends ACustomComponentEvent<"pointerhold", ANodeComponent<Node>> {
    /**
     * Create PointerHoldEvent event.
     * @param sender The event emitter.
     * @param customEventInitDict Optional event properties.
     */
    constructor(sender: ANodeComponent<Node>, customEventInitDict: EventInit = DEFAULT_CANCELABLE_EVENT_INIT_DICT) {
        super("pointerhold", sender, {}, customEventInitDict);
    }

    /**
     * Sets up additional necessary pointer hold handlers.
     * @param owner The `ANodeComponent<Node>` that owns the DOM element.
     * @param options Options for the pointer hold handler (received from `on()` and `once()`).
     * @returns The additional two `IEventListener` objects.
     */
    public static setupAuxiliaryListeners<EventMap extends EventMapVoid>(owner: ANodeComponent<Node, EventMap>, options?: boolean | AddEventListenerOptions & PointerHoldOptions): IEventListener[] {
        if (!(owner.DOM instanceof Element)) {
            return [];
        }
        let delay: number = 500;
        let interval: number | undefined = 100;
        let onClick = false;
        let once: boolean | undefined = undefined;
        if (typeof options === "object") {
            delay = "Delay" in options
                ? options.Delay === undefined ? 500 : Math.max(options.Delay, 0)
                : 500;
            interval = "Interval" in options
                ? options.Interval === undefined ? undefined : Math.max(options.Interval, 0)
                : 100;
            onClick = options.OnClick ?? false;
            once = "once" in options ? options.once : undefined;
        }
        let delayID: ReturnType<typeof setTimeout> | undefined = undefined;
        let intervalID: ReturnType<typeof setInterval> | undefined = undefined;
        const listenerOpts: AddEventListenerOptions = { capture: true }; // eslint-disable-line jsdoc/require-jsdoc
        once !== undefined && (listenerOpts.once = once);
        let pointerHoldEventFired = false;
        const result: IEventListener[] = [];

        if (onClick) {
            const clickFnc = (_ev: PointerEvent) => { // eslint-disable-line jsdoc/require-jsdoc
                pointerHoldEventFired || owner.dispatch(new PointerHoldEvent(<ANodeComponent<Node>><unknown>owner));
                pointerHoldEventFired = false;
            };
            owner.DOM.addEventListener("click", clickFnc as (ev: Event) => void, listenerOpts);
            result.push({ Type: "click", Listener: <EventListener>clickFnc, Options: listenerOpts, Suspended: false }); // eslint-disable-line jsdoc/require-jsdoc
        }

        const pointerDownFnc = (ev: PointerEvent) => { // eslint-disable-line jsdoc/require-jsdoc
            (<Element>owner.DOM).setPointerCapture(ev.pointerId);
            delayID = setTimeout(() => {
                clearTimeout(delayID);
                owner.dispatch(new PointerHoldEvent(<ANodeComponent<Node>><unknown>owner));
                pointerHoldEventFired = true;
                if (interval !== undefined) {
                    intervalID = setInterval(() => {
                        pointerHoldEventFired = true;
                        owner.dispatch(new PointerHoldEvent(<ANodeComponent<Node>><unknown>owner));
                    }, interval);
                }
            }, delay);
        };
        owner.DOM.addEventListener("pointerdown", pointerDownFnc as (ev: Event) => void, listenerOpts);

        const pointerUpFnc = (ev: PointerEvent) => { // eslint-disable-line jsdoc/require-jsdoc
            (<Element>owner.DOM).releasePointerCapture(ev.pointerId);
            clearInterval(intervalID);
            clearTimeout(delayID);
        };
        owner.DOM.addEventListener("pointerup", pointerUpFnc as (ev: Event) => void, listenerOpts);

        result.push(
            /* eslint-disable jsdoc/require-jsdoc */
            { Type: "pointerdown", Listener: <EventListener>pointerDownFnc, Options: listenerOpts, Suspended: false },
            { Type: "pointerup", Listener: <EventListener>pointerUpFnc, Options: listenerOpts, Suspended: false }
            /* eslint-enable */
        );
        return result;
    }
}
