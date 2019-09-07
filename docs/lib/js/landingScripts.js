if (sessionStorage.getItem('userKey') == null || sessionStorage.getItem('userKey') == "null") {
    window.location.href = "index.html";
}

if (sessionStorage.getItem('organizationKey') == null || sessionStorage.getItem('organizationKey') == "null") {
    window.location.href = "createOrganization.html";
}

let params = new URLSearchParams(document.location.search.substring(1));
let mySearch = params.get("search");
if (!mySearch) {
    firebase.database().ref(`organizations/${sessionStorage.getItem('organizationKey')}/rfidKeys`).on('child_added', addItemAuto);
} else {
    firebase.database().ref(`organizations/${sessionStorage.getItem('organizationKey')}/rfidKeys`).on('child_added', addItemSearch);
    console.log(mySearch);
}

const database = firebase.database().ref();
function updateListeners() {
    let removeButtons = document.querySelectorAll(".remove");
    // let modifyButtons = document.querySelectorAll(".modify");
    for (let i = 0; i < removeButtons.length; i++) {
        removeButtons[i].addEventListener('click', remove);

    }

    // for (let i = 0; i < modifyButtons.length; i++) {
    //     modifyButtons[i].addEventListener('click', modify);
    // }
}

document.getElementById("addButton").addEventListener('click', addItem);
document.getElementById("removeAllItems").addEventListener('click', removeAll);
document.getElementById("submitSearch").addEventListener('click', search);

// let modifyId;

// const value = {
//     rfidTag: "110497923",
//     productName: "Banana",
//     price: "$2.99",
//     productImage: "https://www.mariowiki.com/images/1/17/BananaDKCR.png"
// }

// database.child(`organizations/${sessionStorage.getItem('organizationKey')}/rfidKeys`).push(value);

function addItemAuto(data) {
    console.log(data);
    const dataVal = data.val();
    const rfidTag = dataVal.rfidTag;
    const productName = dataVal.productName;
    const price = dataVal.price;
    const productImage = dataVal.productImage;
    let addItemsHere = document.getElementById('addItemsHere');

    let tableElement = document.createElement("tr");
    tableElement.classList.add(rfidTag);
    tableElement.classList.add('tableElement');
    let rfidTagElement = document.createElement("th");
    let productNameElement = document.createElement("th");
    let priceElement = document.createElement("th");
    let imageElement = document.createElement("th");
    let image = document.createElement("img");
    let actions = document.createElement("th");
    let remove = document.createElement("button");
    // let modify = document.createElement("button");
    remove.innerText = "REMOVE";
    remove.classList.add('remove');
    remove.classList.add(rfidTag);
    // modify.innerText = "MODIFY";
    // modify.classList.add('modify');
    // modify.classList.add(rfidTag);
    image.src = productImage;
    image.style.width = '50px';
    image.style.height = 'auto';
    rfidTagElement.innerText = rfidTag;
    productNameElement.innerText = productName;
    priceElement.innerText = price;
    imageElement.appendChild(image);
    actions.appendChild(remove);
    actions.classList.add('actions');
    // actions.appendChild(modify);
    tableElement.appendChild(rfidTagElement);
    tableElement.appendChild(productNameElement);
    tableElement.appendChild(priceElement);
    tableElement.appendChild(imageElement);
    tableElement.appendChild(actions);
    addItemsHere.appendChild(tableElement);
    updateListeners();
}

