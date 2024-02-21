import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { StudentData } from '../student/student.model';
import * as firebase from 'firebase/firestore';
// import { StudentAttendance } from './students/students.component';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  today = new Date();
  date = new Date(
    this.today.getFullYear(),
    this.today.getMonth(),
    this.today.getDate()
  );
  constructor(private db: AngularFirestore) {}

  fetchStudent(class_id: string): Observable<StudentData[]> {
    return this.db
      .collection('student', (ref) =>
        ref.where('class_id', '==', class_id)
      )
      .snapshotChanges()
      .pipe(
        map((arr) => {
          return arr.map((action) => {
            return {
              id: action.payload.doc.id,
              name: action.payload.doc.data.name,
              ...(action.payload.doc.data() as object),
            } as StudentData;
          });
        })
      );
  }

  addPresentToDatabase(presentRecord: any, date: Date) {
    return this.db.collection('attend_student').add({
      date: date,
      ...presentRecord,
    });
  }

  recordFound(class_id: string, date: Date) {
    return this.db
      .collection('attend_student', (ref) =>
        ref.where('date', '==', date).where('class_id', '==', class_id).limit(1)
      )
      .get()
      .toPromise()
      .then((data) => {
        if (data.empty) return false;
        else
          return {
            id: data.docs[0].id,
            ...(data.docs[0].data() as object),
          };
      });
  }

  updateStudentAttendance(docId: string, absentRecord: any, date: Date) {
    return this.db
      .collection('attend_student')
      .doc(docId)
      .update({
        ...absentRecord,
        date: date,
      });
  }

  get timestamp() {
    return firebase.serverTimestamp();
  }
}
