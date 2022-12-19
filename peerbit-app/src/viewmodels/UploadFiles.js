import {storage} from "../viewmodels/Firebase";
import {uploadBytes, ref, getDownloadURL } from "firebase/storage"
import JSZip from "jszip";

export async function upload(fileSelected) {
    
    return new Promise((resolve, reject)=> {
        const d = new Date();
        const name = d.getTime();
        
        const zip = new JSZip()
        zip.file(fileSelected.name, fileSelected)
        
        zip.generateAsync({type: "blob"})
        .then((zipBlob)=> {
            console.log("zip?", zipBlob)
            const storageRef = ref(storage, "code/" + name);

            const uploadTask = uploadBytes(storageRef, zipBlob);

            uploadTask.then((snapshot) => {
                console.log('Uploaded file!');

                getDownloadURL(ref(storage, "code/" + name))
                .then((url) => {
                    console.log("url obtained");
                    resolve(url);
                })
                .catch((error) => {
                    console.error(error);
                    reject()
                })
            });
        })
        .catch((error)=> {
          console.log("error", error)
          reject()
        })
    })
};

