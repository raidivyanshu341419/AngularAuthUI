import { FormGroup } from "@angular/forms"

export function confirmPasswordValidator(controlName: string, mathControlName: string){
    return (formGroup: FormGroup)=> {
        const passwordControl = formGroup.controls[controlName];
        const confirmPasswordControl = formGroup.controls[mathControlName];
        if(confirmPasswordControl.errors && confirmPasswordControl.errors['confirmPasswordValidator']){
            return; 
        }

        if(passwordControl.value !== confirmPasswordControl.value){
            confirmPasswordControl.setErrors({confirmPasswordValidator : true})
        }else{
            confirmPasswordControl.setErrors(null)
        }
    }
}