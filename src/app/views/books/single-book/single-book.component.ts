import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { Book } from 'src/app/_models/Book.model';
import { FileUpload } from 'src/app/_models/Fileupload.model';
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
  user: User | any;
  userSubscription: Subscription = new Subscription;

  addidbook: string[] = [];
  id = this.route.snapshot.params['id'];
  checkdoublebook: boolean = false;

  constructor(private route: ActivatedRoute,
              private booksService: BooksService,
              private userService: UsersService,
              private ngAuthService: NgAuthService,
              private SpinnerService: NgxSpinnerService,
              private uploadService: UploadFileService,
              private router: Router) {
              }

  ngOnInit() {
    this.SpinnerService.show()
    this.user = new User();
    this.userSubscription = this.userService.userSubject.subscribe(
      (user: User) => {
        this.user = user;
        console.log(this.user);
        this.SpinnerService.hide();
      }
    );
    // if(this.ngAuthService.userAuth.uid === undefined) {return}
    this.userService.getUser();

    this.book = new Book('', ''); // crée un Book vide pour eviter les erreurs
    const id = this.route.snapshot.params['id'];
    this.booksService.getSingleBook(+id).then( // '+id' pour le cast en tant que number
      (book) => {
        this.book = book;
        console.log(this.book);
      }
    );
    this.removeoraddbook();
  }

  createNewUser() {
    this.user = new User();
    this.user.name = this.ngAuthService.userAuth.displayName;
    this.user.email = this.ngAuthService.userAuth.email;
    this.userService.addUser(this.user);
  }

  removeoraddbook() {
    if (this.user.bookids) {
      for (var value of this.user.bookids) {
        if (this.id == value) {
          console.log("TRUE");
          this.checkdoublebook = true;
          console.log(this.checkdoublebook);
        }
      }
    }
  }

  delbook(indexbook: string) {
    const index = this.user.bookids.indexOf(indexbook);
    if (index > -1) {
      this.userService.removeBookUser(index);
    }
    if (this.user.bookids) {
      let data = this.user.bookids.join('').split('');
      this.userService.addbookidsUser(data);
      console.log(data);
    }
    this.router.navigate(['/books']);
    Swal.fire('Bravo !', "Votre livre a bien été supprimé", 'success');
  }

  addidbooktoUser() {
    const id = this.route.snapshot.params['id'];
    //this.user = new User(id);
    if (this.user.bookids) {
      for (var value of this.user.bookids) {
        if (value) {
          this.addidbook.push(value);
        }
      }
    }
    this.addidbook.push(id);
    console.log(this.addidbook);
    this.userService.addbookidsUser(this.addidbook);
    this.router.navigate(['/books']);
    Swal.fire('Bravo !', "Votre livre a été ajouté", 'success');
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
  }

}
