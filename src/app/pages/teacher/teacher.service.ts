import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TeacherData } from './teacher.model';
import * as firebase from 'firebase/firestore';
import { AngularFireFunctions } from '@angular/fire/compat/functions';
import { HttpClientModule } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    private db: AngularFirestore,
    public snackbar: MatSnackBar,
    private fun: AngularFireFunctions,
    private http: HttpClientModule
  ) {}

  fetchTeacher(): Observable<TeacherData[]> {
    return this.db
      .collection('teacher', (ref) =>
        ref.where('is_deleted', '==', false).orderBy('created', 'desc')
      )
      .snapshotChanges()
      .pipe(
        map((arr) => {
          return arr.map((action) => {
            return {
              id: action.payload.doc.id,
              ...(action.payload.doc.data() as object),
            } as TeacherData;
          });
        })
      );
  }

  addTeacherToDatabase(teacher: TeacherData) {
    return this.db.collection('teacher').add({
      ...teacher,
      created: this.timestamp,
      updated: null,
      is_deleted: false,
      isNewUser: true,
      role: {
        admin: false,
        teacher: true,
        student: false,
      },
    });
  }

  updateTeacher(id: string, data: any) {
    return this.db
      .collection('teacher')
      .doc(id)
      .update({ ...data, updated: this.timestamp });
  }

  deleteTeacher(id: string) {
    return this.db.collection('teacher').doc(id).update({ is_deleted: true });
  }

  get timestamp() {
    return firebase.serverTimestamp();
  }
}
