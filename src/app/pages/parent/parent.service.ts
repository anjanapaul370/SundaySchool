import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/firestore';
import { map } from 'rxjs/operators';
import { ParentData } from './parent.model';

@Injectable({
  providedIn: 'root',
})
export class ParentService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private db: AngularFirestore, public snackbar: MatSnackBar) {}

  fetchParent(): Observable<ParentData[]> {
    return this.db
      .collection('parent', (ref) =>
        ref.where('is_deleted', '==', false).orderBy('created', 'asc')
      )
      .snapshotChanges()
      .pipe(
        map((arr) => {
          return arr.map((action) => {
            return {
              id: action.payload.doc.id,
              ...(action.payload.doc.data() as object),
            } as ParentData;
          });
        })
      );
  }

  addParentToDatabase(parent: ParentData) {
    return this.db.collection('parent').add({
      ...parent,
      created: this.timestamp,
      updated: null,
      is_deleted: false,
      role: {
        parent: true,
      },
    });
  }

  existingParents() {
    return this.db
      .collection('parent', (ref) =>
        ref.where('is_deleted', '==', false).orderBy('name', 'asc')
      )
      .get()
      .toPromise()
      .then((data) => {
        return data.docs.map(doc => {
          return {
            id: doc.id,
            ...(doc.data() as object)
          } as ParentData;
        })
      });
  }

  updateParent(id: string, data: any) {
    return this.db
      .collection('parent')
      .doc(id)
      .update({ ...data, updated: this.timestamp });
  }

  deleteParent(id: string) {
    return this.db.collection('parent').doc(id).update({ is_deleted: true });
  }

  get timestamp() {
    return firebase.serverTimestamp();
  }
}
