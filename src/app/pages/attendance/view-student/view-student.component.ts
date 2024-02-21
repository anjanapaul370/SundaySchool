import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { ClassData } from '../../classes/classes.model';
import { ClassesService } from '../../classes/classes.service';
import { StudentData } from '../../student/student.model';
import { TeacherData } from '../../teacher/teacher.model';
import { AttendanceService } from '../attendance.service';

@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.scss'],
})
export class ViewStudentComponent implements OnInit {
  minDate = new Date(2021, 2, 1);
  maxDate = new Date();
  today = new Date();
  datePicked = new Date(
    this.today.getFullYear(),
    this.today.getMonth(),
    this.today.getDate()
  );
  displayedColumns = ['student', 'present'];
  teacher: TeacherData;
  student: StudentData;
  dataSource: MatTableDataSource<StudentData>;
  classId: any;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  studentSubscription: any;
  studentId: any = [];
  presentData: any = [];
  students: StudentData[] = [];
  admin: boolean;
  loaded: boolean;
  classes: ClassData[] = [];
  formGroup: FormGroup;
  record: any;
  constructor(
    private attendService: AttendanceService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
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
    let user = await this.afAuth.currentUser;

    if ((await user.getIdTokenResult()).claims['teacher']) {
      this.teacher = await this.authService.getTeacher(user.email);
      console.log(this.teacher);
    }

    if (this.teacher) {
      this.classId = this.teacher.class_id;
      this.fetchName();
    }

    //checks admin
    if ((await user.getIdTokenResult()).claims['admin']) {
      this.admin = true;
      this.classes = await this.classService.existingClass();
    }
  }

  //for admin to get class
  classValue(class_id) {
    this.classId = class_id;
    console.log('class selected', this.classId);
    this.loaded = true;
    this.fetchName();
  }

  openAddAttendance() {
    this.router.navigate(['pages/attendance/students']);
  }

  async recordFound() {
    this.record = await this.attendService.recordFound(
      this.classId,
      this.datePicked
    );
    //console.log('datasource present student', this.record);
  }

  async fetchName() {
    await this.recordFound();
    this.studentSubscription = this.attendService
      .fetchStudent(this.classId)
      .subscribe((students: StudentData[]) => {
        this.dataSource.data = students; //details of all students
        //this.dataSource = new MatTableDataSource(students) ;
        //console.log(this.dataSource.data[0].id);
        if (students.length > 0) {
          //ifthereisstudentsintheclass
          students.forEach((student) => {
            if (!this.record) {
              console.log('no record');
            } else {
              // console.log(this.record.present.includes(student.id));
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
            }
            // console.log(this.formGroup.value);
          });
        }
      });
  }

  // if (this.presentData.present)
  //   this.dataSource = new MatTableDataSource(
  //     this.students.filter((student) =>
  //       this.presentData.present.includes(student.id)
  //     )
  //   );

  async getDate(event: MatDatepickerInputEvent<Date>) {
    this.datePicked = event.value;
    // console.log(this.datePicked);
    this.fetchName();
  }
}
