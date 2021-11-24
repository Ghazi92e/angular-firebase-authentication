import { Component, Input, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from 'src/app/_models/Book.model';
import { FileUpload } from 'src/app/_models/Fileupload.model';
import { BooksService } from 'src/app/_services/books.service';
import { UploadFileService } from 'src/app/_services/upload-file.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent implements OnInit {
  /*@Input() book;*/
  /*@Input() book: Book | any;*/
  _book: Book
  @Input() set book(book: Book){
    console.log('set book');
    this._book = book;
    this.initForm();
  }
  bookForm: FormGroup | any;
  fileIsUploading = false;
  fileUrl: string | any;
  currentFileUpload: FileUpload | any;
  selectedFiles: FileList | any;
  percentage: number | any;
  idbook: string[] = []


  constructor(private formBuilder: FormBuilder,
              private booksService: BooksService,
              private router: Router,
              private route: ActivatedRoute,
              private storage: AngularFireStorage,
              private uploadService: UploadFileService) 
              {
                this._book = {
                  title: '',
                  author: '',
                  url: ''
                }
              }

  ngOnInit(): void {
    // this._book = new Book()
    this.initForm();
    this.booksService.getBooksFirestore().then((data) => {
      data.forEach((docbookid) => {
        this.idbook.push(docbookid.id)
      })
    })
  }

  initForm() {
    if (this._book == null) {
      this.bookForm = this.formBuilder.group({
        title: ['', Validators.required],
        author: ['', Validators.required],
      });
    } else {
      this.bookForm = this.formBuilder.group({
        title: [this._book.title, Validators.required],
        author: [this._book.author, Validators.required],
      });
    }
  }

  onSaveBook() {
    const title = this.bookForm?.get('title')?.value;
    const author = this.bookForm?.get('author')?.value;
    this._book.title = title
    this._book.author = author
    if(this.currentFileUpload && this.currentFileUpload !== '') {
      this._book.url = this.currentFileUpload.url;
    } 
    if (this.route.snapshot.params['id']) {
      const id = this.route.snapshot.params['id'];
      this.booksService.updateBook(this.idbook[id], this._book);
      this.router.navigate(['/books']);
    } else {
      console.log(this._book)
      this.booksService.createNewBook(this._book);
      this.router.navigate(['/books']);
    }
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
            console.log(event.target.files[0].size)
            if (event.target.files[0].size > 350000) {
              console.log(event.target.files[0].size)
              Swal.fire('Erreur image', "Image trop lourde", 'error');
            }
            else if (width / height > 0.7) {
              Swal.fire('Erreur image', "Dimension de l'image non conforme", 'error');
            }
            else if (width < 100 ) {
              Swal.fire('Erreur image', "Image trop petite", 'error');
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
