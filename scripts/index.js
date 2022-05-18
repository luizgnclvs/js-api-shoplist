Parse.serverURL = "https://parseapi.back4app.com";

Parse.initialize(
    "pKFaqVGBWNehVkuNPTOhgg1xeRniu8fasw2N2bwX",
    "f91Nk0ORFT21KBVbp5fndRj15AAkd3zD9qXWeMXz"
);

const signUpForm = document.querySelector("[name=signup]");
const inPassPhrase = document.querySelector("[name=signup-passphrase]");
const inConfirmPass = document.querySelector("[name=confirm-passphrase]");

signUpForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (inPassPhrase.value !== inConfirmPass.value) {
        inPassPhrase.classList.add("invalid-input");
        inConfirmPass.classList.add("invalid-input");
    } else {
        new FormData(signUpForm);
    }
});

signUpForm.addEventListener("formdata", (event) => {
    let data = event.formData;
    signUpForm.reset();

    for (const key of data.keys()) {
        console.log(`${key}: ${data.get(key)}`);
    }

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

const passReveal = document.getElementById("reveal-signup-passphrase");
const confirmPassReveal = document.getElementById("reveal-confirm-passphrase");

inPassPhrase.onfocus = () => {
    inPassPhrase.classList.remove("invalid-input");
    inConfirmPass.classList.remove("invalid-input");
};

inConfirmPass.onfocus = () => {
    inPassPhrase.classList.remove("invalid-input");
    inConfirmPass.classList.remove("invalid-input");
};

passReveal.onmousedown = () => {
    inPassPhrase.setAttribute("type", "text");
};

passReveal.onmouseup = () => {
    inPassPhrase.setAttribute("type", "password");
};

confirmPassReveal.onmousedown = () => {
    inConfirmPass.setAttribute("type", "text");
};

confirmPassReveal.onmouseup = () => {
    inConfirmPass.setAttribute("type", "password");
};





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