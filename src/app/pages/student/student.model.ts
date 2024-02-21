export interface StudentData {
  uid: string;
  id: string;
  name: string;
  mob: string;
  email: string;
  class_id: string;
  parent_id: string;
  parent_name:string;
  parent_mob: string;
  created_by: string;
  created_date: string;
  updated_by: string;
  updated_date: string;
  is_deleted: boolean;
}

export interface StudentDialogData {
  students?: StudentData[];
  _student?: StudentData;
  type: string;
  classId?: string;
}
