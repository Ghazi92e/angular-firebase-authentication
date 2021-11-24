import { Injectable, NgZone } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/compat/firestore";
import { Router } from "@angular/router";
import firebase from "firebase/compat/app";
export interface User {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string;
    emailVerified: boolean;
}

@Injectable({
    providedIn: 'root'
})

export class NgAuthService {
    userAuth: any;

    constructor(
        public afs: AngularFirestore,
        public afAuth: AngularFireAuth,
        public router: Router,
        public ngZone: NgZone
    ) {
        this.afAuth.authState.subscribe(user => {
          this.userAuth = user;
            if (user) {
              localStorage.setItem('user', JSON.stringify(this.userAuth));
              JSON.parse(localStorage.getItem('user') || '{}');
            } else {
              localStorage.setItem('user', 'null');
              JSON.parse(localStorage.getItem('user') || '{}');
            }
        })
      }

    SignIn(email: string, password: string) {
      return this.afAuth.signInWithEmailAndPassword(email, password)
        .then((result) => {
          this.ngZone.run(() => {
            this.router.navigate(['dashboard']);
          });
          this.SetUserData(result.user);
          }).catch((error) => {
            window.alert(error.message)
          })
    }

    SignUp(email: string, password: string) {
      return this.afAuth.createUserWithEmailAndPassword(email, password)
        .then((result) => {
          // this.SendVerificationMail();
          this.SetUserData(result.user);
          this.router.navigate(['dashboard']);
          }).catch((error) => {
            window.alert(error.message)
          })
    }

    SendVerificationMail() {
      return this.afAuth.currentUser.then(u => u!.sendEmailVerification())
      .then(() => {
        this.router.navigate(['email-verification']);
      })
    }

    ForgotPassword(passwordResetEmail: string) {
      return this.afAuth.sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
        }).catch((error) => {
          window.alert(error)
        })
    }

    get isLoggedIn(): boolean {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return (user !== null) ? true : false;
    }
    // && user.emailVerified !== false

    GoogleAuth() {
      return this.AuthLogin(new firebase.auth.GoogleAuthProvider())
    }

    AuthLogin(provider: firebase.auth.AuthProvider) {
      return this.afAuth.signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        })
          this.SetUserData(result.user);
        }).catch((error) => {
          window.alert(error)
        })
    }

    SetUserData(user: any) {
      const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
      const userState: User = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
      }
      return userRef.set(userState, {
        merge: true
      })
    }

    SignOut() {
      return this.afAuth.signOut().then(() => {
        localStorage.removeItem('user');
        this.router.navigate(['sign-in']);
      })
    }
}

