import {storage} from "../viewmodels/Firebase";
import {uploadBytes, ref, getDownloadURL } from "firebase/storage"

export async function upload(fileSelected) {
    
    const d = new Date();
    const name = d.getTime();
    const storageRef = ref(storage, "avatars/" + name);

    try {
        const snapshot = await uploadBytes(storageRef, fileSelected)
        const url = await getDownloadURL(snapshot.ref)
        return url
    } catch(e) {
        console.log(e)
    }
};
