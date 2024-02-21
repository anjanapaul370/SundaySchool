import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { ClassData } from '../classes/classes.model';
import { ClassesService } from '../classes/classes.service';
import { TeacherData, TeacherDialogData } from './teacher.model';
import { TeacherService } from './teacher.service';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss'],
})
export class TeacherComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['name', 'email', 'mob','actions'];
  dataSource = new MatTableDataSource<TeacherData>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  private teacherSubscription: Subscription;
  id: any;
  teacher: TeacherData[];

  constructor(
    private teacherService: TeacherService,
    public dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.teacherSubscription = this.teacherService
      .fetchTeacher()
      .subscribe((teacher: TeacherData[]) => {
        this.dataSource.data = teacher;
        //console.log(this.dataSource.data);
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  doFilter(filteredValue: string) {
    this.dataSource.filter = filteredValue.trim().toLowerCase();
  }

  openDialog(): void {
    const data: TeacherDialogData = {
      type: 'add',
    };
    const dialogRef = this.dialog.open(TeacherdialogComponent, {
      width: '300px',
      hasBackdrop: true,
      data: data,
    });
  }

  editDialog(_teacher: TeacherData) {
    const data: TeacherDialogData = {
      _teacher: _teacher,
      type: 'edit',
    };
    const dialogRef = this.dialog.open(TeacherdialogComponent, {
      width: '600px',
      data: data,
    });
  }

  resend(_teacher: TeacherData) {
    this.authService.resendMail(_teacher);
    // console.log("Teacher uid",_teacher.uid);
  }

  deleteTeacher(_teacher: TeacherData) {
    this.teacherService
      .deleteTeacher(_teacher.id)
      .then(() => {
        this.authService.showSnackbar(
          'Deleted teacher successfully',
          null,
          3000
        );
      })
      .catch((err) => console.log(err));
  }

  deleteAlert(_teacher: TeacherData) {
    if (confirm('Are you sure to delete?')) {
      this.deleteTeacher(_teacher);
    }
  }


  viewTeacher(_teacher: TeacherData) {
    const data: TeacherDialogData = {
      _teacher: _teacher,
      type: 'view',
    };
    const dialogRef = this.dialog.open(TeacherdialogComponent, {
      width: '300px',
      data: data,
    });
  }

  ngOnDestroy() {
    this.teacherSubscription.unsubscribe();
  }
}

@Component({
  selector: 'app-teacher-dialog',
  templateUrl: './teacher-dialog.component.html',
})
export class TeacherdialogComponent implements OnInit {
  classes: ClassData[] = [];
  loaded: boolean = false;
  _teacher: TeacherData;
  teacherForm: FormGroup;
  class: ClassData;

  constructor(
    public dialogRef: MatDialogRef<TeacherdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TeacherDialogData,
    private _fb: FormBuilder,
    private teacherService: TeacherService,
    private classService: ClassesService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    this.classes = await this.classService.existingClass();
    this.loaded = true;
    //console.log('existing classes', this.classes);

    //console.log(this.data._teacher);
    this.initForm();
    // console.log(this.data);

    if (this.data.type == 'edit') this.patchFormValues();

    if (this.data.type == 'view') {
      this.class = this.classes.find((_class) => {
        //console.log(_class);
        //console.log(this.data._teacher.class_id == _class.id);
        return this.data._teacher.class_id == _class.id;
      });
      console.log(this.class);
    }
  }

  initForm() {
    this.teacherForm = this._fb.group({
      name: [null, Validators.required],
      mob: [null, Validators.required],
      email: [null],
      class_id: [null, Validators.required],
    });
  }

  patchFormValues() {
    this.teacherForm.patchValue({
      name: this.data._teacher.name,
      mob: this.data._teacher.mob,
      email: this.data._teacher.email,
      class_id: this.data._teacher.class_id,
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onSubmit() {
    let data = Object.assign({}, this.teacherForm.value);
    if (this.teacherForm.valid) {
      if (!this.data._teacher) {
        this.authService.createTeacher(data);
        this.authService.showSnackbar(
          'Successfully added new teacher',
          null,
          3000
        );
        this.dialogRef.close();
      } else {
        this.teacherService
          .updateTeacher(this.data._teacher.id, data)
          .then(() => {
            this.authService.showSnackbar(
              'updated teacher details',
              null,
              3000
            );
          });
        this.dialogRef.close();
      }
    }
  }
}
