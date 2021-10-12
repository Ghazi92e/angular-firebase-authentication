import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/User.model';
import { NgAuthService } from 'src/app/_services/ng-auth.service';
import { UsersService } from 'src/app/_services/users.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user: User | any

  constructor(public ngAuthService: NgAuthService, public userService: UsersService) { }

  ngOnInit(): void {
    /*
    const newUser = new User();
    newUser.id = this.ngAuthService.user.uid
    this.userService.createNewUser(newUser)
    console.log("user ajouté")
    */
  }

}
