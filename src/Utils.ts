
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
        keys.AltGr = event.getModifierState?.("AltGraph");
        keys.Meta = event.metaKey;
        // For support of the following statuses, see:
        // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/getModifierState
        keys.Fn = event.getModifierState?.("Fn");
        keys.CapsLock = event.getModifierState?.("CapsLock");
        keys.NumLock = event.getModifierState?.("NumLock");
        keys.ScrollLock = event.getModifierState?.("ScrollLock");
    };
    window.addEventListener("keydown", (event: KeyboardEvent) => update(event), { capture: true }); // eslint-disable-line jsdoc/require-jsdoc
    window.addEventListener("keyup", (event: KeyboardEvent) => update(event), { capture: true }); // eslint-disable-line jsdoc/require-jsdoc
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
