import {storage} from "../viewmodels/Firebase";
import {uploadBytes, ref, getDownloadURL } from "firebase/storage"

export async function uploadAttachments(name, fileSelected) {
    return new Promise((resolve, reject)=> {

        const storageRef = ref(storage, "attachments/" + name);

        const uploadTask = uploadBytes(storageRef, fileSelected);

        uploadTask.then((snapshot) => {
            console.log('Uploaded attachment!');

            getDownloadURL(ref(storage, "attachments/" + name))
            .then((url) => {
                console.log(name + " url obtained: " + url);
                resolve(url);
            })
            .catch((error) => {
                console.error(error);
                reject()
            })
        })
        .catch((error)=> {
            console.log("error", error)
            reject()
        })
    })
};