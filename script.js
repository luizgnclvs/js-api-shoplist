Parse.serverURL = "https://parseapi.back4app.com";

Parse.initialize(
    "pKFaqVGBWNehVkuNPTOhgg1xeRniu8fasw2N2bwX",
    "f91Nk0ORFT21KBVbp5fndRj15AAkd3zD9qXWeMXz"
);

const inItem = document.getElementById("item-description");
const inQuantity = document.getElementById("item-quantity");
const btAdd = document.getElementById("add-item");
const btMore = document.getElementById("more-itens");
const btLess = document.getElementById("less-itens");
const btMore2 = document.getElementById("more-itens-two");
const btLess2 = document.getElementById("less-itens-two");

btMore.onclick = () => {
    if (inQuantity.innerHTML < 99) {
        inQuantity.innerHTML++;
    }
};

btLess.onclick = () => {
    if (inQuantity.innerHTML > 1) {
        inQuantity.innerHTML--;
    }
};

btLess.ondblclick = () => {
    inQuantity.innerHTML = 1;
};

btMore2.onclick = () => {
    if (inQuantity.innerHTML < 98) {
        inQuantity.innerHTML = parseInt(inQuantity.innerHTML) + 2;
    }
};

btLess2.onclick = () => {
    if (inQuantity.innerHTML > 2) {
        inQuantity.innerHTML -= 2;
    }
};

let itemList = [];

const addNewItem = async () => {
    let item = inItem.value;
    let quantity = parseInt(inQuantity.value);

    inItem.value = "";
    inQuantity.value = "1";

    const newItem = new Parse.Object("ShoplistItem");

    let exitFunction = false;
    let addQuantity = false;

    for (let i = 0; i < itemList.length; i++) {
        if (item === itemList[i].item) {
            await confirmOption()
                .then ((response) => {
                    if (response === true) {
                        newItem.set("objectId", itemList[i].id);
                        quantity += itemList[i].quantity;

                        document.querySelector("#quantity_" + itemList[i].id).innerHTML = quantity;

                        addQuantity = true;
                    } else {
                        exitFunction = true;
                    }
                })
                .catch ((error) => {
                    console.error("Não foi possível adquirir resposta da caixa de diálogo. Erro de código: " + error);
                });
            break;
        }
    }

    if (exitFunction) {
        console.log("Operação encerrada");
        return;
    }

    newItem.set("item", item);
    newItem.set("quantity", quantity);

    try {
        let result = await newItem.save();

        if (addQuantity) {
            console.log(`A quantidade do objeto de ID \'${result.id}\' foi atualizada`);
        } else {
            console.log(`Novo item de ID \'${result.id}\' adicionado à classe \'ShoplistItem\'`);
        }
    } catch (error) {
        console.error("Falha em criar novo objeto. Erro de código: " + error);
    }

    pullItems();
};

const confirmbox = document.querySelector(".confirmbox-background");
const confirmboxText = document.getElementById("confirmbox-text");
const btNo = document.getElementById("confirmbox-no");
const btYes = document.getElementById("confirmbox-yes");

const confirmOption = async () => {
    confirmbox.style.display = "block";

    let confirmation = null;

    btNo.onclick = () => {
        confirmation = false;
    }

    btYes.onclick = () => {
        confirmation = true;
    }

    while (confirmation === null) {
        await sleep(1000);
    }

    confirmbox.style.display = "none";

    return confirmation;
};

const pullItems = async () => {
    const shoplistItem = Parse.Object.extend("ShoplistItem");
    const query = new Parse.Query(shoplistItem);

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

const shoppingList = document.getElementById("shoplist");

const showItems = () => {
    shoppingList.innerHTML = "";

    for (let i = 0; i < itemList.length; i++) {
        const itemQuantity = document.createElement("span");
        const itemName = document.createElement("span");
        const editName = document.createElement("input");
        const btEdit = document.createElement("span");
        const btDelete = document.createElement("span");
        const btAddCart = document.createElement("span");

        itemQuantity.setAttribute("id", "quantity_" + itemList[i].id);
        itemName.setAttribute("id", "name_" + itemList[i].id);
        editName.setAttribute("id", "inEdit_" + itemList[i].id);
        btEdit.setAttribute("id", "edit_" + itemList[i].id);
        btDelete.setAttribute("id", "delete_" + itemList[i].id);
        btAddCart.setAttribute("id", "add-cart_" + itemList[i].id);

        btEdit.classList.add("material-symbols-outlined");
        btDelete.classList.add("material-symbols-outlined");
        btAddCart.classList.add("material-symbols-outlined");

        itemQuantity.innerHTML = `${itemList[i].quantity}`;
        itemName.innerHTML = `${itemList[i].item}`;
        btEdit.innerHTML = "edit";
        btDelete.innerHTML = "delete";
        btAddCart.innerHTML = "add_shopping_cart";

        btEdit.setAttribute("onclick", "editItem(this.id)");
        btDelete.setAttribute("onclick", "deleteItem(this.id)");
        btAddCart.setAttribute("onclick", "addToCart(this.id");

        const startBar = document.createElement("label");
        startBar.appendChild(itemQuantity);
        startBar.appendChild(itemName);
        startBar.appendChild(editName);

        const endBar = document.createElement("div");
        endBar.appendChild(btEdit);
        endBar.appendChild(btDelete);
        endBar.appendChild(btAddCart);

        const itemBar = document.createElement("li");
        itemBar.setAttribute("id", "item_" + itemList[i].id);

        itemBar.appendChild(startBar);
        itemBar.appendChild(endBar);

        shoppingList.appendChild(itemBar);
    }
};

const deleteItem = (id) => {
    id = idSplitter(id);
    document.querySelector("#item_" + id).remove();
    deleteItemAPI(id);
};

const deleteItemAPI = async (id) => {
    const deletedItem = new Parse.Object("ShoplistItem");

    deletedItem.set("objectId", id);

    try {
        let result = await deletedItem.destroy();
        console.log(`Item de ID \'${result.id}\' destruído com sucesso.`);
    } catch (error) {
        console.error("Erro ao destruir item. Erro de código: " + error);
    }
};

const editItem = () => {

};

const idSplitter = (id) => {
    return id.split("_")[1];
};

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};

pullItems();
btAdd.onclick = addNewItem;