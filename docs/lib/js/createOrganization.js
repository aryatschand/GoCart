if (sessionStorage.getItem('userKey') == null || sessionStorage.getItem('userKey') == "null") {
    window.location.href = "index.html";
}

if (sessionStorage.getItem('organizationKey') != null && sessionStorage.getItem('organizationKey') != "null") {
    window.location.href = "landing.html";
}

const database = firebase.database().ref();

document.getElementById("submit_button").addEventListener("click", submit);

async function submit(){
    event.preventDefault();
    organizationName = document.getElementById("orgInput").value;
    let myCheck = await database.child("adminUsers").orderByChild('organization').equalTo(organizationName).once("value");
    if (myCheck.val() == null) {
        firebase.database().ref(`adminUsers/${sessionStorage.getItem('userKey')}/organization`).set(organizationName);
        const value = {
            name: organizationName,
        }
        database.child("organizations").push(value);
        let myCheck = await database.child("organizations").orderByChild('name').equalTo(organizationName).once("value");
        myCheck = myCheck.val();
        for (key in myCheck) {
            console.log(key);
            sessionStorage.setItem('organizationKey', key);
        }
        firebase.database().ref(`adminUsers/${sessionStorage.getItem('userKey')}/organization`).set(organizationName);
        firebase.database().ref(`organizations/${sessionStorage.getItem('organizationKey')}/adminUsers`).push(sessionStorage.getItem('userKey'));
       window.location.href = "landing.html";
    } else {
        alert("This organization name has already been reserved.");
    }
}