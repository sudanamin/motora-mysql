import { Injectable } from '@angular/core';
import { Upload } from './upload';

@Injectable()
export class UploadService {

  constructor() { }

  pushUpload(upload: Upload) {
    upload.name = upload.file.name
   /* let storageRef = firebase.storage().ref();
    let uploadTask = storageRef.child(`uploads/${upload.file.name}`).put(upload.file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) =>  {
        // upload in progress
        upload.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      },
      (error) => {
        // upload failed
        console.log(error)
      },
      () => {
        // upload success
        upload.url = uploadTask.snapshot.downloadURL
        upload.name = upload.file.name
        this.saveFileData(upload)
      }*/
    }

  // Writes the file details to the realtime db
 /* private saveFileData(upload: Upload) {
    this.db.list(`uploads`).push(upload);
  }*/

}
