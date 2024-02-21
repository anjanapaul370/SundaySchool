import {
  AfterViewInit,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ClassesService } from './classes.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ClassData, ClassDialogData } from './classes.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss'],
})
export class ClassesComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['name', 'description', 'actions'];
  dataSource = new MatTableDataSource<ClassData>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  newdata: any[];
  head: any;
  id: any;
  private classSubscription: Subscription;
  currentClass: ClassData;
  classes: ClassData[];

  constructor(
    private classesService: ClassesService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.classSubscription = this.classesService
      .fetchClasses()
      .subscribe((classes: ClassData[]) => {
        this.dataSource.data = classes;
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
    const data: ClassDialogData = {
      classes: this.dataSource.data
     };
    const dialogRef = this.dialog.open(PopupComponent, {
      width: '300px',
      hasBackdrop: true,
      data: data,
    });
  }

  editDialog(_class: ClassData) {
    const data: ClassDialogData = {
      classes: this.dataSource.data,
      _class: _class,
    };
    const dialogRef = this.dialog.open(PopupComponent, {
      width: '300px',
      data: data,
    });
  }

  deleteClasses(_class: ClassData) {
    this.classesService
      .deleteClass(_class.id)
      .then(() => {
        this.classesService.showSnackbar(
          'Deleted class successfully',
          null,
          3000
        );
      })
      .catch((err) => console.log(err));
  }

  deleteAlert(_class: ClassData) {
    if (confirm('Are you sure to delete?')) {
      this.deleteClasses(_class);
    }
  }

  viewClass(_class: ClassData) {
    const data: ClassDialogData = {
      _class: _class
     };
    const dialogRef = this.dialog.open(PopupComponent, {
      width: '300px',
      data: data,
    });
  }

  ngOnDestroy() {
    this.classSubscription.unsubscribe();
  }
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
})
export class PopupComponent implements OnInit {
  classes = [
    'I',
    'II',
    'III',
    'IV',
    'V',
    'VI',
    'VII',
    'VIII',
    'IX',
    'X',
    'XI',
    'XII',
  ];

  _class: ClassData;

  classForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<PopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ClassDialogData,
    private _fb: FormBuilder,
    private classesService: ClassesService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this._class = Object.assign({}, this._class);

    if (this.data._class)
      this.patchFormValues();

  //to avoid already added classes
    if (this.data.classes)
      for (let i = 0; i < this.data.classes.length; i++) {
        this.classes = this.classes.filter((_class) => {
          if (this.data._class && _class == this.data._class.name)
            return _class == this.data._class.name;
          return _class != this.data.classes[i].name;
        });
      }
  }

  initForm() {
    this.classForm = this._fb.group({
      name: [null, Validators.required],
      description: [null],
    });
  }

  patchFormValues() {
    this.classForm.patchValue({
      name: this.data._class.name,
      description: this.data._class.description,
    });
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onSubmit() {
    let data = Object.assign({}, this.classForm.value);
    if (this.classForm.valid) {
      if (!this.data._class) {
        this.classesService.addClassToDatabase(data).then(() => {
          this.classesService.showSnackbar(
            'Successfully added new class',
            null,
            3000
          );
          this.dialogRef.close();
        });
      } else {
        this.classesService.updateClass(this.data._class.id, data).then(() => {
          // this.classesService.showSnackbar('updated the class', null, 3000);
        });
        this.dialogRef.close();
      }
    }
  }
}

// exportAsXLSX() {
//   this.excelService.exportAsExcelFile(this.dataSource.data, 'training_data');
// }

// createPdf() {
//   var doc = new jsPDF();

//   doc.setFontSize(18);
//   doc.text('My Past Exercises', 11, 8);
//   doc.setFontSize(20);
//   doc.setTextColor('black');
//   let len = (this.dataSource.data).length;
//   for (let i =0 ; i<len ; i++){
//     this.newdata.push ([
//       this.dataSource.data[i]['date'],
//       this.dataSource.data[i]['name'],
//       this.dataSource.data[i]['duration'],
//       this.dataSource.data[i]['calories'],
//       this.dataSource.data[i]['state']
//   ]);
//   }

//   (doc as any).autoTable({
//     head: this.head,
//     body: this.newdata,
//   //  theme:"plain"

//   })
//   doc.output('dataurlnewwindow');  // to Open PDF document in new tab
//   doc.save('my_exercises.pdf'); //Download PDF document
//   this.newdata=[];
// }
