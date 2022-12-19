import { app, analytics } from "./Firebase";
import { 
    getAuth, 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithCustomToken
} from "@firebase/auth";
import { addNewUser } from "../viewmodels/UserDBQueries";
import { upload } from "./UploadAvatar";

const auth = getAuth(app)

//enum for user creds
export const UserCredentials = {
    EMAIL: 0,
    PASSWORD: 1,
    USERNAME: 2,
    FIRSTNAME: 3,
    LASTNAME: 4,
    WORKPLACE: 5,
    POSITION: 6
}

//function to create the user
export async function createUser(
    firstName,
    lastName,
    username,
    workplace,
    position,
    email,
    password,
    avatar
) {
    console.log("starting create user")

    //create the user in firebase auth
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user
        console.log(user.email + " user created, adding other data...")
        let userID = user.uid;
        if (avatar) {
            upload(avatar)
                .then(url=> {
                    addNewUser(url, firstName, lastName, username, workplace, position, userID);
                })
                .catch(e=> {
                    console.log(e)
                })
        } else {
            addNewUser(null, firstName, lastName, username, workplace, position, userID);
        }      
    })
    .catch((error) =>{
        const errorCode = error.code
        const errorMessage = error.message
        console.log(errorMessage)
    })
}

export function logInWithToken(token) {
    return new Promise((resolve, reject)=> {
        signInWithCustomToken(auth, token)
        .then((user)=> {
            console.log("token auth yes")
            resolve(user)
        })
        .catch(error=> {
            console.log(error)
            console.log("sing in with token failed")
            reject()
        })
    })
}

// export async function userExists(uid) {
//     const user = 
// }

export function validateSignInCredentials(email, password) {
    //going though the credentials & adding to array ones that are invalid
    //empty array means all fields satisfy the requirements
    const result = new Array();
    //email
    let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (email.length === 0 || !email.match(re)) {
        console.log("inv email")
        result.push(UserCredentials.EMAIL)
    }

    //password

    if (password.length <= 6) {
        console.log("inv psw")
        result.push(UserCredentials.PASSWORD)
    }

    return result
}


export async function validateNewUserCredentials(credentials) {
    //going though the credentials & adding to array ones that are invalid
    //empty array means all fields satisfy the requirements
    const result = new Array();
    //email
    let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (credentials.email.length === 0 || !credentials.email.match(re)) {
        console.log("inv email")
        result.push(UserCredentials.EMAIL)
    }

    //password

    if (credentials.password.length <= 6) {
        console.log("inv psw")
        result.push(UserCredentials.PASSWORD)
    }

    //username
    const validUsername = await validateUsername(credentials.username)

    if (!validUsername) {
        console.log("inv usrname")
        result.push(UserCredentials.USERNAME)
    }

    //first name
    if (credentials.firstName.length === 0) {
        console.log("no firstname")
        result.push(UserCredentials.FIRSTNAME)
    }

    //last name
    if (credentials.lastName.length === 0) {
        console.log("no surname")
        result.push(UserCredentials.LASTNAME)
    }

    return result
}


//function to check if username is available
export async function validateUsername(username) {

    //

    return true
}

export async function getUserToken() {
    try {
        const token = await auth.currentUser.getIdToken(true)
        return token
    } catch (e) {
        console.log(e)
        throw new Error("could not retrieve token for user: " + auth.currentUser)
    }
}

export async function resetPassword (email) {
    sendPasswordResetEmail(auth, email).then( () => {
        console.log("success")
    }
    )
    .catch((err) => {
        const errCode = err.code
        const errMsg = err.message
        console.log(errCode + ": " + errMsg)
    })
}


export async function logIn(email, password) {

    try {
        let userCredential = await signInWithEmailAndPassword(auth, email, password)
        const user = userCredential.user;
        console.log("logeeddhkhdks")
        return true
        console.log("LOGGED IN YEE")
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage)
        throw new Error(errorMessage)
    }
}

export async function logOut() {
    auth.signOut()
}
