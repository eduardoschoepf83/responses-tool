//Elements of DOM
let form = document.getElementById("form");
let itemInput = document.getElementById("item-input");
let titleImput = document.getElementById("title-input");
let msgError = document.getElementById("msg-error");
let items = document.getElementById("items");
let a = document.createElement('a');

//Attributes
let localstorageName = "data";
let data = new Map();

form.addEventListener("submit", (e) => {
    e.preventDefault();
    formValidation();
});

//When arriving on the home page, we have to check if the data are in localStorage.
function dataChecking() {
    var msg =   "Aucune donnée n'est enregistrée.\n\n" + 
                "Vous pouvez entrer les données de votre backup.json ici :\n\n";
    if (localStorage.getItem(localstorageName) === null) {
        var checking = prompt(msg);
        if (checking !== "") {
            localStorage.setItem(localstorageName, checking);
            assignItems();
        }
    } else {
        assignItems();
    };
    displayItems();
    backup();
};

//The function assigns the stored data to the Map object.
function assignItems() {
    var items = JSON.parse(localStorage.getItem(localstorageName));
    for (var i in items) {
        data.set(i, items[i])
    };
};

//The user has the possibility to save his data in json format.
function backup() {
    var jsonse = localStorage.getItem(localstorageName);
    var blob = new Blob([jsonse], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    a.href = url;
    a.download = "backup.json";
    a.textContent = "backup.json";
    document.getElementById('json').appendChild(a);
};

//We check if the input form is not empty.
function formValidation() {
    if (titleImput.value === "" || itemInput.value === "") {
        msgError.innerHTML = "Veuillez compléter le formulaire.";
    } else {
        msgError.innerHTML = "";
        addData();
    }
};

//Update the data of the Map object, as well as the localStorage.
function addData() {
    data.set(titleImput.value, itemInput.value);
    setLocalstorage();
    dataChecking();
};

//We go through the data and display it on the screen.
function displayItems() {
    items.innerHTML = "";
    const reversed = new Map(Array.from(data).reverse());
    reversed.forEach((item, key) => {
        return (items.innerHTML +=
            `<div id=${key} class="item-container">
                    <p class="title">${key}</span>
                    <p class="item">${item}</p>
                    <p class="options">
                    <i onClick="editItem(this)" class="fas fa-edit"></i>
                    <i onClick="deleteItem(this)" class="fas fa-trash-alt"></i>
                    </span>
                </div>`
        )
    });
    itemInput.value = titleImput.value = "";
};

//Each item in the list has a delete icon. By clicking on this icon, you can delete the item.
function deleteItem(e) {
    data.delete(e.parentElement.parentElement.id);
    e.parentElement.parentElement.remove();
    setLocalstorage();
    backup();
};

//Each item in the list is associated with an edit icon. By clicking on this icon, you can modify the item.
function editItem(e) {
    itemInput.value = e.parentElement.previousElementSibling.innerHTML;
    titleImput.value = e.parentElement.previousElementSibling.parentElement.id;
    data.delete(e.parentElement.parentElement.id);
    e.parentElement.parentElement.remove();
    setLocalstorage();
    backup();
};

function setLocalstorage() {
    localStorage.setItem(localstorageName, JSON.stringify(Object.fromEntries(data.entries())));
};