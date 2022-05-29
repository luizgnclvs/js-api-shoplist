Parse.serverURL = "https://parseapi.back4app.com";

Parse.initialize(
    "pKFaqVGBWNehVkuNPTOhgg1xeRniu8fasw2N2bwX",
    "f91Nk0ORFT21KBVbp5fndRj15AAkd3zD9qXWeMXz"
);

const signInForm = document.querySelector("[name=signin]");

signInForm.addEventListener("submit", (event) => {
    event.preventDefault();
    new FormData(signInForm);
});

signInForm.addEventListener("formdata", (event) => {
    let data = event.formData;
    signInForm.reset();
    signIn(data);
});

const signIn = async (data) => {
    try {
        let user = await Parse.User.logIn(data.get("signin-username"), data.get("signin-passphrase"))
        console.log(`Login do usuário de nome \'${user.get("username")}\' e e-mail \'${user.get("email")}\' realizado com sucesso.`);
        location.href = "./html/app.html"
    } catch (error) {
            console.error(`Falha ao realizar login. Erro de código: ${error.code} - ${error.message}`);
            if (error.code === 205) {
                alert("Por favor, verifique seu e-mail.");
            }
    }
};

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

const btResetPassword = document.getElementById("reset-passphrase");

const resetForm = document.querySelector("[name=reset]");

resetForm.addEventListener("submit", (event) => {
    event.preventDefault();
    new FormData(resetForm);
});

resetForm.addEventListener("formdata", (event) => {
    let data = event.formData;
    resetForm.reset();
    document.querySelector(".reset").style.display = "none";
    resetPassphrase(data);
});

btResetPassword.onclick = () => {
    document.querySelector(".reset").style.display = "flex";
};

const resetPassphrase = (data) => {
    Parse.User.requestPasswordReset(data.get("reset-email"));

    try {
        console.log("Requisição de redefiniçaõ de senha enviada com sucesso.");
        alert("Requisição enviada com sucesso. Verifique seu e-mail.");
    } catch (error) {
        console.error(`A requisição falhou. Erro de código: ${error.code} - ${error.message}`);
        alert("Falha na requisição. Você tem certeza que inseriu o e-mail correto?");
    }
};

document.querySelector(".container-head").childNodes.forEach(element => {
    element.addEventListener("click", () => {
        let index = Array.from(element.parentElement.children).indexOf(element);
        let form = Array.from(element.parentElement.nextElementSibling.children)[index];

        element.style.color = "var(--secondary-color)"
        element.style.backgroundColor = "var(--primary-color)";

        if (element.previousElementSibling) {
            element.previousElementSibling.style.color = "var(--primary-color)";
            element.previousElementSibling.style.backgroundColor = "var(--secondary-color)";
            form.previousElementSibling.style.display = "none";
        } else {
            element.nextElementSibling.style.color = "var(--primary-color)"
            element.nextElementSibling.style.backgroundColor = "var(--secondary-color)";
            form.nextElementSibling.style.display = "none";
        }

        form.style.display = "flex";
    });
});

document.querySelectorAll(".container label").forEach(element => {
    element.addEventListener("click", () => {
        Array.from(element.children).forEach(child => {
            if (child.nodeName === "INPUT") {
                child.focus();
            }
        })
    });
});

let revealPasswords = [
    {reveal: document.getElementById("reveal-signup-passphrase"), 
    input: document.querySelector("[name=signup-passphrase]")},
    {reveal: document.getElementById("reveal-confirm-passphrase"), 
    input: document.querySelector("[name=confirm-passphrase]")},
    {reveal: document.getElementById("reveal-signin-passphrase"),
    input: document.querySelector("[name=signin-passphrase]")}
];

revealPasswords.forEach(object => {
    object.reveal.addEventListener("mousedown", () => {
        object.input.setAttribute("type", "text");
        object.reveal.innerHTML = "visibility";
    });

    object.reveal.addEventListener("mouseup", () => {
        object.input.setAttribute("type", "password");
        object.reveal.innerHTML = "visibility_off";
        object.input.focus();
    });
});

let matchPasswords = [
    {input: document.querySelector("[name=signup-passphrase]"),
    match: document.querySelector("[name=confirm-passphrase]"),
    label1: document.querySelector("[for=signup-passphrase]"),
    label2: document.querySelector("[for=confirm-passphrase]")},
    {input: document.querySelector("[name=confirm-passphrase]"),
    match: document.querySelector("[name=signup-passphrase]"),
    label1: document.querySelector("[for=confirm-passphrase]"),
    label2: document.querySelector("[for=signup-passphrase]")}
];

matchPasswords.forEach(object => {
    object.input.addEventListener("input", () => {
        if ((object.input.value !== object.match.value) && object.input.value !== "" && object.match.value !== "") {
            document.querySelector("[name=signup-submit]").disabled = true;
            document.querySelector("[name=signup-submit]").value = "Confira as Senhas";
            object.label1.classList.add("invalid");
            object.label2.classList.add("invalid");
        } else {
            document.querySelector("[name=signup-submit]").disabled = false;
            document.querySelector("[name=signup-submit]").value = "Criar Conta";
            object.label1.classList.remove("invalid");
            object.label2.classList.remove("invalid");
        }
    });
});

document.querySelector(".container-head span.material-symbols-outlined").onclick = () => {
    document.querySelector(".reset").style.display = "none";
};

const clipHeader = () => {
    let width = window.innerWidth;
    let segments = Math.floor(width / 80);

    if (segments % 2 === 0) {
        segments++;
    }

    let clipPath = [];
    clipPath[0] = "polygon(0 30px";
    clipPath[segments] = " 100% 0";
    clipPath[segments + 1] = " 100% calc(100% - 30px)";
    clipPath[segments * 2 + 1] = " 0 100%)";

    for (let i = 1; i < segments; i++) {
        if (i % 2 === 0) {
            clipPath[i] = " " + (100 / segments * i) + "% 30px";
            clipPath[((segments * 2) + 1) - i] = " " + (100 / segments * i) + "% 100%";
        } else {
            clipPath[i] = " " + (100 / segments * i) + "% 0";
            clipPath[((segments * 2) + 1) - i] = " " + (100 / segments * i) + "% calc(100% - 30px)";
        }
    }

    document.querySelector(".header").style.clipPath = clipPath;
};

clipHeader();
window.onresize = clipHeader;