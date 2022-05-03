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
    btPush.disabled;
    const ShoplistItem = new Parse.Object("ShoplistItem");

    let item = inputItem.value;
    let quantity = parseInt(inputQty.value);

    for (let i = 0; i < itemList.length; i++) {
        if (item === itemList[i].item) {
            let response = await confirmAdd();
            if (response) {
                ShoplistItem.set("objectId", itemList[i].id);
                quantity += itemList[i].quantity;
                break;
            } else {
                return;
            }
        }
    }

    ShoplistItem.set("item", item);
    ShoplistItem.set("quantity", quantity);

    try {
        let result = await ShoplistItem.save();
        console.log("Novo objeto criado na classe \'ShoplistItem\' de ID: " + result.id);
    } catch (error) {
        console.error("Falha em criar novo objeto. Erro de código: " + error);
    }

    inputItem.value = "";
    inputQty.value = "";

    btPush.disabled = false;

    pullItems();
};

const card = document.querySelector(".card-background")

function confirmAdd () {
    card.style.display = "block";

    const btNo = document.getElementById("cardNo");
    const btYes = document.getElementById("cardYes");

    let response = null;

    btNo.onclick = () => {
        response = yesOrNo(btNo);
        card.style.display = "none";
    }

    btYes.onclick = () => {
        response = yesOrNo(btYes);
        card.style.display = "none";
    }

    return response;
}

function yesOrNo (button) {
    if (button.value == "yes") {
        return true;
    } else {
        return false;
    }
}

const pullItems = async () => {
    const ShoplistItem = Parse.Object.extend("ShoplistItem");
    const query = new Parse.Query(ShoplistItem);

    try {
        const results = await query.find();
        itemList = [];

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