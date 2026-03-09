console.time("app init");

import { AComponent } from "../../src/Classes.js";
import {
    CSSClassNameFactory,
    ElementComponentWithChildren,
    WrappedDOMElementComponentWithChildren
} from "../../src/Components.js";
import {
    mixinComponentFactories
} from "../../src/Utils.js";
import {
    Button,
    ButtonFactory,
    HrFactory,
    LabeledContainerFactory,
    LabeledPasswordInputFactory,
    LabeledTextInputFactory,
    LoginComponentFactory,
    TextComponent
} from "./lib.js";


// This combined class factory makes it easier to create components from the various component
// factories. It also applies a default CSS class name to all created components.
const $ = new (mixinComponentFactories(
    CSSClassNameFactory,
    LabeledContainerFactory,
    LabeledTextInputFactory,
    LabeledPasswordInputFactory,
    ButtonFactory,
    HrFactory,
    LoginComponentFactory)
    // For these two constructor parameters see class `CSSClassNameFactory` in `Components.ts`.
    // `vts` => prefix for applied CSS class names.
    // `deep = true`, apply CSS class names recursively.
)("vts", true);

// A button that destroys the given component and itself when clicked.
const getDestroyButton = (componentToDestroy: AComponent): Button => {
    const btn = $.button("Destroy login component and this button").on("click", () => {
        componentToDestroy.dispose();
        btn.dispose();
    });
    return btn;
};

// The root component for the whole app, attached to the document body. We use this to be able to
// mount/append other components to it, but of course you could also mount/append directly to the
// document body or any other element  using the `DOM` property if you like (see below for the
// `<hr>` component/element).
const appRoot = new WrappedDOMElementComponentWithChildren(document.body);


////////////////////////
// Alternative 1
////////////////////////

/**
 * This alternative shows how to create and assemble a component adhoc out of existing basic general
 * purpose components. This is OK if the component isn't needed elsewhere and only needed once, but
 * in most cases you'd create a dedicated separate component (see class `LoginComponent` in file
 * `lib.ts`).
 */

// We need instances of and references to these subcomponents.
// User name input.
const userName = $.labeledTextInput("username", "username", "User name", "", "Enter user name");
// Password input.
const password = $.labeledPasswordInput("password", "password", "Password", "", "Enter password");

// Create and assemble an adhoc login component.
const loginComponent =
    // The outer labeled container for the user name input, the password input and the login button.
    $.labeledContainer("Login").append( // `append` mounts all given children to the labeled container.
        userName,
        password,
        // Login button.
        $.button("Login").on("click", () => {
            alert(`-- Full disclosure --\nUser name: ${userName.Input.Value}\nPassword: ${password.Input.Value}`);
        })
    );

// Mount/append a heading and the adhoc login component to the document body.
appRoot.append(
    // This is just to show that you can also create and use components on the fly without creating
    // a dedicated class for them, but in a real world scenario of course you would also create a
    // dedicated `h2`-component.
    new ElementComponentWithChildren("h2").append(
        new TextComponent("Assembled manually on demand from bare bones base components")
    ),
    loginComponent,
    getDestroyButton(loginComponent)
);


// Just to separate the two alternatives in the UI.
appRoot.append($.hr());
// The following is equivalent to the above, it just shows how you can also use the `DOM` property
// of components to directly mount them to native HTML elements in the page. But note that doing so
// means that the component won't be part of the `appRoot` component tree and won't be able to use
// features like automatic disposal, so in most cases it's better to mount/append to a Vanilla.ts
// component instead of directly to the document body or other native HTML elements.
// document.body.append($.hr().DOM);


////////////////////////
// Alternative 2
////////////////////////

/**
 * This alternative uses a dedicated `LoginComponent` class (see file `lib.ts`) that already has the
 * needed subcomponents built in and ready to use. This is the way to go if you need the component
 * more than once or if you want to reuse it in different contexts, but of course you can also
 * create and use a dedicated component for a single use if you like.
 */

// Build and mount UI 2 to the document body.
const loginComponent2 = $.loginComponent({ UNId: "username2", UNName: "username2", PWDId: "password2", PWDName: "password2" });
loginComponent2.LoginButton.on("click", () => {
    alert(`-- Full disclosure --\nUser name: ${loginComponent2.UserName}\nPassword: ${loginComponent2.Password}`);
});

appRoot.append(
    // See comment for the `h2`-component in alternative 1.
    new ElementComponentWithChildren("h2").append(
        new TextComponent("As a component ready for use")
    ),
    loginComponent2,
    getDestroyButton(loginComponent2)
);

console.timeEnd("app init");
