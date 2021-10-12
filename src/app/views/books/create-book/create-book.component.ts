import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Book } from 'src/app/_models/Book.model';

@Component({
  selector: 'app-create-book',
  templateUrl: './create-book.component.html',
  styleUrls: ['./create-book.component.css']
})
export class CreateBookComponent implements OnInit {


  constructor() { }

  ngOnInit(): void {
  }

}
