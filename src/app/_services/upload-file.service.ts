import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { FileUpload } from '../_models/Fileupload.model';

@Injectable({
  providedIn: 'root'
})
export class UploadFileService {

  private basePath = '/uploads';
  downloadURL: Observable<string> | any;

  constructor(private storage: AngularFireStorage) { }

  pushFileToStorage(fileUpload: FileUpload): Observable<any> {
    const filePath = `${this.basePath}/${fileUpload.file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          console.log('File available at', downloadURL);
          fileUpload.url = downloadURL;
        });
      })
    ).subscribe();

    return uploadTask.percentageChanges();
  }

  uploadFileUrl(event: any) {
    const file = event.target.files[0];
    const filePath = '/uploads';
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    task.snapshotChanges().pipe(
      finalize(() => this.downloadURL = fileRef.getDownloadURL())
    ).subscribe();
  }

  deleteFileUpload(fileUpload: FileUpload) {
    this.deleteFileStorage(fileUpload.url);
  }

  private deleteFileStorage(name: string) {
    const storageRef = this.storage.ref(this.basePath);
    storageRef.child(name).delete();
  }

}

