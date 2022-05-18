Parse.serverURL = "https://parseapi.back4app.com";

Parse.initialize(
    "pKFaqVGBWNehVkuNPTOhgg1xeRniu8fasw2N2bwX",
    "f91Nk0ORFT21KBVbp5fndRj15AAkd3zD9qXWeMXz"
);

const signUpForm = document.querySelector("[name=signup]");

signUpForm.addEventListener("submit", (event) => {
    event.preventDefault();
    new FormData(signUpForm);
});

signUpForm.addEventListener("formdata", (event) => {
    let data = event.formData;
    signUpForm.reset();
    signUp(data);
});

const signUp = async (data) => {
    let newUser = new Parse.User();

    newUser.set("username", data.get("signup-username"));
    newUser.set("email", data.get("signup-email"));
    newUser.set("password", data.get("signup-passphrase"));

    try {
        await newUser.signUp();
        console.log(`Usuário de ID \'${newUser.id}\' e E-mail \'${newUser.get("email")}\' criado com sucesso.`);
    } catch (error) {
        console.error(`Falha ao realizar cadastro. Erro de código: ${error.code} - ${error.message}`);
    }
};

let passwords = [
    {reveal: document.getElementById("reveal-signup-passphrase"), 
    input: document.querySelector("[name=signup-passphrase]"),
    linkedInput: document.querySelector("[name=confirm-passphrase]")}, 
    {reveal: document.getElementById("reveal-confirm-passphrase"), 
    input: document.querySelector("[name=confirm-passphrase]"),
    linkedInput: document.querySelector("[name=signup-passphrase]")}
];

passwords.forEach(object => {
    object.reveal.addEventListener("mousedown", () => {
        object.input.setAttribute("type", "text");
    });

    object.reveal.addEventListener("mouseup", () => {
        object.input.setAttribute("type", "password");
        object.input.focus();
    });

    object.input.addEventListener("input", () => {
        if (object.input.value !== object.linkedInput.value) {
            document.querySelector("[name=signup-submit]").disabled = true;
            object.input.classList.add("invalid-input");
            object.linkedInput.classList.add("invalid-input");
        } else {
            document.querySelector("[name=signup-submit]").disabled = false;
            object.input.classList.remove("invalid-input");
            object.linkedInput.classList.remove("invalid-input");
        }
    });
});





const signInForm = document.getElementById("sign-in");

signInForm.addEventListener("submit", (event) => {
    event.preventDefault();
    new FormData(signInForm);
});

signInForm.addEventListener("formdata", (event) => {
    let data = event.formData;
    signInForm.reset();

    signIn(data);
});

const signIn = (data) => {
    let user = Parse.User
        .logIn(data.get("username"), data.get("passphrase"))
        .then((user) => {
            console.log(`Login do usuário de nome \'${user.username}\' e e-mail \'${user.email}\' realizado com sucesso.`);
        })
        .catch((error) => {
            console.error(`Falha ao realizar login. Erro de código: ${error.code} - ${error.message}`);
        });
};