function addItemSearch(data) {
    console.log(data);
    const dataVal = data.val();
    const rfidTag = dataVal.rfidTag;
    const productName = dataVal.productName;
    const price = dataVal.price;
    const productImage = dataVal.productImage;
    let addItemsHere = document.getElementById('addItemsHere');
    if (rfidTag.includes(mySearch) || productName.toLowerCase().includes(mySearch.toLowerCase())) {
        let tableElement = document.createElement("tr");
        tableElement.classList.add(rfidTag);
        tableElement.classList.add('tableElement');
        let rfidTagElement = document.createElement("th");
        let productNameElement = document.createElement("th");
        let priceElement = document.createElement("th");
        let imageElement = document.createElement("th");
        let image = document.createElement("img");
        let actions = document.createElement("th");
        let remove = document.createElement("button");
        // let modify = document.createElement("button");
        remove.innerText = "REMOVE";
        remove.classList.add('remove');
        remove.classList.add(rfidTag);
        // modify.innerText = "MODIFY";
        // modify.classList.add('modify');
        // modify.classList.add(rfidTag);
        image.src = productImage;
        image.style.width = '50px';
        image.style.height = 'auto';
        rfidTagElement.innerText = rfidTag;
        productNameElement.innerText = productName;
        priceElement.innerText = price;
        imageElement.appendChild(image);
        actions.appendChild(remove);
        actions.classList.add('actions');
        // actions.appendChild(modify);
        tableElement.appendChild(rfidTagElement);
        tableElement.appendChild(productNameElement);
        tableElement.appendChild(priceElement);
        tableElement.appendChild(imageElement);
        tableElement.appendChild(actions);
        addItemsHere.appendChild(tableElement);
        updateListeners();
    }
}

firebase.database().ref(`organizations/${sessionStorage.getItem('organizationKey')}/rfidKeys`).on('child_removed', removeItemAuto);

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
    let myVal = await database.child(`organizations/${sessionStorage.getItem('organizationKey')}/rfidKeys`).orderByChild('rfidTag').equalTo(idNum).once("value");
    myVal = myVal.val();
    console.log(myVal);
    for (key in myVal) {
        firebase.database().ref(`organizations/${sessionStorage.getItem('organizationKey')}/rfidKeys/${key}`).remove();
    }
}

function removeAll() {
    event.preventDefault();
    firebase.database().ref(`organizations/${sessionStorage.getItem('organizationKey')}/rfidKeys/`).remove();
}

async function addItem() {
    event.preventDefault();
    let tableElement = document.createElement("tr");
    tableElement.classList.add('addTable');
    let rfidTagElement = document.createElement("th");
    let productNameElement = document.createElement("th");
    let priceElement = document.createElement("th");
    let imageElement = document.createElement("th");
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
    let productNameAddField = document.createElement("input");
    productNameAddField.classList.add('productNameAddField');
    productNameAddField.placeholder = "Product Name";
    let priceAddField = document.createElement("input");
    priceAddField.classList.add('priceAddField');
    priceAddField.placeholder = "Item Price";
    let imageAddField = document.createElement("input");
    imageAddField.classList.add('imageAddField');
    imageAddField.placeholder = "Item Image URL";
    rfidTagElement.appendChild(rfidTagAddField);
    productNameElement.appendChild(productNameAddField);
    priceElement.appendChild(priceAddField);
    imageElement.appendChild(imageAddField);
    actions.appendChild(submit);
    actions.appendChild(cancel);
    tableElement.appendChild(rfidTagElement);
    tableElement.appendChild(productNameElement);
    tableElement.appendChild(priceElement);
    tableElement.appendChild(imageElement);
    tableElement.appendChild(actions);
    // addItemsHere.appendChild(tableElement);
    addItemsHere.insertBefore(tableElement ,addItemsHere.childNodes[2   ]);
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
    let myVal = await database.child(`organizations/${sessionStorage.getItem('organizationKey')}/rfidKeys`).orderByChild('rfidTag').equalTo(newTagNum).once("value");
    myVal = myVal.val();
    if (myVal) {
        alert(`RFID Tag # ${newTagNum} is already in your inventory.`);
    } else if (!(/^\d+$/.test(document.querySelector(".rfidTagAddField").value))) {
        alert(`Please enter a valid RFID tag number.`);
    } else if (document.querySelector(".productNameAddField").value == "") {
        alert(`Please enter a valid product name.`);
    } else if (!(/^(\$)?\d+(\.\d\d)?$/.test(document.querySelector(".priceAddField").value))) {
        alert(`Please enter a valid price in the format 0 or 0.00.`);
    } else if (!((/.png$/.test(document.querySelector(".imageAddField").value)) || (/.jpg$/.test(document.querySelector(".imageAddField").value)) || (/.jpeg$/.test(document.querySelector(".imageAddField").value)) || document.querySelector(".imageAddField").value == "")) {
        alert(`Please enter a valid image url that ends in .png, .jpg, or .jpeg.`);
    } else {
        let newRow = document.querySelector('.addTable');
        let myImage;
        if (document.querySelector(".imageAddField").value == "") {
            myImage = "https://gocartapp.tech/assets/noProductImage.png";
        } else {
            myImage = document.querySelector(".imageAddField").value;
        }
        let myPrice;
        if (!(/^\$\d+(\.\d\d)?$/.test(document.querySelector(".priceAddField").value))) {
            myPrice = "$" + document.querySelector(".priceAddField").value;
        } else {
            myPrice = document.querySelector(".priceAddField").value;
        }
        let value = {
            rfidTag: document.querySelector(".rfidTagAddField").value,
            productName: document.querySelector(".productNameAddField").value,
            price: myPrice,
            productImage: myImage
        }
        database.child(`organizations/${sessionStorage.getItem('organizationKey')}/rfidKeys`).push(value);
        document.getElementById('addItemsHere').removeChild(newRow);
        addButton.style.display = "block";
    }
}

