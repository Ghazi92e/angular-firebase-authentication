import { Component, Input, OnInit } from '@angular/core';
import { Book } from 'src/app/_models/Book.model';
import { BooksService } from 'src/app/_services/books.service';
import { UploadFileService } from 'src/app/_services/upload-file.service';

@Component({
  selector: 'app-book-item',
  templateUrl: './book-item.component.html',
  styleUrls: ['./book-item.component.css']
})
export class BookItemsComponent implements OnInit {

  @Input() book: Book | any;

  constructor(private booksService: BooksService, private uploadService: UploadFileService) { }

  ngOnInit(): void {
  }

  onDeleteBook(book: Book) {
    this.booksService.removeBook(book);
    this.uploadService.deleteFileUpload(book)
  }

}
