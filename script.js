Parse.serverURL = "https://parseapi.back4app.com";

Parse.initialize(
    "pKFaqVGBWNehVkuNPTOhgg1xeRniu8fasw2N2bwX",
    "f91Nk0ORFT21KBVbp5fndRj15AAkd3zD9qXWeMXz"
);

const inputItem = document.getElementById("item");
const inputQty = document.getElementById("quantity");
const btPush = document.getElementById("push");

let itemList = [];

const pushItems = async () => {
    let item = inputItem.value;
    let quantity = parseInt(inputQty.value);

    inputItem.value = "";
    inputQty.value = "";

    const ShoplistItem = new Parse.Object("ShoplistItem");

    let exit = false;
    let add = false;

    for (let i = 0; i < itemList.length; i++) {
        if (item === itemList[i].item) {
            await confirmAdd().then (
                function (value) {
                    if (value === true) {
                        ShoplistItem.set("objectId", itemList[i].id);
                        quantity += itemList[i].quantity;

                        add = true;
                    } else {
                        exit = true;
                    }
                },

                function(error) {
                    console.error("Não foi possível adquirir resposta da caixa de diálogo. Erro de código: " + error);

                }
            );

            break;
        }
    }

    if (exit) {
        return;
    }

    ShoplistItem.set("item", item);
    ShoplistItem.set("quantity", quantity);

    try {
        let result = await ShoplistItem.save();

        if (add) {
            console.log("Quantidade do objeto de ID \'" + result.id + "\' foi atualizada");
        } else {
            console.log("Novo objeto criado na classe \'ShoplistItem\' de ID: " + result.id);
        }
    } catch (error) {
        console.error("Falha em criar novo objeto. Erro de código: " + error);
    }

    btPush.disabled = false;

    pullItems();
};

const card = document.querySelector(".card-background")
const btNo = document.getElementById("cardNo");
const btYes = document.getElementById("cardYes");

const confirmAdd = async () => {
    card.style.display = "block";

    let response = null;

    btNo.onclick = () => {
        response = false;
    }

    btYes.onclick = () => {
        response = true;
    }

    while (response === null) {
        console.log("Aguardando...")
        await sleep(1000);
    }

    console.clear();

    card.style.display = "none";

    return response;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const pullItems = async () => {
    const ShoplistItem = Parse.Object.extend("ShoplistItem");
    const query = new Parse.Query(ShoplistItem);

    try {
        const results = await query.find();
        itemList = [];

        console.clear();

        for (const object of results) {
            const id = object.id;
            const item = object.get("item");
            const quantity = object.get("quantity");

            itemList.push({id, item, quantity});

            console.log(`ID: ${id}, Item: ${item}, Quantidade: ${quantity}`);
        }

        showItems();
    } catch (error) {
        console.error("Falha ao execeutar o fetch de \'ShoplistItem\'. Erro de código: ", error);
    }
};

const shoppingList = document.getElementById("list");

function showItems () {
    shoppingList.innerHTML = "";

    for (let i = 0; i < itemList.length; i++) {
        const li = document.createElement("li");
        const str = document.createTextNode(
            `${itemList[i].item} × ${itemList[i].quantity}`
        );

        li.appendChild(str);
        shoppingList.appendChild(li);
    }
}

pullItems();

btPush.onclick = pushItems;