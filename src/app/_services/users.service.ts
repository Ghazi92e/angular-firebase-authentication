import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { User } from './ng-auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  userFire: AngularFirestoreCollection<User>;
  dbPath = 'users';

  constructor( private afStore: AngularFirestore ) { this.userFire = this.afStore.collection(this.dbPath) }

  getUserFirestore(userid: string) {
    return this.userFire.doc(userid).get();
  }

  updateBookUser(bookids: string[], userid: string) {
    this.userFire.doc(userid).update({bookids});
  }

  removebookUserfirestore(bookids: string[], userid: string) {
    this.userFire.doc(userid).update({bookids});
  }
}