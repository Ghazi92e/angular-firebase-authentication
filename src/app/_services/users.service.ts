import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AngularFireDatabase } from "@angular/fire/compat/database";
import { User } from '../_models/User.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  users: User[] = []; 
  booksSubject = new Subject<User[]>();

  constructor(
    private afDatabase: AngularFireDatabase,

  ) { }

  emitUsers() {
    this.booksSubject.next(this.users);
  }


  saveUsers() {
    this.afDatabase.database.ref('/users').set(this.users);
  }


  createNewUser(newUser: User) {
    this.users.push(newUser);
    this.saveUsers();
  }

  getUsers() {
    this.afDatabase.database.ref('/users')
      .on('value', (data) => {
        this.users = data.val() ? data.val() : [];
        this.emitUsers();
      })
  }

  removeUser(user: User) {
    const userIndexToRemove = this.users.findIndex(
      (bookEl) => {
        if(bookEl === user) {
          return true;
        } else {
          return false;
        }
      }
    );
    this.users.splice(userIndexToRemove, 1);
    this.saveUsers();
    this.emitUsers();
  }
}
