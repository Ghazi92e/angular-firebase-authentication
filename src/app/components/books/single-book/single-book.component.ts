import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from 'src/app/_models/Book.model';
import { FileUpload } from 'src/app/_models/Fileupload.model';
import { BooksService } from 'src/app/_services/books.service';

@Component({
  selector: 'app-single-book',
  templateUrl: './single-book.component.html',
  styleUrls: ['./single-book.component.css']
})
export class SingleBookComponent implements OnInit {

  book: Book | any;


  constructor(private route: ActivatedRoute,
              private booksService: BooksService,
              private router: Router) {
              }

  ngOnInit() {
    this.book = new Book('', ''); // crée un Book vide pour eviter les erreurs
    const id = this.route.snapshot.params['id'];
    this.booksService.getSingleBook(+id).then( // '+id' pour le cast en tant que number
      (book) => {
        this.book = book;
        console.log(this.book)
      }
    );
  }

  editBook() {
    const id = this.route.snapshot.params['id'];
    this.router.navigate(['/books', 'edit', id]);
  }

  onBack() {
    this.router.navigate(['/books']);
  }

}
