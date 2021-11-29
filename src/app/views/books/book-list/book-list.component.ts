import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Book } from 'src/app/_models/Book.model';
import { BooksService } from 'src/app/_services/books.service';
import { NgAuthService} from 'src/app/_services/ng-auth.service';
import { UsersService } from 'src/app/_services/users.service';
import Swal from 'sweetalert2';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from 'src/app/_models/User.model';


@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})

export class BookListComponent implements OnInit {

  books: Book[] = []
  useruid: string
  idbook: string[] = []
  user: User

  constructor(private booksService: BooksService,
              private router: Router, 
              private SpinnerService: NgxSpinnerService,
              public ngAuthService: NgAuthService,
              private userService: UsersService,
              public afAuth: AngularFireAuth ) {
                this.user = {
                  bookids: [],
                  email: '',
                  displayName: ''
                };
                this.useruid = '';
              }

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      if (user && user.uid) {
        this.useruid = user.uid;
        this.user.email = user.email!;
        this.user.displayName = user.displayName!;
        this.getDataUser(this.useruid);
      };
    });
    this.getBookFirestore();
  }

  getBookFirestore(){
    this.SpinnerService.show()
    this.booksService.getBooksFirestore().then((data) => {
     data.forEach((doc) => {
        this.books.push(doc.data())
        this.idbook.push(doc.id)
      })
      this.SpinnerService.hide()
    })
  }

  getDataUser(userid: string) {
    this.userService.getUserFirestore(userid).then(
      (user) => {
        this.user = user.data()!;
        console.log(this.user);
      }
    );
  }

  addidbooktoUser(id: string) {
    if (this.user.bookids == null) {
      this.user.bookids = []
      this.user.bookids.push(this.idbook[+id])
    } else {
      this.user.bookids.push(this.idbook[+id])
    } 
    this.userService.updateUser(this.user, this.useruid);
    Swal.fire('Bravo !', "Votre livre a bien été ajouté", 'success');
  }

  onNewBook() {
    this.router.navigate(['/books', 'create']);
  }
  
  onViewBook(id: number) {
    this.router.navigate(['/books', 'view', id]);
  }

  onDeleteBook(id: number) {
    if (id > -1) {
      this.books.splice(id, 1);
    }
    this.booksService.deleteBookFirestore(this.idbook[id])
  }
}

