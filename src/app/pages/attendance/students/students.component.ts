import { AfterViewInit, Component, Injectable, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { ClassData } from '../../classes/classes.model';
import { ClassesService } from '../../classes/classes.service';
import { StudentData } from '../../student/student.model';
import { TeacherData } from '../../teacher/teacher.model';
import { AttendanceService } from '../attendance.service';
@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss'],
})
export class StudentsComponent implements AfterViewInit {
  formGroup: FormGroup;
  displayedColumns: string[] = ['student', 'status'];
  dataSource: MatTableDataSource<StudentData>;
  date: Date = new Date();
  record: any;
  teacher: TeacherData;
  classId: string;
  classes: ClassData[];
  class: ClassData;
  today = new Date();
  datePicked = new Date(
    this.today.getFullYear(),
    this.today.getMonth(),
    this.today.getDate()
  );
  minDate = new Date(2021, 2, 1);
  maxDate = new Date();

  private studentSubscription: Subscription;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private attendService: AttendanceService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    private classService: ClassesService,
    private router: Router
  ) {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource();
    this.formGroup = formBuilder.group({
      attendance_absent: new FormControl(null, []),
    });
  }

  async ngOnInit() {
    this.classes = await this.classService.existingClass();
    let user = await this.afAuth.currentUser;
    // if ((await user.getIdTokenResult()).claims['admin']) {
    //   console.log("user is admin");
    // }
    if ((await user.getIdTokenResult()).claims['teacher']) {
      this.teacher = await this.authService.getTeacher(user.email);
      console.log(this.teacher);
    }
    if (this.teacher) {
      this.classId = this.teacher.class_id;
      await this.recordFound();
      this.fetchAttendanceStudent();
    }
    console.log(this.classId);
    this.class = this.classes.find((_class) => {
      return this.teacher.class_id == _class.id;
    });
    //console.log('class name', this.class.name);
  }

  async recordFound() {
    this.record = await this.attendService.recordFound(
      this.classId,
      this.datePicked
    );
    console.log(this.record);
  }

  // classValue(classvalue: string){
  //   this.classId = classvalue;
  //   console.log(this.classId);
  // }

  fetchAttendanceStudent() {
    this.studentSubscription = this.attendService
      .fetchStudent(this.classId)
      .subscribe((students: StudentData[]) => {
        this.dataSource.data = students;
        if (students.length > 0) {
          students.forEach((student) => {
            if (!this.record) {
              this.formGroup.addControl(
                student.id,
                this.formBuilder.control(null)
              );
            } else {
              //console.log(this.record.absentees.includes(student.id));
              if (this.formGroup.get(student.id)) {
                this.formGroup
                  .get(student.id)
                  .patchValue(this.record.present.includes(student.id));
              } else
                this.formGroup.addControl(
                  student.id,
                  this.formBuilder.control(
                    this.record.present.includes(student.id)
                  )
                );
              console.log(this.formGroup.value);
            }
          });
        }
      });
  }

  async onFormSubmit() {
    let data = Object.assign({}, this.formGroup.value);
    let present = [];
    Object.keys(data).forEach((key) => {
      if (data[key]) {
        present.push(key);
      }
    });
    let presentRecord = {
      class_id: this.classId,
      present: present,
    };
    console.log('value of record from component', this.record);
    await this.recordFound();
    if (this.record == false) {
      //if no record
      this.attendService.addPresentToDatabase(presentRecord, this.datePicked);
      this.authService.showSnackbar(
        'attendance added successfully',
        null,
        5000
      );
    } else {
      this.attendService
        .updateStudentAttendance(this.record.id, presentRecord, this.datePicked)
        .then(() => {
          this.authService.showSnackbar(
            'Updated attendance successfully',
            null,
            4000
          );
        });
    }
    this.router.navigate(['/pages/attendance/view'])
  }

  async getDate(event: MatDatepickerInputEvent<Date>) {
    this.datePicked = event.value;
    console.log(this.datePicked);
    this.studentSubscription.unsubscribe();
    this.formGroup.reset();
    await this.recordFound();
    this.fetchAttendanceStudent();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  doFilter(filteredValue: string) {
    this.dataSource.filter = filteredValue.trim().toLowerCase();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
