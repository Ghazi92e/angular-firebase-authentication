import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Book } from 'src/app/_models/Book.model';
import { User } from 'src/app/_models/User.model';
import { BooksService } from 'src/app/_services/books.service';
import { UsersService } from 'src/app/_services/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-book',
  templateUrl: './user-book.component.html',
  styleUrls: ['./user-book.component.css']
})
export class UserBookComponent implements OnInit {
  
  user: User
  books: Book[] = []
  useruid: string
  idbook: string[] = []

  constructor(private userService: UsersService, 
              private SpinnerService: NgxSpinnerService,
              private booksService: BooksService,
              private router: Router,
              public afAuth: AngularFireAuth) 
              {
                this.user = {
                  bookids: [],
                  email: '',
                  displayName: ''
                };
                this.useruid = ''
              }

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      if (user && user.uid) {
        this.useruid = user.uid
        this.user.displayName = user.displayName!
        this.getDataUser(this.useruid)
      }
    });
  }

  getDataUser(userid: string) {
    this.SpinnerService.show()
    this.userService.getUserFirestore(userid).then(
      (user) => {
        this.user = user.data()!;
          if (this.user.bookids == null) {
            this.user.bookids = []
          } else {
            for (const value of this.user.bookids) {
              this.booksService.getSingleBookFirestore(value).then((doc) => {
                this.books.push(doc.data()!)
              })
            }
          }
        this.SpinnerService.hide()
      }
    );
  }

  removeUserBook(idbookindex: number) {
    if (idbookindex > -1) {
      this.books.splice(idbookindex, 1);
      this.user.bookids.splice(idbookindex, 1);
    }
    this.userService.removebookUserfirestore(this.user.bookids, this.useruid);
    Swal.fire('Bravo !', "Votre livre a bien été supprimé", 'success');
  }
}
