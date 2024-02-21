import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { StudentData } from './student.model';
import * as firebase from 'firebase/firestore';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private db: AngularFirestore, public snackbar: MatSnackBar, public af:AngularFireAuth) { }

  fetchStudent(classId: string): Observable<StudentData[]> {
    return this.db
      .collection('student', (ref) =>
        ref.where('is_deleted', '==', false).where('class_id', '==', classId)
          .orderBy('name', 'asc')
      )
      .snapshotChanges()
      .pipe(
        map((arr) => {
          return arr.map((action) => {
            return {
              id: action.payload.doc.id,
              ...(action.payload.doc.data() as object),
            } as StudentData;
          });
        })
      );
  }

  fetchParentName(){
  }

  addStudentToDatabase(data: any, classId: string) {
    return this.db
      .collection('student')
      .add({
        ...data,
        created: this.timestamp,
        updated: null,
        is_deleted: false,
        class_id: classId,
        role: {
          admin:false,
          teacher:false,
          student: true
        }
      });
  }

  updateStudent(id: string, data: any) {
    return this.db
      .collection('student')
      .doc(id)
      .update({ ...data, updated: this.timestamp });
  }

  deleteStudent(id: string) {
    return this.db.collection('student').doc(id).update({ is_deleted: true });
  }

  showSnackbar(message, action, duration) {
    this.snackbar.open(message, action, {
      duration: duration,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  get timestamp() {
    return firebase.serverTimestamp();
  }
}
