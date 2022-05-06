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
    inputQty.value = "1";

    const ShoplistItem = new Parse.Object("ShoplistItem");

    let exit = false;
    let add = false;

    for (let i = 0; i < itemList.length; i++) {
        if (item === itemList[i].item) {
            await confirmAdd(itemList[i].quantity, quantity).then (
                function (value) {
                    if (value === true) {
                        ShoplistItem.set("objectId", itemList[i].id);
                        quantity += itemList[i].quantity;

                        document.querySelector("#qty_" + itemList[i].id).innerHTML = quantity;

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

const card = document.querySelector(".card-background");

const btNo = document.getElementById("cardNo");
const btYes = document.getElementById("cardYes");

const confirmAdd = async (oldQty, newQty) => {
    const qty1 = document.getElementById("qty1");
    const qty2 = document.getElementById("qty2");

    qty1.innerHTML = `${oldQty}`;
    qty2.innerHTML = `${oldQty + newQty}`;

    card.style.display = "block";

    let response = null;

    btNo.onclick = () => {
        response = false;
    }

    btYes.onclick = () => {
        response = true;
    }

    while (response === null) {
        await sleep(1000);
    }

    card.style.display = "none";

    console.clear();

    return response;
}

function sleep(ms) {
    console.log("Aguardando...");
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
        const itemQty = document.createElement("span");
        const itemName = document.createElement("span");

        itemQty.setAttribute("id", "qty_" + itemList[i].id);

        itemQty.style.marginRight = "5px";

        let qty = document.createTextNode(
            `${itemList[i].quantity}`
        );

        let name = document.createTextNode(
            `${itemList[i].item}`
        );

        itemQty.appendChild(qty);
        itemName.appendChild(name);

        const btDelete = document.createElement("button");
        const btCheck = document.createElement("button");

        btDelete.setAttribute("value", itemList[i].id);
        btCheck.setAttribute("value", itemList[i].id);

        btDelete.classList.add("delete-button");
        btCheck.classList.add("check-button");

        btDelete.setAttribute("onclick", "deleteFromHtml(this.value)");

        const bulletPoint = document.createElement("span");

        bulletPoint.setAttribute("id", "item_" + itemList[i].id);

        bulletPoint.classList.add("bullet-point");
        bulletPoint.style.margin = "7px";

        bulletPoint.appendChild(itemQty);
        bulletPoint.appendChild(itemName);
        bulletPoint.appendChild(btDelete);
        bulletPoint.appendChild(btCheck);

        shoppingList.appendChild(bulletPoint);
    }
}

function deleteFromHtml (id) {
    document.querySelector("#item_" + id).remove();

    deleteItem(id);
}

const deleteItem = async (id) => {
    const ShoplistItem = new Parse.Object("ShoplistItem");

    ShoplistItem.set("objectId", id);

    try {
        let result = await ShoplistItem.destroy();
        console.log("Item de ID \'" + result.id + "\' deletado com sucesso.");
    } catch (error) {
        console.error("Erro ao deletar item. Erro de código: " + error);
    }
}

pullItems();

btPush.onclick = pushItems;