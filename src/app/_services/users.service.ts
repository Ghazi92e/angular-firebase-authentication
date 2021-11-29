import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { User } from '../_models/User.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  userFire: AngularFirestoreCollection<User>;
  dbPath = 'users';

  constructor( private afStore: AngularFirestore ) { this.userFire = this.afStore.collection(this.dbPath) }

  getUserFirestore(userid: string) {
    return this.userFire.doc(userid).ref.get();
  }

  updateUser(user: User, userid: string) {
    this.userFire.doc(userid).set(user);
  }

  updateUsername(displayName: string, userid: string) {
    this.userFire.doc(userid).update({displayName})
  }
}