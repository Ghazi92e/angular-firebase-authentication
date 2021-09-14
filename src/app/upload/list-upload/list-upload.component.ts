import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { NgAuthService } from 'src/app/services/ng-auth.service';
import { UploadFileService } from '../upload-file.service';

@Component({
  selector: 'app-list-upload',
  templateUrl: './list-upload.component.html',
  styleUrls: ['./list-upload.component.css']
})
export class ListUploadComponent implements OnInit {

  fileUploads: any[] | any;

  constructor(private uploadService: UploadFileService, public ngAuthService: NgAuthService) { }

  ngOnInit(): void {
    this.uploadService.getFileUploads(6).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(fileUploads => {
      this.fileUploads = fileUploads;
    });
  }

}
