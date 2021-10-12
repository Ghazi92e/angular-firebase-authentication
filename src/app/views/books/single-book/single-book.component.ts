import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from 'src/app/_models/Book.model';
import { FileUpload } from 'src/app/_models/Fileupload.model';
import { User } from 'src/app/_models/User.model';
import { BooksService } from 'src/app/_services/books.service';
import { NgAuthService } from 'src/app/_services/ng-auth.service';
import { UsersService } from 'src/app/_services/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-single-book',
  templateUrl: './single-book.component.html',
  styleUrls: ['./single-book.component.css']
})
export class SingleBookComponent implements OnInit {

  book: Book | any;
  user: User | any;


  constructor(private route: ActivatedRoute,
              private booksService: BooksService,
              private userService: UsersService,
              private ngAuthService: NgAuthService,
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

  addBooktoUser() {
    const id = this.route.snapshot.params['id'];
    const newUser = new User();
    newUser.id = this.ngAuthService.user.uid;
    newUser.book = id;
    this.userService.createNewUser(newUser);
  }

  editBook() {
    const id = this.route.snapshot.params['id'];
    this.router.navigate(['/books', 'edit', id]);
  }

  onDeleteBook(book: Book) {
    this.booksService.removeBook(book);
  }

  onBack() {
    this.router.navigate(['/books']);
  }

}
