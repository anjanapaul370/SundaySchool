export interface TeacherData {
  uid: string;
  id: string;
  name: string;
  mob: string;
  email: string;
  class_id: string;
  created_by: string;
  created_date: string;
  updated_by: string;
  updated_date: string;
}

export interface TeacherDialogData {
  teachers?: TeacherData[];
  _teacher?: TeacherData;
  type: string;
}
