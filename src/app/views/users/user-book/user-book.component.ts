import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { Book } from 'src/app/_models/Book.model';
import { User } from 'src/app/_models/User.model';
import { BooksService } from 'src/app/_services/books.service';
import { NgAuthService } from 'src/app/_services/ng-auth.service';
import { UsersService } from 'src/app/_services/users.service';

@Component({
  selector: 'app-user-book',
  templateUrl: './user-book.component.html',
  styleUrls: ['./user-book.component.css']
})
export class UserBookComponent implements OnInit {
  
  user: User | any;
  userSubscription: Subscription = new Subscription;

  constructor(private userService: UsersService, private SpinnerService: NgxSpinnerService, private booksService: BooksService, private ngAuthService: NgAuthService) { }

  ngOnInit(): void {
    this.user = new User();
    this.SpinnerService.show()
    this.userSubscription = this.userService.userSubject.subscribe(
      (user: User) => {
        this.user = user;
        console.log(this.user);
        this.SpinnerService.hide();
      }
    );
    if (this.ngAuthService.userAuth.uid !== null) {
      this.userService.getUsers();
    }
  }

  removeBook(idbookindex: number) {
    this.userService.removeBookUser(idbookindex);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

}
