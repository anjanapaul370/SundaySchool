export interface ParentData {
  id: string;
  name: string;
  mob: string;
  email: string;
  address: string;
  created_by: string;
  created_date: string;
  updated_by: string;
  updated_date: string;
  is_deleted: boolean;
}

export interface ParentDialogData {
  parents?: ParentData[];
  _parent?: ParentData;
  type: string;
}
