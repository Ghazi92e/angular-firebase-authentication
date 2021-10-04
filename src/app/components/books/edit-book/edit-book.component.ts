import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Book } from 'src/app/_models/Book.model';
import { FileUpload } from 'src/app/_models/Fileupload.model';
import { BooksService } from 'src/app/_services/books.service';
import { UploadFileService } from 'src/app/upload/upload-file.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css']
})
export class EditBookComponent implements OnInit {

  book: Book | any;

  bookForm: FormGroup | any;
  fileIsUploading = false;
  fileUrl: string | any;
  currentFileUpload: FileUpload | any;
  selectedFiles: FileList | any;
  downloadURL: Observable<string> | any;
  percentage: number | any;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private uploadService: UploadFileService,
              private booksService: BooksService) { }

  ngOnInit(): void {
    this.initForm();
    this.book = new Book('', ''); // crée un Book vide pour eviter les erreurs
    const id = this.route.snapshot.params['id'];
    this.booksService.getSingleBook(+id).then( // '+id' pour le cast en tant que number
      (book) => {
        this.book = book;
        console.log(this.book)
      }
    );
  }

  initForm() {
    this.bookForm = this.formBuilder.group({
      title: ['', Validators.required],
      author: ['', Validators.required]
    });
  }

  updatebook() {
    const title = this.bookForm?.get('title')?.value;
    const author = this.bookForm?.get('author')?.value;
    const id = this.route.snapshot.params['id'];
    const newBook = new Book(title, author);
    if(this.currentFileUpload && this.currentFileUpload !== '') {
      newBook.url = this.currentFileUpload.url;
      newBook.name = this.currentFileUpload.name;
    }
    this.booksService.updateBook(id, newBook);
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
            if (event.target.files[0].size > 300 * 300) {
              Swal.fire('Erreur image', "Taille de l'image tros eleve", 'error');
            }
            else if (height > 500 || width > 500) {
              Swal.fire('Erreur image', "Dimension de l'image tros eleve", 'error');
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

  onBack() {
    const id = this.route.snapshot.params['id'];
    this.router.navigate(['/books', 'view', id]);
  }

}