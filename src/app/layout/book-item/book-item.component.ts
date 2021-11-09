import { Component, Input, OnInit } from '@angular/core';
import { Book } from 'src/app/_models/Book.model';
@Component({
  selector: 'app-book-item',
  templateUrl: './book-item.component.html',
  styleUrls: ['./book-item.component.css']
})
export class BookItemsComponent implements OnInit {

  @Input() book: Book | any;

  constructor() { }

  ngOnInit(): void {
  }
}
