import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Book } from 'src/app/_models/Book.model';
import { FileUpload } from 'src/app/_models/Fileupload.model';
import { BooksService } from 'src/app/_services/books.service';
import { UploadFileService } from 'src/app/_services/upload-file.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css']
})
export class EditBookComponent implements OnInit {

  book: Book | any;
  
  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private uploadService: UploadFileService,
              private booksService: BooksService) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.booksService.getSingleBook(+id).then(
      (book) => {
        this.book = book;
        console.log(this.book)
      }
    );
  }
}
