import { Component, Input, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { Book } from 'src/app/_models/Book.model';
import { User } from 'src/app/_models/User.model';
import { BooksService } from 'src/app/_services/books.service';
import { NgAuthService } from 'src/app/_services/ng-auth.service';
import { UploadFileService } from 'src/app/_services/upload-file.service';
import { UsersService } from 'src/app/_services/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-single-book',
  templateUrl: './single-book.component.html',
  styleUrls: ['./single-book.component.css']
})

export class SingleBookComponent implements OnInit {

  book: Book | any;
  books: Book[] = [];
  user: User = new User();
  userSubscription: Subscription = new Subscription;
  booksSubscription: Subscription = new Subscription;
  useremail: string | any;
  displayName: string | any;

  id = this.route.snapshot.params['id'];

  constructor(private route: ActivatedRoute,
              private booksService: BooksService,
              private userService: UsersService,
              public ngAuthService: NgAuthService,
              private SpinnerService: NgxSpinnerService,
              private uploadService: UploadFileService,
              public afAuth: AngularFireAuth,
              private router: Router) {
              }

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user && user.uid) {
        this.displayName = user.displayName;
        this.useremail = user.email;
        this.userService.getUser(user.uid);
      }
    });

    this.SpinnerService.show()
    this.userSubscription = this.userService.userSubject.subscribe(
      (user: User) => {
        this.user = user;
        console.log(this.user);
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

    this.book = new Book('', ''); // crée un Book vide pour eviter les erreurs
    const id = this.route.snapshot.params['id'];
    this.booksService.getSingleBook(+id).then( // '+id' pour le cast en tant que number
      (book) => {
        this.book = book;
        console.log(this.book);
      }
    );
  }

  delbook(indexbook: string) {
    const index = this.user.bookids.indexOf(indexbook);
    if (index > -1) {
      this.userService.removeBookUser(index);
    }
    if (this.user.bookids) {
      this.user.bookids = this.user.bookids.join('').split('');
      this.userService.updateUser(this.user);
    }
    this.router.navigate(['/books']);
    Swal.fire('Bravo !', "Votre livre a bien été supprimé", 'success');
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
    this.router.navigate(['/books']);
    Swal.fire('Bravo !', "Votre livre a bien été ajouté", 'success');
  }

  editBook() {
    const id = this.route.snapshot.params['id'];
    this.router.navigate(['/books', 'edit', id]);
  }

  onBack() {
    this.router.navigate(['/books']);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.booksSubscription.unsubscribe();
  }

}
