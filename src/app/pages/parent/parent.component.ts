import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { ParentData, ParentDialogData } from './parent.model';
import { ParentService } from './parent.service';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.scss'],
})
export class ParentComponent implements OnInit, OnDestroy{
  displayedColumns = ['name', 'email', 'mob', 'address', 'actions'];
  dataSource = new MatTableDataSource<ParentData>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  private parentSubscription: Subscription;
  parent: ParentData[];
  classId: string;

  constructor(
    private parentService: ParentService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  async ngOnInit() {
    this.parentSubscription = this.parentService
      .fetchParent()
      .subscribe((parents: ParentData[]) => {
        this.dataSource.data = parents;
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
    const data: ParentDialogData = {
      type: 'add',
    };
    const dialogRef = this.dialog.open(ParentdialogComponent, {
      width: '300px',
      hasBackdrop: true,
      data: data,
    });
  }

  editDialog(_parent: ParentData) {
    const data: ParentDialogData = {
      _parent: _parent,
      type: 'edit',
    };
    const dialogRef = this.dialog.open(ParentdialogComponent, {
      width: '500px',
      data: data,
    });
  }

  deleteParent(_parent: ParentData) {
    this.parentService
      .deleteParent(_parent.id)
      .then(() => {
        this.authService.showSnackbar('Deleted class successfully', null, 3000);
      })
      .catch((err) => console.log(err.message));
  }

  deleteAlert(_parent: ParentData) {
    if (confirm('Are you sure to delete?')) {
      this.deleteParent(_parent);
    }
  }

  viewParent(_parent: ParentData) {
    const data: ParentDialogData = {
      _parent: _parent,
      type: 'view',
    };
    const dialogRef = this.dialog.open(ParentdialogComponent, {
      width: '300px',
      data: data,
    });
  }

  upload(e: any) {}

  ngOnDestroy() {
    this.parentSubscription.unsubscribe();
  }
}

@Component({
  selector: 'app-parent-dialog',
  templateUrl: './parent-dialog.component.html',
})
export class ParentdialogComponent implements OnInit {
  _parent: ParentData;
  parentForm: FormGroup;
  loaded: boolean = false;
  // class: ClassData;
  // classes: ClassData[] = [];

  constructor(
    public dialogRef: MatDialogRef<ParentdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ParentDialogData,
    private _fb: FormBuilder,
    private parentService: ParentService,
    private authService: AuthService,
    // private classService: ClassesService
  ) {}

  async ngOnInit() {
    // this.classes = await this.classService.existingClass();
    this.loaded = true;
    this.initForm();

    if (this.data.type == 'edit') this.patchFormValues(); //edit
  }

  initForm() {
    this.parentForm = this._fb.group({
      name: [null, Validators.required],
      email: [null],
      mob: [null],
      address: [null]
    });
  }

  patchFormValues() {
    this.parentForm.patchValue({
      name: this.data._parent.name,
      email: this.data._parent.email,
      mob: this.data._parent.mob,
      address: this.data._parent.address
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onSubmit() {
    let data = Object.assign({}, this.parentForm.value);
    if (this.parentForm.valid) {
      if (!this.data._parent) {
        this.parentService.addParentToDatabase(data).then(() => {
          this.authService.showSnackbar(
            'Successfully added new parent',
            null,
            3000
          );
          this.dialogRef.close();
        });
      } else {
        this.parentService
          .updateParent(this.data._parent.id, data)
          .then(() => {
            // this.studentService.showSnackbar('updated the student', null, 3000);
          });
        this.dialogRef.close();
      }
    }
  }
}
