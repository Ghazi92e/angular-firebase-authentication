import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { User } from '../_models/User.model';
import { NgAuthService } from './ng-auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  user: User = new User;
  userSubject = new Subject<User>();

  constructor(
    private afDatabase: AngularFireDatabase,
    private ngAuthService: NgAuthService

  ) { }

  emitUser() {
    this.userSubject.next(this.user);
  }


  saveUser() {
    this.afDatabase.database.ref('/users').set(this.user);
  }

  addUser(user: User) {
    this.afDatabase.database.ref('/users/' + this.ngAuthService.userAuth.uid).set(user);
  }

  addbookidsUser(addidbook: string[] = []) {
    this.afDatabase.database.ref('/users/' + this.ngAuthService.userAuth.uid + '/bookids').set(addidbook);
  }

  getUser() {
    this.afDatabase.database.ref('/users/' + 'fnceL3JfqzgdVPLiRi5dHekMj2y1')
    .on('value', (data) => {
      this.user = data.val() ? data.val() : [];
      this.emitUser();
    })
  }

  removeBookUser(id: number) {
    var adaRef = this.afDatabase.database.ref('/users/' + this.ngAuthService.userAuth.uid + '/bookids/' + id);
    adaRef.remove()
      .then(function() {
        console.log("Remove succeeded.")
      })
      .catch(function(error) {
        console.log("Remove failed: " + error.message)
      });
  }
}