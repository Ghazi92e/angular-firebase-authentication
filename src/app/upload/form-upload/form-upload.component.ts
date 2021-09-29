import { Component, OnInit } from '@angular/core';
import { FileUpload } from 'src/app/_models/Fileupload.model';
import { UploadFileService } from '../upload-file.service';

@Component({
  selector: 'app-form-upload',
  templateUrl: './form-upload.component.html',
  styleUrls: ['./form-upload.component.css']
})
export class FormUploadComponent implements OnInit {

  selectedFiles: FileList | any;
  currentFileUpload: FileUpload | any;
  percentage: number | any;
  url: number | any;

  constructor(private uploadService: UploadFileService) { }

  ngOnInit(): void {
  }

  selectFile(event: any) {
    this.selectedFiles = event.target.files;
  }

  upload() {
    const file = this.selectedFiles.item(0);
    this.selectedFiles = undefined;

    this.currentFileUpload = new FileUpload(file);
    this.uploadService.pushFileToStorage(this.currentFileUpload).subscribe(
      percentage => {
        this.percentage = Math.round(percentage);
      },
      error => {
        console.log(error);
      }
    );
  }

}
