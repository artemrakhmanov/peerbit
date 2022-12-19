import { 
    getFirestore, doc, updateDoc, 
    setDoc, collection, addDoc,
    getDoc, arrayUnion, arrayRemove
} from "firebase/firestore"
import { compose } from "redux";
import store from "../reducers/store";

const db = getFirestore();

export async function addNewUser(
    avatar,
    firstName,
    lastName,
    username,
    workplace,
    position,
    userID
) {
    setDoc(doc(db, "userDetails", userID), {
        uid: userID,
        avatar: avatar,
        firstName: firstName,
        lastName: lastName,
        username: username,
        workplace: workplace,
        position: position,
        submissionsReviewing: []
    })
    /*
    const docRef = doc(db, "userDetails", "userDoc");
    await updateDoc(docRef, {
        userArray: arrayUnion({
            uid: userID,
            avatar: avatar,
            firstName: firstName,
            lastName: lastName,
            username: username,
            workplace: workplace,
            position: position,
            submissionsReviewing: []
        })
    })
    */
    .then(() => {
        console.log("Added to db");
        return Promise.resolve(200);
    })
    .catch((error) => {
        console.log(error.message);
        return Promise.resolve(error.code);
    })
}

/*
export async function removeUser(
    avatar,
    firstName,
    lastName,
    workplace,
    position,
    submissionsReviewing
) {
    const uid = store.getState().login.value.uid
    const username = store.getState().login.value.username

    const docRef = doc(db, "userDetails", "userDoc");
    await updateDoc(docRef, {
        userArray: arrayRemove({
            uid: uid,
            avatar: avatar,
            firstName: firstName,
            lastName: lastName,
            username: username,
            workplace: workplace,
            position: position,
            submissionsReviewing: submissionsReviewing
        })
    })
    .then(() => {
        console.log("Removed db");
        return Promise.resolve(200);
    })
    .catch((error) => {
        console.log(error.message);
        return Promise.resolve(error.code);
    })
}
*/

export async function updateUser(
    avatar,
    firstName,
    lastName,
    workplace,
    position
) {

    const uid = store.getState().login.value.uid    //current user ID
    /*
    const username = store.getState().login.value.username

    const docRef = doc(db, "userDetails", "userDoc")
    const docSnap = await getDoc(docRef)

    const users = docSnap.data();
    for (let i = 0; i < users.userArray.length; i++) {
        if (users.userArray[i].uid == uid) {
            removeUser(
                users.userArray[i].avatar, 
                users.userArray[i].firstName, 
                users.userArray[i].lastName,
                users.userArray[i].workplace,
                users.userArray[i].position
            )
        }
    }
    */

    updateDoc(doc(db, "userDetails", uid), {
        avatar: avatar,
        firstName: firstName,
        lastName: lastName,
        workplace: workplace,
        position: position
    })
    /*
    await updateDoc(docRef, {
        userArray: arrayUnion({
            uid: uid,
            avatar: avatar,
            firstName: firstName,
            lastName: lastName,
            username: username,
            workplace: workplace,
            position: position
        })
    })
    */
    .then(() => {
        console.log("Added to db");
        return Promise.resolve(200);
    })
    .catch((error) => {
        console.log(error.message);
        return Promise.resolve(error.code);
    })
}

export async function getUserData(userID) {
    try {
        //if no user id is specified - calls for the current user
        const uid = userID ? (userID + "") : store.getState().login.value.uid
        console.log(userID)
        console.log("GET USER DATA")
        const docRef = doc(db, "userDetails", uid)
        const docSnap = await getDoc(docRef)
        console.log(docSnap)
        if (docSnap.exists()) {
            console.log("uid exists")
            const data = docSnap.data()
            console.log(data)
            const userData = {
                uid: uid,
                displayName: data.firstName + " " + data.lastName,
                firstName: data.firstName,
                lastName: data.lastName,
                username: data.username,
                profileURL: data.avatar ? data.avatar : "",
                workplace: data.workplace ? data.workplace : "",
                position: data.position ? data.position : ""
            }
            return userData
        } else {
            console.log("uid doesnt exist")
            const noUserObject = {
                uid: uid,
                displayName: "nouser nouser",
                firstName: "nouser",
                lastName: "nouser",
                username: "nouser",
                pictureURL: "",
                workplace: "nouser",
                position: "nouser",
                submissionsReviewing: []
            }
            return noUserObject
        }
    } catch (error) {
        console.log(error)
    }
}