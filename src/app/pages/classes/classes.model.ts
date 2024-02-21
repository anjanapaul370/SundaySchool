export interface ClassData {
  id: string;
  name: string;
  description: string;
  created_by: string;
  created_date: string;
  updated_by: string;
  updated_date: string;
  is_deleted: boolean;
}

export interface ClassDialogData {
  classes?: ClassData[];
  _class?: ClassData;
}
