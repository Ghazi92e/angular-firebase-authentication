import { Component, Input, OnInit } from '@angular/core';
import { Book } from 'src/app/_models/Book.model';
import { BooksService } from 'src/app/_services/books.service';

@Component({
  selector: 'app-book-items',
  templateUrl: './book-items.component.html',
  styleUrls: ['./book-items.component.css']
})
export class BookItemsComponent implements OnInit {

  @Input() book: Book | any;

  constructor(private booksService: BooksService) { }

  ngOnInit(): void {
  }

  onDeleteBook(book: Book) {
    this.booksService.removeBook(book);
  }

}
