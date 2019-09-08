if (sessionStorage.getItem('userKey') == null || sessionStorage.getItem('userKey') == "null") {
    window.location.href = "index.html";
}

if (sessionStorage.getItem('organizationKey') == null || sessionStorage.getItem('organizationKey') == "null") {
    window.location.href = "createOrganization.html";
}

const database = firebase.database().ref();
const bcrypt = dcodeIO.bcrypt;
let googleUser;
firebase.database().ref(`organizations/${sessionStorage.getItem('organizationKey')}/adminUsers`).on('child_added', addUserAuto);
document.getElementById("addButton").addEventListener('click', addUserWithGoogle);

runOnce();

async function runOnce() {
    let myVal;
    let userListener = await firebase.database().ref(`adminUsers/${sessionStorage.getItem('userKey')}/password`);
    await userListener.on('value', async function (snapshot) {
        myVal = await snapshot.val();
    });
    if (myVal != "") {
        verifyPassword = document.createElement("input");
        verifyPassword.type = "password";
        verifyPassword.class = "input";
        verifyPassword.id = "oldPassword";
        verifyPassword.placeholder = "Existing password"
        document.getElementById("addVerifyPassword").appendChild(verifyPassword);
        googleUser = false;
    } else {
        googleUser = true;
    }

    // let myVal = await database.child(`adminUsers/${sessionStorage.getItem('userKey')}`)
    // myVal = await myVal.val();
}

document.querySelector("#submit_button").addEventListener("click", resetPassword);

async function resetPassword() {
    event.preventDefault();
    if (!googleUser) {
        let userListener = await firebase.database().ref(`adminUsers/${sessionStorage.getItem('userKey')}/password`);
        let successful = false;
        await userListener.on('value', async function (snapshot) {
            myVal = await snapshot.val();
            console.log(hash(document.getElementById("oldPassword").value));
            console.log(myVal);
            if (bcrypt.compareSync(hash(document.getElementById("oldPassword").value), myVal)) {
                alert("Incorrect old password");
            } else if (document.querySelector("#passwordInput").value.length < 6) {
                alert("Your password needs to be at least 6 characters.");
            } else if (document.querySelector("#passwordInput").value != document.querySelector("#passwordConfirm").value) {
                alert('Your passwords don\'t match.');
            } else {
                successful = true;
            }
        });
        if (successful) {
            await firebase.database().ref(`adminUsers/${sessionStorage.getItem('userKey')}/password`).set(hash(document.querySelector("#passwordInput").value));
            alert("You have successfully changed your password!");
            return;
        }
    } else {
        if (document.querySelector("#passwordInput").value.length < 6) {
            alert("Your password needs to be at least 6 characters.");
        } else if (document.querySelector("#passwordInput").value != document.querySelector("#passwordConfirm").value) {
            alert('Your passwords don\'t match.');
        } else {
            firebase.database().ref(`adminUsers/${sessionStorage.getItem('userKey')}/password`).set(hash(document.querySelector("#passwordInput").value));
            alert("You have successfully changed your password!");
        }
    }
}

async function addUserAuto(data) {
    const dataVal = data.val();
    let addUsersHere = document.getElementById('addUsersHere');
    let tableElement = document.createElement("tr");
    tableElement.classList.add(dataVal);
    tableElement.classList.add('tableElement');
    let nameElement;
    let emailElement;
    let userListener = await firebase.database().ref(`adminUsers/${dataVal}/name`);
    await userListener.on('value', async function (snapshot) {
        myVal = await snapshot.val();
        nameElement = document.createElement("th");
        nameElement.innerText = myVal;
        tableElement.appendChild(nameElement);
    });
    let emailListener = await firebase.database().ref(`adminUsers/${dataVal}/email`);
    await emailListener.on('value', async function (snapshot) {
        myVal = await snapshot.val();
        emailElement = document.createElement("th");
        emailElement.innerText = myVal;
        tableElement.appendChild(emailElement);
        addUsersHere.appendChild(tableElement);
    });
}

async function addUserWithGoogle() {
    event.preventDefault();
    let tableElement = document.createElement("tr");
    tableElement.classList.add('addTable');
    let emailElement = document.createElement("th");
    let actions = document.createElement("th");
    let cancel = document.createElement("button");
    cancel.innerText = "Cancel";
    cancel.classList.add('cancel');
    let submit = document.createElement("button");
    submit.innerText = "Submit";
    submit.classList.add('submit');
    let emailElementAddField = document.createElement("input");
    emailElementAddField.classList.add('emailElementAddField');
    emailElementAddField.placeholder = "Email address";
    emailElement.appendChild(emailElementAddField);
    submit.style.marginBottom = "5px";
    submit.style.marginRight = "5px";
    actions.appendChild(submit);
    actions.appendChild(cancel);
    tableElement.appendChild(emailElement);
    tableElement.appendChild(actions);
    // addItemsHere.appendChild(tableElement);
    document.getElementById('addUsersHere').appendChild(tableElement);
    document.getElementById('addButton').style.display = "none";
    document.getElementById('addButton2').style.display = "none";
    document.querySelector('.cancel').addEventListener('click', cancelAdd);
    document.querySelector('.submit').addEventListener('click', addUserWithGoogleSubmit);
}

function cancelAdd() {
    event.preventDefault();
    let newRow = document.querySelector('.addTable');
    document.getElementById('addUsersHere').removeChild(newRow);
    document.getElementById('addButton').style.display = "block";
    document.getElementById('addButton2').style.display = "block";
}

async function addUserWithGoogleSubmit() {
    event.preventDefault();
    let newEmail = document.querySelector('.emailElementAddField').value;
    let myVal = await database.child(`adminUsers`).orderByChild('email').equalTo(newEmail).once("value");
    myVal = myVal.val();
    if (myVal) {
        alert(`This email address already has an account.`);
    } else {
        let newRow = document.querySelector('.addTable');
        let value = {
            email: newEmail,
            password: "",
        }
        database.child(`organizations/${sessionStorage.getItem('organizationKey')}/rfidKeys`).push(value);
        document.getElementById('addUsersHere').removeChild(newRow);
        document.getElementById('addButton').style.display = "block";
        document.getElementById('addButton2').style.display = "block";
    }

}

function hash(value) {
    let salt = bcrypt.genSaltSync(10);
    let hashVal = bcrypt.hashSync(value, salt);
    return hashVal;
}