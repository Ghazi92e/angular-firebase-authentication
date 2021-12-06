import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Book } from 'src/app/_models/Book.model';
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

  book: Book
  user: User
  useruid: string
  idbook: string[] = []
  id = this.route.snapshot.params['id'];

  constructor(private route: ActivatedRoute,
              private booksService: BooksService,
              private userService: UsersService,
              public ngAuthService: NgAuthService,
              private SpinnerService: NgxSpinnerService,
              public afAuth: AngularFireAuth,
              private router: Router) 
              {
                this.user = {
                  bookids: [],
                  email: '',
                  displayName: ''
                };
                this.book = {
                  title: '',
                  author: '',
                  url: '',
                  categorie: ''
                }
                this.useruid = ''
              }

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user && user.uid) {
        this.useruid = user.uid;
        this.user.email = user.email!;
        this.user.displayName = user.displayName!;
        this.getDataUser(this.useruid);
      }
    });

    this.booksService.getBooksFirestore().then((data) => {
      data.forEach((docbookid) => {
        this.idbook.push(docbookid.id)
        this.SpinnerService.show()
        this.booksService.getSingleBookFirestore(this.id).then((doc) => {
          this.book = doc.data()!
          this.SpinnerService.hide()
        })
      })
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

  delbook(idbook: string) {
    this.user.bookids.forEach((element, index)=>{
      if(element == idbook) {
        this.user.bookids.splice(index, 1);
      }
    });
    this.userService.updateUser(this.user, this.useruid);
    this.router.navigate(['/books']);
    Swal.fire('Bravo !', "Votre livre a bien été supprimé", 'success');
  }

  addidbooktoUser(id: string) {
    if (this.user.bookids == null) {
      this.user.bookids = []
      this.user.bookids.push(this.id)
    } else {
      this.user.bookids.push(this.id)
    }
    this.userService.updateUser(this.user, this.useruid);
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
}
