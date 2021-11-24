import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { NgAuthService } from 'src/app/_services/ng-auth.service';
import { updateProfile } from "firebase/auth";
import Swal from 'sweetalert2';
import { UsersService } from 'src/app/_services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  user: any

  constructor(public ngAuthService: NgAuthService, public afAuth: AngularFireAuth, public userService: UsersService, public router: Router) { }

  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      if (user && user.uid) {
        this.user = user;
      };
    });
  }

  UpdateUserName(displayName: string) {
    updateProfile(this.user, { displayName: displayName }).then(() => {
      this.userService.updateUsername(displayName, this.user.uid)
      this.router.navigate(['dashboard']);
        Swal.fire('Bravo', 'Votre profil a été modifié', 'success');
      }).catch((error) => {
        Swal.fire('Erreur', error, 'error');
      })
  }

}
