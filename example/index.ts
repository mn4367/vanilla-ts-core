import {
    buildComponentFactoryClass,
    CSSClassNameFactory,
    ElementComponentVoid,
    ElementComponentWithChildren,
    TextComponent,
    WrappedDOMElementComponentWithChildren
} from "../src/Components.js";
import {
    ButtonFactory,
    LabeledContainerFactory,
    LabeledPasswordInput,
    LabeledPasswordInputFactory,
    LabeledTextInput,
    LabeledTextInputFactory,
    LoginComponent,
    LoginComponentFactory
} from "./lib.js";


// Combined class factory
const $ = new (buildComponentFactoryClass(
    CSSClassNameFactory,
    LabeledContainerFactory,
    LabeledTextInputFactory,
    LabeledPasswordInputFactory,
    ButtonFactory,
    LoginComponentFactory)
    // For these two constructor parameters see class `CSSClassNameFactory` in `Components.ts`.
    // `vt` => prefix for applied CSS class names.
    // `deep = true`, apply CSS class names recursively.
)("vts", true);


////////////////////////
// Alternative 1
////////////////////////

/**
 * This alternative shows how to assemble a component adhoc out of existing basic general purpose
 * components. This is OK if the component isn't needed elsewhere and only needed once, but in most
 * cases you'd create a dedicated separate component (see class `LoginComponent` in file `lib.ts`).
 */

// We need references to these subcomponents.
let userName: LabeledTextInput;
let password: LabeledPasswordInput;
// Assemble adhoc login component.
const loginComponent =
    // The outer labeled container for the user name input, the password input and the login button.
    $.labeledContainer("Login").append( // `append` mounts all given children to the labeled container.
        // User name input.
        userName = $.labeledTextInput("username", "username", "User name", "", "Enter user name"),
        // Password input.
        password = $.labeledPasswordInput("password", "password", "Password", "", "Enter password"),
        // Login button.
        $.button("Login").on("click", () => {
            alert(`-- Full disclosure --\nUser name: ${userName.Input.Value}\nPassword: ${password.Input.Value}`);
        })
    );

// Wipe UI 1
let btnBye1 =
    $.button("Remove all").on("click", () => {
        loginComponent.dispose();
        btnBye1.dispose();
    });

// Mount/append a heading and the adhoc login component to the document body.
new WrappedDOMElementComponentWithChildren(document.body).append(
    new ElementComponentWithChildren("h2").append(new TextComponent("Assembled manually on demand from bare bones base components")),
    loginComponent,
    btnBye1,
);

// Do something else with the components created ...
console.log(userName, password, loginComponent, btnBye1);



////////////////////////
// Alternative 2
////////////////////////

/**
 * This alternative
 */

// Wipe UI 2
let btnBye2 =
    $.button("Remove all").on("click", () => {
        loginComponent2.dispose();
        btnBye2.dispose();
    });


// Build and mount UI 2 to the document body.
let loginComponent2: LoginComponent;
new WrappedDOMElementComponentWithChildren(document.body).append(
    new ElementComponentVoid("hr"),
    new ElementComponentWithChildren("h2").append(new TextComponent("As a component ready for use")),
    loginComponent2 = <LoginComponent>$.loginComponent({ UNId: "username2", UNName: "username2", PWDId: "password2", PWDName: "password2" }).LoginButton.on("click", () => {
        alert(`-- Full disclosure --\nUser name: ${loginComponent2.UserName}\nPassword: ${loginComponent2.Password}`);
    }).Parent,
    btnBye2
);

// Do something else with the components created ...
console.log(loginComponent2, btnBye2);
