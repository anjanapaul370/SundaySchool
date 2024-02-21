import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { ClassData } from './classes.model';
import * as firebase from 'firebase/firestore';
import { first, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class ClassesService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  record: any = [];

  constructor(private db: AngularFirestore, public snackbar: MatSnackBar) {}

  fetchClasses(): Observable<ClassData[]> {
    return this.db
      .collection('classes', (ref) =>
        ref.where('is_deleted', '==', false).orderBy('name', 'asc')
      )
      .snapshotChanges()
      .pipe(
        map((arr) => {
          return arr.map((action) => {
            return {
              id: action.payload.doc.id,
              ...(action.payload.doc.data() as object),
            } as ClassData;
          });
        })
      );
  }

  addClassToDatabase(classes: ClassData) {
    return this.db.collection('classes').add({
      ...classes,
      created: this.timestamp,
      updated: null,
      is_deleted: false,
    });
  }

  updateClass(id: string, data: any) {
    return this.db
      .collection('classes')
      .doc(id)
      .update({ ...data, updated: this.timestamp });
  }

  deleteClass(id: string) {
    return this.db.collection('classes').doc(id).update({ is_deleted: true });
  }

  // existingClass() {
  //   return this.db
  //     .collection('classes')
  //     .get()
  //     .toPromise()
  //     .then((data) => {
  //           return data.docs.map(doc => doc.id);
  //     });
  // }

  // existingClass(){
  //   return this.db.collection("classes").snapshotChanges().pipe(map(actions => {
  //     return actions.map(a => {
  //       return {
  //         id: a.payload.doc.id,
  //         ...(a.payload.doc.data() as object)
  //       }
  //     })
  //   }))
  // }

  existingClass() {
    return this.db
      .collection('classes', (ref) =>
        ref.where('is_deleted', '==', false).orderBy('name', 'asc')
      )
      .get()
      .toPromise()
      .then((data) => {
        return data.docs.map(doc => {
          return {
            id: doc.id,
            ...(doc.data() as object)
          } as ClassData;
        })
      });
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
