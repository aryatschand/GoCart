if (sessionStorage.getItem('userKey') == null || sessionStorage.getItem('userKey') == "null") {
    window.location.href = "index.html";
}

if (sessionStorage.getItem('organizationKey') == null || sessionStorage.getItem('organizationKey') == "null") {
    window.location.href = "createOrganization.html";
}

let params = new URLSearchParams(document.location.search.substring(1));
let mySearch = params.get("search");
if (!mySearch) {
    firebase.database().ref(`organizations/${sessionStorage.getItem('organizationKey')}/carts`).on('child_added', addItemAuto);
} else {
    firebase.database().ref(`organizations/${sessionStorage.getItem('organizationKey')}/carts`).on('child_added', addItemSearch);
    console.log(mySearch);
}

const database = firebase.database().ref();
function updateListeners() {
    let removeButtons = document.querySelectorAll(".remove");
    for (let i = 0; i < removeButtons.length; i++) {
        removeButtons[i].addEventListener('click', remove);

    }
}

function removeAllCarts(){
    let r = confirm("Are you sure you want to remove all carts?");
    if (r == true) {
      removeAll();
    } else {
      console.log("cancelled");
    }
}

document.querySelector("#manageItemsButton").addEventListener("click", manageItemsRedirect);

function manageItemsRedirect() {
    event.preventDefault();
    window.location.href = "landing.html";
}

document.getElementById("addButton").addEventListener('click', addItem);
document.getElementById("removeAllItems").addEventListener('click', removeAllCarts);
document.getElementById("submitSearch").addEventListener('click', search);

// const value = {
//     items: {},
//     purchased: false,
//     rfidTag: "3721978",
//     name: "Cart 1"
// }

// database.child(`organizations/${sessionStorage.getItem('organizationKey')}/carts`).push(value);

function addItemAuto(data) {
    console.log(data);
    const dataVal = data.val();
    const rfidTag = dataVal.rfidTag;
    const name = dataVal.name;
    let addItemsHere = document.getElementById('addItemsHere');
    let tableElement = document.createElement("tr");
    tableElement.classList.add(rfidTag);
    tableElement.classList.add('tableElement');
    let rfidTagElement = document.createElement("th");
    let nameElement = document.createElement("th");
    let actions = document.createElement("th");
    let remove = document.createElement("button");
    remove.innerText = "REMOVE";
    remove.classList.add('remove');
    remove.classList.add(rfidTag);
    rfidTagElement.innerText = rfidTag;
    nameElement.innerText = name;
    actions.appendChild(remove);
    actions.classList.add('actions');
    tableElement.appendChild(rfidTagElement);
    tableElement.appendChild(nameElement);
    tableElement.appendChild(actions);
    addItemsHere.appendChild(tableElement);
    updateListeners();
}

function addItemSearch(data) {
    console.log(data);
    const dataVal = data.val();
    const rfidTag = dataVal.rfidTag;
    const name = dataVal.name;
    let addItemsHere = document.getElementById('addItemsHere');
    if (rfidTag.includes(mySearch) || name.toLowerCase().includes(mySearch.toLowerCase())) {
        let tableElement = document.createElement("tr");
        tableElement.classList.add(rfidTag);
        tableElement.classList.add('tableElement');
        let rfidTagElement = document.createElement("th");
        let nameElement = document.createElement("th");
        let actions = document.createElement("th");
        let remove = document.createElement("button");
        remove.innerText = "REMOVE";
        remove.classList.add('remove');
        remove.classList.add(rfidTag);
        rfidTagElement.innerText = rfidTag;
        nameElement.innerText = name;
        actions.appendChild(remove);
        actions.classList.add('actions');
        tableElement.appendChild(rfidTagElement);
        tableElement.appendChild(nameElement);
        tableElement.appendChild(actions);
        addItemsHere.appendChild(tableElement);
        updateListeners();
    }
}

firebase.database().ref(`organizations/${sessionStorage.getItem('organizationKey')}/carts`).on('child_removed', removeItemAuto);

let row;

function removeItemAuto(data) {
    const dataVal = data.val();
    row = document.getElementsByClassName(dataVal.rfidTag);
    console.log(row);
    document.getElementById('addItemsHere').removeChild(row[0]);
}

async function remove() {
    event.preventDefault();
    let idNum = event.target.classList[1];
    let myVal = await database.child(`organizations/${sessionStorage.getItem('organizationKey')}/carts`).orderByChild('rfidTag').equalTo(idNum).once("value");
    myVal = myVal.val();
    console.log(myVal);
    for (key in myVal) {
        firebase.database().ref(`organizations/${sessionStorage.getItem('organizationKey')}/carts/${key}`).remove();
    }
    let myValTwo = await database.child(`carts`).orderByChild('rfidTag').equalTo(idNum).once("value");
    myValTwo = myValTwo.val();
    console.log(myValTwo);
    for (key in myValTwo) {
        firebase.database().ref(`carts/${key}`).remove();
    }
}

async function removeAll() {
    event.preventDefault();
    firebase.database().ref(`organizations/${sessionStorage.getItem('organizationKey')}/carts/`).remove();
    let myVal = await database.child(`carts`).orderByChild('organizationKey').equalTo(sessionStorage.getItem('organizationKey')).once("value");
    myVal = myVal.val();
    console.log(myVal);
    for (key in myVal) {
        firebase.database().ref(`carts/${key}`).remove();
    }
}