function importData() {
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
                addItemsCSV(jsonResult[i][index[0]], jsonResult[i][index[1]], jsonResult[i][index[2]], jsonResult[i][index[3]]);
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

async function addItemsCSV(tagNum, productName, price, productImage) {
    event.preventDefault();
    let myVal = await database.child(`organizations/${sessionStorage.getItem('organizationKey')}/rfidKeys`).orderByChild('rfidTag').equalTo(tagNum).once("value");
    myVal = myVal.val();
    if (myVal) {
        alert(`RFID Tag # ${tagNum} is already in your inventory.`);
    } else if (!(/^\d+$/.test(tagNum))) {
        alert(`Please use a valid RFID tag number. Tag Number ${tagNum} is invalid.`);
    } else if (productName == "") {
        alert(`Please use a valid product name.`);
    } else if (!(/^(\$)?\d+(\.\d\d)?$/.test(price))) {
        alert(`Please use a valid price in the format 0 or 0.00 for tag number ${tagNum}.`);
        // } else if (!((/.png$/.test(productImage)) || (/.jpg$/.test(productImage)) || (/.jpeg$/.test(productImage)) || productImage == "")) {
        //     alert(`Please use a valid image url that ends in .png, .jpg, or .jpeg for tag number ${tagNum}. Your image is ${productImage}`);
    } else {
        let myImage;
        if (productImage == "") {
            myImage = "https://gocartapp.tech/assets/noProductImage.png";
        } else {
            myImage = productImage;
        }
        let myPrice;
        if (!(/^\$\d+(\.\d\d)?$/.test(price))) {
            myPrice = "$" + price;
        } else {
            myPrice = price;
        }
        let value = {
            rfidTag: tagNum,
            productName: productName,
            price: myPrice,
            productImage: myImage
        }
        database.child(`organizations/${sessionStorage.getItem('organizationKey')}/rfidKeys`).push(value);
    }
}

function search() {
    event.preventDefault();
    window.location.href = `?search=${document.getElementById("productSearch").value}`;
}

// firebase.database().ref(`organizations/${sessionStorage.getItem('organizationKey')}/rfidKeys`).on('child_changed', modifyItemAuto);

// async function modify() {
//     event.preventDefault();
//     let idNum = event.target.classList[1];
//     modifyId = idNum;
//     let tableElement = event.target;
//     let rfidTagElement = document.createElement("th");
//     let productNameElement = document.createElement("th");
//     let priceElement = document.createElement("th");
//     let imageElement = document.createElement("th");
//     let actions = document.createElement("th");
//     let cancel = document.createElement("button");
//     cancel.innerText = "CANCEL";
//     cancel.classList.add('cancelModify');
//     let submit = document.createElement("button");
//     submit.innerText = "SUBMIT";
//     submit.classList.add('submitModify');
//     let rfidTagModifyField = document.createElement("input");
//     rfidTagModifyField.classList.add('rfidTagModifyField');
//     rfidTagModifyField.placeholder = "RFID Tag #";
//     let productNameModifyField = document.createElement("input");
//     productNameModifyField.classList.add('productNameModifyField');
//     productNameModifyField.placeholder = "Product Name";
//     let priceModifyField = document.createElement("input");
//     priceModifyField.classList.add('priceModifyField');
//     priceModifyField.placeholder = "Item Price";
//     let imageModifyField = document.createElement("input");
//     imageModifyField.classList.add('imageModifyField');
//     imageModifyField.placeholder = "Item Image URL";
//     rfidTagElement.appendChild(rfidTagModifyField);
//     productNameElement.appendChild(productNameModifyField);
//     priceElement.appendChild(priceModifyField);
//     imageElement.appendChild(imageModifyField);
//     actions.appendChild(submit);
//     actions.appendChild(cancel);
//     tableElement.appendChild(rfidTagElement);
//     tableElement.appendChild(productNameElement);
//     tableElement.appendChild(priceElement);
//     tableElement.appendChild(imageElement);
//     tableElement.appendChild(actions);
//     addItemsHere.appendChild(tableElement);
//     addButton.style.display = "none";
//     document.querySelector('.cancelModify').addEventListener('click', cancelModify);
//     document.querySelector('.submitModify').addEventListener('click', modifyItemSubmit);
// }


// function cancelModify() {
//     event.preventDefault();
//     let newRow = document.querySelector('.addTable');
//     document.getElementById('addItemsHere').removeChild(newRow);
//     addButton.style.display = "block";
// }

// async function modifyItemSubmit() {
//     let newTagNum = document.querySelector('.rfidTagAddField').value;
//     let myVal = await database.child(`organizations/${sessionStorage.getItem('organizationKey')}/rfidKeys`).orderByChild('rfidTag').equalTo(newTagNum).once("value");
//     myVal = myVal.val();
//     if (myVal && modifyId != newTagNum) {
//         alert(`RFID Tag # ${newTagNum} is already in your inventory.`);
//     } else if (!(/\d+/.test(document.querySelector(".rfidTagModifyField").value))) {
//         alert(`Please enter a valid RFID tag number.`);
//     } else if (document.querySelector(".productNameModifyField").value == "") {
//         alert(`Please enter a valid product name.`);
//     } else if (!(/^(\$)?\d+(\.\d\d)?$/.test(document.querySelector(".priceModifyField").value))) {
//         alert(`Please enter a valid price in the format 0 or 0.00.`);
//     } else if (!((/.png$/.test(document.querySelector(".imageModifyField").value)) || document.querySelector(".imageModifyField").value == "")) {
//         alert(`Please enter a valid image url that ends in .png.`);
//     } else {
//         let myImage;
//         if (document.querySelector(".imageModifyField").value == "") {
//             myImage = "https://gocartapp.tech/assets/noProductImage.png";
//         } else {
//             myImage = document.querySelector(".imageModifyField").value;
//         }
//         let myPrice;
//         if (!(/^\$\d+(\.\d\d)?$/.test(document.querySelector(".priceModifyField").value))) {
//             myPrice = "$" + document.querySelector(".priceModifyField").value;
//         } else {
//             myPrice = document.querySelector(".priceModifyField").value;
//         }
//         let value = {
//             rfidTag: document.querySelector(".rfidTagModifyField").value,
//             productName: document.querySelector(".productNameModifyField").value,
//             price: myPrice,
//             productImage: myImage
//         }
//         let myVal = await database.child(`organizations/${sessionStorage.getItem('organizationKey')}/rfidKeys`).orderByChild('rfidTag').equalTo(modifyId).once("value");
//         myVal = myVal.val();
//         console.log(myVal);
//         for (key in myVal) {
//             firebase.database().ref(`organizations/${sessionStorage.getItem('organizationKey')}/rfidKeys/${key}`).setValue(value);
//         }
//     }
// }

// function modifyItemAuto() {

// }