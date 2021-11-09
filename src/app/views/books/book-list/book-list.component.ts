import { Component, OnInit, OnDestroy, Input } from '@angular/core';
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
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit, OnDestroy {

  books: Book[] = []; //arret local
  user: User | any;
  addidbook: string[] = [];
  booksSubscription: Subscription = new Subscription;
  userSubscription: Subscription = new Subscription;
  
  constructor(private booksService: BooksService,
              private uploadService: UploadFileService,
              private router: Router, 
              private SpinnerService: NgxSpinnerService, 
              private userService: UsersService ) { }

  ngOnInit(): void {
    this.SpinnerService.show();
    this.user = new User();
    this.userSubscription = this.userService.userSubject.subscribe(
      (user: User) => {
        this.user = user;
        this.SpinnerService.hide();
      }
    );
    this.userService.getUser();

    this.SpinnerService.show();
    this.booksSubscription = this.booksService.booksSubject.subscribe(
      (books: Book[]) => {
        this.books = books;
        this.SpinnerService.hide();
      }
    );
    this.booksService.getBooks();
  }

  delbook(indexbook: number) {
    const index = this.user.bookids.indexOf(indexbook);
    if (index > -1) {
      this.user.bookids.splice(index, 1);
      this.userService.removeBookUser(index);
    }
    this.router.navigate(['/books']);
    Swal.fire('Bravo !', "Votre livre a bien été supprimé", 'success');
  }

  addidbooktoUser(id: string) {
    if (this.user.bookids) {
      for (var value of this.user.bookids) {
        if (value) {
          this.addidbook.push(value);
          console.log(value);
        }
      }
    }
    this.addidbook.push(id);
    console.log(this.addidbook);
    this.userService.addbookidsUser(this.addidbook);
    this.addidbook = [];
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

