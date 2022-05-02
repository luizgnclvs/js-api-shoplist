Parse.serverURL = "https://parseapi.back4app.com";

Parse.initialize(
    "pKFaqVGBWNehVkuNPTOhgg1xeRniu8fasw2N2bwX",
    "f91Nk0ORFT21KBVbp5fndRj15AAkd3zD9qXWeMXz"
);

const inputItem = document.getElementById("item");
const inputQty = document.getElementById("quantity");

const pushItems = async () => {
    const ShoplistItem = new Parse.Object("ShoplistItem");

    let item = inputItem.value;
    let quantity = parseInt(inputQty.value);

    ShoplistItem.set("item", item);
    ShoplistItem.set("quantity", quantity);

    try {
        let result = await ShoplistItem.save()
        console.log("Novo objeto criado na classe \'ShoplistItem\' de ID: " + result.id);
    } catch(error) {
        console.error("Falha em criar novo objeto. Erro de código: " + error);
    }

    inputItem.value = "";
    inputQty.value = "";

    pullItems();
};

let itemList = [];

const pullItems = async () => {
    const ShoplistItem = Parse.Object.extend("ShoplistItem");
    const query = new Parse.Query(ShoplistItem);

    try {
        const results = await query.find();
        itemList = [];

        for (const object of results) {
            const item = object.get("item");
            const quantity = object.get("quantity");

            itemList.push({item, quantity});
        }

        showItems();
    } catch (error) {
        console.error("Falha ao execeutar o fetch de \'ShoplistItem\'. Erro de código: ", error);
    }
};

const shoppingList = document.getElementById("list");

function showItems() {
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

const btPush = document.getElementById("push");

pullItems();
btPush.onclick = pushItems;