async function addItem() {
    event.preventDefault();
    let tableElement = document.createElement("tr");
    tableElement.classList.add('addTable');
    let rfidTagElement = document.createElement("th");
    let nameElement = document.createElement("th");
    let actions = document.createElement("th");
    let cancel = document.createElement("button");
    cancel.innerText = "CANCEL";
    cancel.classList.add('cancel');
    let submit = document.createElement("button");
    submit.innerText = "SUBMIT";
    submit.classList.add('submit');
    let rfidTagAddField = document.createElement("input");
    rfidTagAddField.classList.add('rfidTagAddField');
    rfidTagAddField.placeholder = "RFID Tag #";
    let nameAddField = document.createElement("input");
    nameAddField.classList.add('nameAddField');
    nameAddField.placeholder = "Product Name";
    rfidTagElement.appendChild(rfidTagAddField);
    nameElement.appendChild(nameAddField);
    actions.appendChild(submit);
    actions.appendChild(cancel);
    tableElement.appendChild(rfidTagElement);
    tableElement.appendChild(nameElement);
    tableElement.appendChild(actions);
    addItemsHere.insertBefore(tableElement, addItemsHere.childNodes[2]);
    addButton.style.display = "none";
    document.querySelector('.cancel').addEventListener('click', cancelAdd);
    document.querySelector('.submit').addEventListener('click', addItemSubmit);
}

function cancelAdd() {
    event.preventDefault();
    let newRow = document.querySelector('.addTable');
    document.getElementById('addItemsHere').removeChild(newRow);
    addButton.style.display = "block";
}

async function addItemSubmit() {
    event.preventDefault();
    let newTagNum = document.querySelector('.rfidTagAddField').value;
    let newName = document.querySelector(".nameAddField").value;
    let myVal = await database.child(`carts`).orderByChild('rfidTag').equalTo(newTagNum).once("value");
    myVal = myVal.val();
    let myValTwo = await database.child(`organizations/${sessionStorage.getItem('organizationKey')}/carts/`).orderByChild('name').equalTo(newName).once("value");
    myValTwo = myValTwo.val();
    if (myVal) {
        alert(`RFID Tag # ${newTagNum} already exists.`);
    } else if (!(/^\d+$/.test(document.querySelector(".rfidTagAddField").value))) {
        alert(`Please enter a valid RFID tag number.`);
    } else if (document.querySelector(".nameAddField").value == "") {
        alert(`Please enter a valid cart name.`);
    } else if (myValTwo) {
        alert(`The cart name ${newName} already exists.`);
    } else {
        let newRow = document.querySelector('.addTable');
        let value = {
            rfidTag: document.querySelector(".rfidTagAddField").value,
            name: document.querySelector(".nameAddField").value,
            purchased: false
        }
        database.child(`organizations/${sessionStorage.getItem('organizationKey')}/carts`).push(value);
        let secondValue = {
            rfidTag: document.querySelector(".rfidTagAddField").value,
            name: document.querySelector(".nameAddField").value,
            purchased: false,
            organizationKey: sessionStorage.getItem('organizationKey')
        }
        database.child(`carts`).push(secondValue);
        document.getElementById('addItemsHere').removeChild(newRow);
        addButton.style.display = "block";
    }
}

async function importData() {
    let file = document.getElementById('addFile').files[0];
    if (file.type.match(/text\/csv/) || file.type.match(/vnd\.ms-excel/)) {
        fileReader = new FileReader();
        fileReader.onloadend = function () {

            jsonResult = csvJSON(this.result);

            let index = [];
            console.log(jsonResult);

            for (let x in jsonResult[0]) {
                index.push(x);
            }

            for (let i = 0; i < jsonResult.length; i++) {
                addItemsCSV(jsonResult[i][index[0]], jsonResult[i][index[1]]);
            }

            // var json = csvJSON(this.result);

            // var blob = new Blob([json], { type: 'application/json' });
            // var url = URL.createObjectURL(blob);
            // output.innerHTML = '<a href="' + url + '">JSON file</a>';



        };
        fileReader.readAsText(file);
    } else {
        alert("This file does not seem to be a CSV.");
    }
}

function csvJSON(csv) {
    let lines = csv.split("\n");
    let result = [];
    let headers = lines[0].split(",");
    for (let i = 1; i < lines.length; i++) {
        let obj = {};
        let currentline = lines[i].split(",");
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    }
    return result;
}

async function addItemsCSV(tagNum, name) {
    event.preventDefault();
    let myVal = await database.child(`carts`).orderByChild('rfidTag').equalTo(tagNum).once("value");
    myVal = myVal.val();
    let myValTwo = await database.child(`organizations/${sessionStorage.getItem('organizationKey')}/carts/`).orderByChild('name').equalTo(name).once("value");
    myValTwo = myValTwo.val();
    if (myVal) {
        alert(`RFID Tag # ${tagNum} already exists.`);
    } else if (!(/^\d+$/.test(tagNum))) {
        alert(`Please use a valid RFID tag number. Tag Number ${tagNum} is invalid.`);
    } else if (name == "") {
        alert(`Please use a valid cart name for tag number ${tagNum}.`);
    } else if (myValTwo) {
        alert(`The cart name ${name} already exists. (You attempted to assign this name to the cart with tag number ${tagNum}.)`);
    } else {
        let value = {
            rfidTag: tagNum,
            name: name,
            purchased: false
        }
        database.child(`organizations/${sessionStorage.getItem('organizationKey')}/carts`).push(value);
        let secondValue = {
            rfidTag: tagNum,
            name: name,
            purchased: false,
            organizationKey: sessionStorage.getItem('organizationKey')
        }
        database.child(`carts`).push(secondValue);
    }
}

function search() {
    event.preventDefault();
    window.location.href = `?search=${document.getElementById("cartSearch").value}`;
}