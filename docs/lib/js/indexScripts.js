const database = firebase.database().ref();
const bcrypt = dcodeIO.bcrypt;

let testObj;

document.querySelector("#signUpButton").addEventListener("click", signUpRedirect);

function signUpRedirect() {
    event.preventDefault();
    window.location.href = "signUp.html";
}

window.onbeforeunload = function (e) {
    gapi.auth2.getAuthInstance().signOut();
};

function renderButton() {
    gapi.signin2.render('my-signin2', {
        'scope': 'profile email',
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': onSuccess,
        'onfailure': onFailure
    });
}


async function onSuccess(googleUser) {
    let profile = googleUser.getBasicProfile();
    const value = {
        email: profile.getEmail(),
        password: "",
        name: profile.getName(),
        imageURL: profile.getImageUrl()
    }
    let myVal = await database.child("adminUsers").orderByChild('email').equalTo(profile.getEmail()).once("value");
    myVal = myVal.val();
    if (!myVal) {
        database.child("adminUsers").push(value);
    }
    myVal = await database.child("adminUsers").orderByChild('email').equalTo(profile.getEmail()).once("value");
    myVal = myVal.val();
    for (key in myVal) {
        database.child(`adminUsers/${key}/imageURL`).set(profile.getImageUrl());
        database.child(`adminUsers/${key}/name`).set(profile.getName());
        sessionStorage.setItem('userKey', key);
    }
    for (key in googleUser) {
        if (googleUser[key].access_token != undefined) {
            localStorage.setItem('access_token', googleUser[key].access_token);
        }
    }
    for (key in myVal) {
        console.log(myVal[key]);
        if (!myVal[key]["organization"]) {
            sessionStorage.setItem('organizationKey', "null");
            window.location.href = "createOrganization.html";
        } else {
            let organization = myVal[sessionStorage.getItem('userKey')]["organization"];
            myOrg = await database.child("organizations").orderByChild('name').equalTo(organization).once("value");
            myOrg = myOrg.val();
            for (orgKey in myOrg) {
                sessionStorage.setItem('organizationKey', orgKey);
            }
            window.location.href = "landing.html";
        }
    }
}

function onFailure(error) {
    console.log(error);
}

document.querySelector("#submit_button").addEventListener("click", signInEmail);

let notSameError = document.getElementById('error');

async function signInEmail(event) {
    event.preventDefault();
    let email = document.querySelector("#emailInput").value;
    let myVal = await database.child("adminUsers").orderByChild('email').equalTo(email).once("value");
    myVal = myVal.val();
    if (!myVal) {
        notSame("Incorrect email address.");
    } else {
        let inputPassword = document.querySelector("#passwordInput").value;
        let userPassword;
        for (key in myVal) {
            userPassword = myVal[key].password;
        }
        if (bcrypt.compareSync(inputPassword, userPassword)) {
            for (key in myVal) {
                sessionStorage.setItem('userKey', key);
                sessionStorage.setItem('profilePic', myVal[key].imageURL);
            }
            if (!myVal[sessionStorage.getItem('userKey')]["organization"]) {
                sessionStorage.setItem('organizationKey', "null");
                window.location.href = "createOrganization.html";
            } else {
                let organization = myVal[sessionStorage.getItem('userKey')]["organization"];
                myOrg = await database.child("organizations").orderByChild('name').equalTo(organization).once("value");
                myOrg = myOrg.val();
                for (orgKey in myOrg) {
                    sessionStorage.setItem('organizationKey', orgKey);
                }
                window.location.href = "landing.html";
            }
        } else {
            notSame("Incorrect Password");
        }
    }
}

function hash(value) {
    let salt = bcrypt.genSaltSync(10);
    let hashVal = bcrypt.hashSync(value, salt);
    return hashVal;
}

function notSame(p) {
    notSameError.innerText = `${p}`;
    notSameError.class = "error";
    box.prepend(notSameError);
}