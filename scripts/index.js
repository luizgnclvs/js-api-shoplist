const signInForm = document.querySelector("[name=signin]");
const signUpForm = document.querySelector("[name=signup]");
const resetForm = document.querySelector("[name=reset]");

signInForm.addEventListener("submit", (event) => {
    event.preventDefault();
    new FormData(signInForm);
});

signUpForm.addEventListener("submit", (event) => {
    event.preventDefault();
    new FormData(signUpForm);
});

resetForm.addEventListener("submit", (event) => {
    event.preventDefault();
    new FormData(resetForm);
});

signInForm.addEventListener("formdata", (event) => {
    let data = event.formData;
    signInForm.reset();
    signIn(data);
});

signUpForm.addEventListener("formdata", (event) => {
    let data = event.formData;
    signUpForm.reset();
    signUp(data);
});

resetForm.addEventListener("formdata", (event) => {
    let data = event.formData;
    resetForm.reset();
    document.querySelector(".reset").style.display = "none";
    resetPassphrase(data);
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

const resetPassphrase = (data) => {
    Parse.User.requestPasswordReset(data.get("reset-email"));

    try {
        console.log("Requisição de redefinição de senha enviada com sucesso.");
        alert("Requisição enviada com sucesso. Verifique seu e-mail.");
    } catch (error) {
        console.error(`A requisição falhou. Erro de código: ${error.code} - ${error.message}`);
        alert("Falha na requisição. Você tem certeza que inseriu o e-mail correto?");
    }
};

document.getElementById("reset-passphrase").onclick = () => {
    document.querySelector(".reset").style.display = "flex";
};

document.querySelector(".container-head span.material-symbols-outlined").onclick = () => {
    document.querySelector(".reset").style.display = "none";
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
            form.previousElementSibling.reset();
        } else {
            element.nextElementSibling.style.color = "var(--primary-color)"
            element.nextElementSibling.style.backgroundColor = "var(--secondary-color)";
            form.nextElementSibling.style.display = "none";
            form.nextElementSibling.reset();
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

    object.reveal.addEventListener("touchstart", () => {
        object.input.setAttribute("type", "text");
        object.reveal.innerHTML = "visibility";
    });

    object.reveal.addEventListener("mouseup", () => {
        object.input.setAttribute("type", "password");
        object.reveal.innerHTML = "visibility_off";
        object.input.focus();
    });
    
    object.reveal.addEventListener("touchend", () => {
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

const btTheme = document.getElementById("theme-switch");

btTheme.onclick = () => {
    if (localStorage.getItem("theme") === "dark") {
        localStorage.setItem("theme", "light");
    } else {
        localStorage.setItem("theme", "dark");
    }
    setTheme();
};

const setTheme = () => {
    let theme = localStorage.getItem("theme");
    let root = document.querySelector(":root");

    if (theme === "dark") {
        root.style.setProperty("--primary-color", " #362222");
        root.style.setProperty("--secondary-color", "#c7bea2");
        root.style.setProperty("--header-color-1", "#9a9483");
        root.style.setProperty("--header-color-2", "#e5dcc3");
        root.style.setProperty("--body-color-1", "#171010");
        root.style.setProperty("--body-color-2", "#2b2b2b");

        btTheme.classList.add("dark-theme");
    } else {
        root.style.setProperty("--primary-color", " #c7bea2");
        root.style.setProperty("--secondary-color", "#362222");
        root.style.setProperty("--header-color-1", "#171010");
        root.style.setProperty("--header-color-2", "#2b2b2b");
        root.style.setProperty("--body-color-1", "#9a9483");
        root.style.setProperty("--body-color-2", "#e5dcc3");

        btTheme.classList.remove("dark-theme");
    }
};

clipHeader();
setTheme();
window.onresize = clipHeader;