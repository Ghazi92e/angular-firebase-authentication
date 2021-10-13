import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from 'src/app/_models/User.model';
import { UsersService } from 'src/app/_services/users.service';

@Component({
  selector: 'app-user-book',
  templateUrl: './user-book.component.html',
  styleUrls: ['./user-book.component.css']
})
export class UserBookComponent implements OnInit {
  
  users: User[] = [];


  constructor(private userService: UsersService, private SpinnerService: NgxSpinnerService) { }

  ngOnInit(): void {
    this.SpinnerService.show()
    this.userService.booksSubject.subscribe(
      (users: User[]) => {
        this.users = users;
        this.SpinnerService.hide();
      }
    );
    this.userService.getUsers();
  }

}
