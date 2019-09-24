import { Lawfirm } from "./lawfirm";

export class Profile {
  constructor() {}
  id: string;
  first_name: string;
  middle_name: string = "";
  last_name: string;
  telephone_number: string;
  telephone_number_areacode: string;
  mobile_number: string = "";
  fax_number: string = "";
  street: string;
  apt_type: string = "";
  apt_number: string = "";
  city: string;
  state: string;
  zip_code: string;
  province: string = "";
  country: string;
  uscis_account_number: string = "";
  accereditation_expires_date: string;
  is_attorney: boolean;
  licensing_authority: string = "";
  bar_number: string = "";
  is_subject_to_any: boolean;
  subject_explaination: string;
  preparer_signature: string = "";
  avatar: string;
  lawfirm_id: number;
  user_id: number;
  lawfirm: Lawfirm;
  user: Object;
}
