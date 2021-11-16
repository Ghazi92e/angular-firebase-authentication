import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { User } from 'src/app/_models/User.model';
import { UsersService } from 'src/app/_services/users.service';

@Component({
  selector: 'app-user-book',
  templateUrl: './user-book.component.html',
  styleUrls: ['./user-book.component.css']
})
export class UserBookComponent implements OnInit {
  
  user: User = new User();
  userSubscription: Subscription = new Subscription;

  constructor(private userService: UsersService, 
              private SpinnerService: NgxSpinnerService,
              public afAuth: AngularFireAuth) { }

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      if (user && user.uid) {
        this.userService.getUser(user.uid);
      }
    });

    this.SpinnerService.show()
    this.userSubscription = this.userService.userSubject.subscribe(
      (user: User) => {
        this.user = user;
        this.SpinnerService.hide();
      }
    );
  }

  removeBook(idbookindex: number) {
    this.userService.removeBookUser(idbookindex);
    if (this.user.bookids) {
      this.user.bookids = this.user.bookids.join('').split('');
      this.userService.updateUser(this.user);
    };
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

}
