import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getAuth } from 'firebase/auth';

import { Router } from '@angular/router';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment.prod';

import * as firebase from 'firebase/firestore';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { AuthCredential, EmailAuthProvider } from 'firebase/auth';
import { TeacherData } from '../pages/teacher/teacher.model';
import { StudentData } from '../pages/student/student.model';

@Injectable()
export class AuthService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  authChange = new Subject<boolean>();
  private isAuthenticated = false;
  newUser: boolean;
  teacher: Promise<TeacherData>;

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private snackbar: MatSnackBar,
    private http: HttpClient,
    private db: AngularFirestore,
    private fun: AngularFireFunctions
  ) {
    this.afAuth.authState.subscribe((user) => {
      console.log(user);

      // const auth = getAuth();
      // const signInDate = auth.currentUser.metadata.lastSignInTime;
      // console.log('signin time', signInDate);
    });
  }

  registerUser(authData: AuthData) {
    this.afAuth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        result.user.updateProfile({
          displayName: authData.name,
        });
        let data = Object.assign({}, authData);
        delete data.password;
        return (
          this.db.collection('user').add({
            ...data,
            created: this.timestamp,
            role: {
              admin: true,
              teacher: false,
              student: false,
            },
          }),
          this.isAdmin(data.email),
          this.getCustomToken(),
          this.authSuccessfully(),
          this.showSnackbar('Successfully registered new user', null, 2000)
        );
      })
      .catch((error) => {
        this.showSnackbar(error.message, null, 5000);
        console.log(error);
      });
  }

  createTeacher(data: TeacherData) {
    const createTeacher = this.fun.httpsCallable('createTeacher');
    return createTeacher({
      name: data.name,
      email: data.email,
      mob: data.mob,
      class_id: data.class_id,
    }).subscribe(() => {
      console.log('teacher created');
      //this.sendWelcome(email, name, password);
    });
  }

  createStudent(data: StudentData, class_id: string) {
    const createStudent = this.fun.httpsCallable('createStudent');
    return createStudent({
      name: data.name,
      email: data.email,
      mob: data.mob,
      parent_id: data.parent_id,
      parent_mob: data.parent_mob,
      parent_name: data.parent_name,
      class_id: class_id,
    }).subscribe((error) => {
      console.log(error.errorInfo.message);
      this.showSnackbar(error.errorInfo.message, null, 3000);
      //this.sendWelcome(email, name, password);
    });
  }

  // sendWelcome(email: string, name: string, password: string) {
  //   const sendWelcomeEmail = this.fun.httpsCallable('sendWelcomeEmail');
  //   return sendWelcomeEmail({
  //     name: name,
  //     email: email,
  //     password: password,
  //   }).subscribe(() => {
  //     console.log('welcome mail sent');
  //   });
  // }

  resendMail(teacher: TeacherData) {
    const updatePassword = this.fun.httpsCallable('updatePassword');
    return updatePassword({
      uid: teacher.uid,
      name: teacher.name,
      email: teacher.email,
    }).subscribe(() => {
      console.log('welcome mail sent');
    });
  }

  login(authData: AuthData) {
    this.afAuth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(async (result) => {
        console.log(authData.email);
        this.authSuccessfully();
        console.log('login ', this.isAuth());
        this.showSnackbar('Successfully logged in', null, 3000);
        this.getCustomToken();
        // this.newUser = result.additionalUserInfo.isNewUser;  to test the user is already signedIn
        let user = this.afAuth.currentUser;
        if ((await (await user).getIdTokenResult()).claims['teacher']) {
          this.teacher = this.getTeacher((await user).email);
          return this.db
            .collection('teacher')
            .doc((await this.teacher).id)
            .update({ isNewUser: false });
        }
        if ((await (await user).getIdTokenResult()).claims['student']) {
        }
      })
      .catch((error) => {
        console.log(error);
        this.showSnackbar('The email or password is invalid.', null, 3000);
      });
  }

  async changePassword(data: any) {
    const user = await this.afAuth.currentUser;
    const token = await user.getIdToken();
    const API_KEY = environment.firebase.apiKey;
    let credential: AuthCredential;
    credential = EmailAuthProvider.credential(user.email, data.oldpassword);
    let reauthenticatedUser = await user.reauthenticateWithCredential(
      credential
    );
    if (reauthenticatedUser) {
      return this.http
        .post<any>(
          `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${API_KEY}`,
          {
            idToken: token,
            password: data.newpassword,
            returnSecureToken: true,
          }
        )
        .toPromise()
        .then((res) => {
          this.showSnackbar('Successfully changed password', null, 3000);
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
          this.showSnackbar('Old password does not match', null, 3000);
        });
    }
  }

  isAdmin(email: string) {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    var admin = this.http
      .post(
        'https://us-central1-sunday-school-7fe91.cloudfunctions.net/grantAdminRole',
        JSON.stringify({ email: email }),
        httpOptions
      )
      .toPromise()
      .then((res) => {
        console.log(res);
      });
  }

  getTeacher(email: string) {
    return this.db
      .collection('teacher', (ref) => ref.where('email', '==', email))
      .get()
      .toPromise()
      .then((data) => {
        return {
          id: data.docs[0].id,
          ...(data.docs[0].data() as object),
        } as TeacherData;
      });
  }

  getStudent(email: string) {
    return this.db
      .collection('student', (ref) => ref.where('email', '==', email))
      .get()
      .toPromise()
      .then((data) => {
        return {
          id: data.docs[0].id,
          ...(data.docs[0].data() as object),
        } as StudentData;
      });
  }

  getAdmin(email: string) {
    return this.db
      .collection('user', (ref) => ref.where('email', '==', email))
      .get()
      .toPromise()
      .then((data) => {
        return {
          id: data.docs[0].id,
          ...(data.docs[0].data() as object),
        };
      });
  }

  getCustomToken() {
    this.afAuth.idTokenResult.subscribe((data) => {
      if (data.claims) {
        console.log('role is ', data.claims);
      }
    });
  }

  logout() {
    this.afAuth.signOut();
    this.authChange.next(false);
    this.router.navigate(['/auth']);
    this.isAuthenticated = false;
    console.log('login is', this.isAuth());
  }

  resetPasswordInit(email: string) {
    return this.afAuth.sendPasswordResetEmail(email);
  }

  isAuth() {
    return this.isAuthenticated;
  }

  getAuth() {
    return this.afAuth.authState;
  }

  showSnackbar(message, action, duration) {
    this.snackbar.open(message, action, {
      duration: duration,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  private authSuccessfully() {
    this.isAuthenticated = true;
    this.authChange.next(true);
    this.router.navigate(['/pages']);
  }

  get timestamp() {
    return firebase.serverTimestamp();
  }
}
