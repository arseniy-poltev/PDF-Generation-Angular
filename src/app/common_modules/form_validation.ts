import 'assets/pages/scripts/form-validation.js';
import 'assets/pages/scripts/login.js';

declare var RunLoginFamily;
declare var RunFormValidation;
declare var jQuery;

export class FormValidation {
    constructor() {
    }

    static validate(form_id, callback) {
        RunFormValidation(jQuery, form_id, callback);
    }

    static loginValidate(callback) {
        RunLoginFamily(jQuery, callback);
    }
}
