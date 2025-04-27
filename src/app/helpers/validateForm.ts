import { FormControl, FormGroup } from "@angular/forms";

export default class ValidateForm{
    static validateAllFormFields(fromGroup: FormGroup) {
        Object.keys(fromGroup.controls).forEach((field) => {
          const control = fromGroup.get(field);
          if (control instanceof FormControl) {
            control.markAsDirty({ onlySelf: true });
          } else if (control instanceof FormGroup) {
            this.validateAllFormFields(control);
          }
        });
      }
}