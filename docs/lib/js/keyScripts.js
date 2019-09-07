const database = firebase.database().ref();
let mySound;

function preload() {
    soundFormats('mp3');
    mySound = loadSound('https://gocartapp.tech/assets/Siren.mp3');
}

function setup() {
    mySound.setVolume(1.0);

}


let params = new URLSearchParams(document.location.search.substring(1));
let myKey = params.get("key");
if (myKey) {
    if (myKey.includes("Card NO: ")) {
        myKey = myKey.substring(9);
        submit();
    } else if(/\d/.test(myKey.charAt(0))){
        submit();
    }
}


async function submit() {
    let myVal = await database.child("carts").orderByChild('rfidTag').equalTo(myKey).once("value");
    myVal = myVal.val();
    let purchased;
    for (key in myVal) {
        purchased = myVal[key]["purchased"];
    }
    if (!purchased) {
        console.log("Not purchased");
        mySound.play();
    } else {
        console.log("Purchased")
    }
}