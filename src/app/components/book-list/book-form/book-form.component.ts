import { Component, Input, OnInit } from '@angular/core';
import { snapshotChanges } from '@angular/fire/compat/database';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Book } from 'src/app/models/Book.model';
import { FileUpload } from 'src/app/models/Fileupload.model';
import { BooksService } from 'src/app/services/books.service';
import { UploadFileService } from 'src/app/upload/upload-file.service';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnInit {


  bookForm: FormGroup | any;
  fileIsUploading = false;
  fileUrl: string | any;
  fileUploaded = false;
  currentFileUpload: FileUpload | any;
  selectedFiles: FileList | any;



  constructor(private formBuilder: FormBuilder,
              private booksService: BooksService,
              private router: Router,
              private uploadService: UploadFileService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.bookForm = this.formBuilder.group({
      title: ['', Validators.required],
      author: ['', Validators.required]
    });
  }

  onSaveBook() {
    const title = this.bookForm?.get('title')?.value;
    const author = this.bookForm?.get('author')?.value;
    const newBook = new Book(title, author);
    if(this.fileUrl && this.fileUrl !== ''){
      newBook.photo = this.fileUrl;
    }
    this.booksService.createNewBook(newBook);
    this.router.navigate(['/books']);
  }


  onUploadFile() {
    this.fileIsUploading = true;
    const file = this.selectedFiles.item(0);
    this.selectedFiles = undefined;
    this.currentFileUpload = new FileUpload(file);
    this.uploadService.pushFileToStorage(this.currentFileUpload).subscribe(   //enregistrer l'url
      (url: string) => {
        this.fileUrl = url
        this.fileIsUploading = false;
        this.fileUploaded = true;
      }
    )
  }


  selectFile(event: any) {
    this.selectedFiles = event.target.files;
  }
}
