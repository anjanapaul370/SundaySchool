import { Component, OnDestroy, OnInit, Inject, ViewChild } from '@angular/core';
import { StudentData, StudentDialogData } from './student.model';
import { Subscription } from 'rxjs';
import { StudentService } from './student.service';

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AuthService } from '../../auth/auth.service';
import { ClassesService } from '../classes/classes.service';
import { ClassData } from '../classes/classes.model';
import { TeacherData } from '../teacher/teacher.model';
import {
  AngularFireAuth,
  AngularFireAuthModule,
} from '@angular/fire/compat/auth';
import { ParentService } from '../parent/parent.service';
import { ParentData } from '../parent/parent.model';
import { NbAlertComponent, NbStatusService } from '@nebular/theme';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss'],
})
export class StudentComponent implements OnInit {
  displayedColumns = [
    'name',
    'email',
    'mob',
    'parent_name',
    'parent_mob',
    'actions',
  ];
  dataSource = new MatTableDataSource<StudentData>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  private studentSubscription: Subscription;
  student: StudentData[];
  teacher: TeacherData;
  classId: string;
  admin: any;
  class: ClassData;
  classes: ClassData[] = [];
  loaded: boolean;
  students: StudentData;

  constructor(
    private studentService: StudentService,
    private dialog: MatDialog,
    private afAuth: AngularFireAuth,
    private authService: AuthService,
    private classService: ClassesService,
    private db: AngularFirestore
  ) {}

  async ngOnInit() {
    let user = await this.afAuth.currentUser;

    if ((await user.getIdTokenResult()).claims['teacher']) {
      this.teacher = await this.authService.getTeacher(user.email);
    }
    if (this.teacher) {
      this.classId = this.teacher.class_id;
      this.fetch();
    }
    //checks admin
    if ((await user.getIdTokenResult()).claims['admin']) {
      this.admin = true;
      this.classes = await this.classService.existingClass();
    }
  }

  fetch() {
    this.studentSubscription = this.studentService
      .fetchStudent(this.classId)
      .subscribe((student: StudentData[]) => {
        this.dataSource.data = student;
        //console.log(this.dataSource.data);
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  classValue(class_id) {
    this.classId = class_id;
    console.log('class selected', this.classId);
    this.loaded = true;
    this.fetch();
  }

  doFilter(filteredValue: string) {
    this.dataSource.filter = filteredValue.trim().toLowerCase();
  }

  openDialog(): void {
    const data: StudentDialogData = {
      type: 'add',
      classId: this.classId,
    };
    const dialogRef = this.dialog.open(StudentdialogComponent, {
      width: '300px',
      hasBackdrop: true,
      data: data,
    });
  }

  editDialog(_student: StudentData) {
    const data: StudentDialogData = {
      _student: _student,
      type: 'edit',
    };
    const dialogRef = this.dialog.open(StudentdialogComponent, {
      width: '500px',
      data: data,
    });
  }

  deleteStudent(_student: StudentData) {
    this.studentService
      .deleteStudent(_student.id)
      .then(() => {
        this.authService.showSnackbar(
          'Deleted student successfully',
          null,
          3000
        );
      })
      .catch((err) => console.log(err));
  }

  deleteAlert(_student: StudentData) {
    if (confirm('Are you sure to delete?')) {
      this.deleteStudent(_student);
    }
  }

  resend(_student: StudentData) {
    this.authService.resendMail(_student);
  }

  viewStudent(_student: StudentData) {
    const data: StudentDialogData = {
      _student: _student,
      type: 'view',
    };
    const dialogRef = this.dialog.open(StudentdialogComponent, {
      width: '300px',
      data: data,
    });
  }
}

@Component({
  selector: 'app-student-dialog',
  templateUrl: './student-dialog.component.html',
})
export class StudentdialogComponent extends NbAlertComponent implements OnInit {
  _student: StudentData;
  studentForm: FormGroup;
  loaded: boolean = false;
  class: ClassData;
  parent: ParentData;
  classes: ClassData[] = [];
  parents: ParentData[] = [];
  teacher: TeacherData;
  classId: string;
  admin: boolean;

  constructor(
    statusService: NbStatusService,
    public dialogRef: MatDialogRef<StudentdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StudentDialogData,
    private _fb: FormBuilder,
    private studentService: StudentService,
    private authService: AuthService,
    private parentService: ParentService,
    private afAuth: AngularFireAuth
  ) {
    super(statusService);
  }

  async ngOnInit() {
    // this.classes = await this.classService.existingClass();
    this.parents = await this.parentService.existingParents();
    this.initForm();

    let user = await this.afAuth.currentUser;

    if ((await user.getIdTokenResult()).claims['teacher']) {
      this.teacher = await this.authService.getTeacher(user.email);
    }
    if (this.teacher) {
      this.classId = this.teacher.class_id;
      console.log(this.classId);
    }
    //checks admin
    if ((await user.getIdTokenResult()).claims['admin']) {
      this.admin = true;
      this.classId = this.data.classId;
    }

    if (this.data.type == 'edit') this.patchFormValues(); //edit

    //to find out parent name
    if (this.data.type == 'view') {
      this.parent = this.parents.find((_parent) => {
        //console.log(_parent);
        //console.log(this.data._student.parent_id == _parent.id);
        return this.data._student.parent_id == _parent.id;
      });
      console.log(this.parent.name);
    }
    this.loaded = true;
  }

  initForm() {
    this.studentForm = this._fb.group({
      name: [null, Validators.required],
      //class_id: [null, Validators.required],
      email: [null],
      mob: [null],
      parent_id: [null, Validators.required],
      // parent_email: [null, Validators.required],
      // parent_mob: [null, Validators.required],
    });
  }

  patchFormValues() {
    this.studentForm.patchValue({
      name: this.data._student.name,
      // class_id: this.data._student.class_id,
      email: this.data._student.email,
      mob: this.data._student.mob,
      parent_id: this.data._student.parent_id,
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onSubmit() {
    let data = Object.assign({}, this.studentForm.value);
    if (this.studentForm.valid) {
      this.parent = this.parents.find((_parent) => {
        return data.parent_id == _parent.id;
      });
      console.log(this.parent.name);

      data.parent_name = this.parent.name;
      data.parent_mob = this.parent.mob;
      // data.class_id = this.classId;
      console.log(data);

      if (!this.data._student) {
        console.log(data.parent_id);
        this.authService.createStudent(data, this.classId);
        this.dialogRef.close();
      } else {
        this.studentService
          .updateStudent(this.data._student.id, data)
          .then(() => {
            this.authService.showSnackbar('updated the student', null, 3000);
          });
        this.dialogRef.close();
      }
    }
  }
}
