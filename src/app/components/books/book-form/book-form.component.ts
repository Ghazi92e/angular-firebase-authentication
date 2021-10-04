import { Component, Input, OnInit } from '@angular/core';
import { snapshotChanges } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from 'src/app/_models/Book.model';
import { FileUpload } from 'src/app/_models/Fileupload.model';
import { BooksService } from 'src/app/_services/books.service';
import { UploadFileService } from 'src/app/_services/upload-file.service';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnInit {
  /*@Input() book;*/

  bookForm: FormGroup | any;
  fileIsUploading = false;
  fileUrl: string | any;
  currentFileUpload: FileUpload | any;
  selectedFiles: FileList | any;
  downloadURL: Observable<string> | any;
  percentage: number | any;



  constructor(private formBuilder: FormBuilder,
              private booksService: BooksService,
              private router: Router,
              private route: ActivatedRoute,
              private storage: AngularFireStorage,
              private uploadService: UploadFileService) {}

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
    if(this.currentFileUpload && this.currentFileUpload !== '') {
      newBook.url = this.currentFileUpload.url;
      newBook.name = this.currentFileUpload.name;
    }
    this.booksService.createNewBook(newBook);
    this.router.navigate(['/books']);
  }

  selectFile(event: any) {
    if (event.target.files && event.target.files.length) {
      for (const file of event.target.files) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const img = new Image();
          img.src = reader.result as string;
          img.onload = () => {
            const height = img.naturalHeight;
            const width = img.naturalWidth;
            console.log('Width and Height', width, height);
            if (event.target.files[0].size > 400 * 400) {
              Swal.fire('Erreur image', "La taille de l'image est trop grande", 'error');
            }
            else if (height > 700 || width > 700) {
              Swal.fire('Erreur image', "La dimension de l'image est tros grande", 'error');
            }
            else {
              this.selectedFiles = event.target.files;
              this.upload();
            }
          };
        };
      }
    }
  }

  upload() {
    const file = this.selectedFiles.item(0);
    this.selectedFiles = undefined;

    this.currentFileUpload = new FileUpload(file);
    this.uploadService.pushFileToStorage(this.currentFileUpload).subscribe(
      percentage => {
        this.percentage = Math.round(percentage);
        this.fileIsUploading = false;
      },
      error => {
        console.log(error);
      }
    );
  }
}
