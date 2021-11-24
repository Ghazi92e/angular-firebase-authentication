import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Book } from 'src/app/_models/Book.model';
import { BooksService } from 'src/app/_services/books.service';
import { NgAuthService, User} from 'src/app/_services/ng-auth.service';
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
  useremail: string
  displayName: string
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
                  uid: '',
                  email: '',
                  displayName: '',
                  photoURL: '',
                  emailVerified: false,
                  bookids: []
                };
                this.book = {
                  title: '',
                  author: '',
                  url: ''
                }
                this.useruid = ''
                this.displayName = ''
                this.useremail = ''
              }

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user && user.uid) {
        this.useruid = user.uid;
        this.displayName = user.displayName!;
        this.useremail = user.email!;
        this.getDataUser(this.useruid);
      }
    });

    this.booksService.getBooksFirestore().then((data) => {
      data.forEach((docbookid) => {
        this.idbook.push(docbookid.id)
        this.SpinnerService.show()
        this.booksService.getSingleBookFirestore(this.idbook[this.id]).then((doc) => {
          this.book = doc.data()!
          this.SpinnerService.hide()
        })
      })
    })
  }

  getDataUser(userid: string) {
    this.userService.getUserFirestore(userid).subscribe(
      (user) => {
        this.user = user.data()!;
        console.log(this.user);
      }
    );
  }

  delbook(indexbook: string) {
    this.user.bookids.forEach((element, index)=>{
      if(element == indexbook) {
        this.user.bookids.splice(index, 1);
      }
    });
    this.userService.removebookUserfirestore(this.user.bookids, this.useruid);
    this.router.navigate(['/books']);
    Swal.fire('Bravo !', "Votre livre a bien été supprimé", 'success');
  }

  addidbooktoUser(id: string) {
    this.user.bookids.push(this.idbook[+id]);
    this.userService.updateBookUser(this.user.bookids, this.useruid);
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
