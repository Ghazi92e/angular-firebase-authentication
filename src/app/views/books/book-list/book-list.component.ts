import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { Book } from 'src/app/_models/Book.model';
import { User } from 'src/app/_models/User.model';
import { BooksService } from 'src/app/_services/books.service';
import { NgAuthService } from 'src/app/_services/ng-auth.service';
import { UploadFileService } from 'src/app/_services/upload-file.service';
import { UsersService } from 'src/app/_services/users.service';
import Swal from 'sweetalert2';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit, OnDestroy {

  books: Book[] = [];
  user: User = new User();
  booksSubscription: Subscription = new Subscription;
  userSubscription: Subscription = new Subscription;
  useremail: string | any;
  displayName: string | any;

  constructor(private booksService: BooksService,
              private uploadService: UploadFileService,
              private router: Router, 
              private SpinnerService: NgxSpinnerService,
              public ngAuthService: NgAuthService, 
              private userService: UsersService,
              public afAuth: AngularFireAuth ) {
              }

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      if (user && user.uid) {
        this.displayName = user.displayName;
        this.useremail = user.email;
        this.userService.getUser(user.uid);
      }
    });

    this.SpinnerService.show();
    this.userSubscription = this.userService.userSubject.subscribe(
      (user: User) => {
        this.user = user;
        this.SpinnerService.hide();
      }
    );

    this.SpinnerService.show();
    this.booksSubscription = this.booksService.booksSubject.subscribe(
      (books: Book[]) => {
        this.books = books;
        this.SpinnerService.hide();
      }
    );
    this.booksService.getBooks();
  }

  addidbooktoUser(id: string) {
    if (this.user.bookids == null) {
      this.user.bookids = [];
      this.user.bookids.push(id);
    } else {
      this.user.bookids.push(id);
    }
    this.user.name = this.displayName;
    this.user.email = this.useremail;
    this.userService.updateUser(this.user);
    Swal.fire('Bravo !', "Votre livre a bien été ajouté", 'success');
  }

  onNewBook() {
    this.router.navigate(['/books', 'create']);
  }
  
  onViewBook(id: number) {
    this.router.navigate(['/books', 'view', id]);
  }

  onDeleteBook(book: Book) {
    this.booksService.removeBook(book);
    this.uploadService.deleteFileUpload(book)
  }

  ngOnDestroy() {
    this.booksSubscription.unsubscribe();
  }

}

