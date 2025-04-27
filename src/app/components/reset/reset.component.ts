import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { confirmPasswordValidator } from 'src/app/helpers/confirm-password-validator';
import ValidateForm from 'src/app/helpers/validateForm';
import { ResetPassword } from 'src/app/models/ResetPassword';
import { ResetPasswordService } from 'src/app/services/reset-password.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
})
export class ResetComponent {

  typePassword: string = 'password';
  typeConfirmPassword: string = 'password';
  eyeIconPassword: string = 'fa-eye-slash';
  eyeIconConfirmPassword: string = 'fa-eye-slash';

  resetPasswordForm!: FormGroup;
  emailToReset!: string;
  emailToken!: string;
  resetPasswordObj = new ResetPassword();
  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute, private resetPasswordService: ResetPasswordService,
    private router : Router
   ) {}

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      password: [null, Validators.required],
      confirmPassword: [null, Validators.required]
    },{
      validator: confirmPasswordValidator("password", "confirmPassword")
    });

    this.activatedRoute.queryParams.subscribe(val => {
      this.emailToReset = val['email'];
      let uriToken =  val['code'];  
      this.emailToken = uriToken.replace(/ /g, '+');
      console.log(this.emailToReset, this.emailToken);
      
    })
  }

  hideShowPass(field: string) {
    if (field === 'password') {
      if (this.typePassword === 'password') {
        this.typePassword = 'text';
        this.eyeIconPassword = 'fa-eye';
      } else {
        this.typePassword = 'password';
        this.eyeIconPassword = 'fa-eye-slash';
      }
    } else if (field === 'confirmPassword') {
      if (this.typeConfirmPassword === 'password') {
        this.typeConfirmPassword = 'text';
        this.eyeIconConfirmPassword = 'fa-eye';
      } else {
        this.typeConfirmPassword = 'password';
        this.eyeIconConfirmPassword = 'fa-eye-slash';
      }
    }
  }

  onReset(){
    if(this.resetPasswordForm.valid){
      this.resetPasswordObj.email = this.emailToReset; 
      this.resetPasswordObj.newPassword = this.resetPasswordForm.value.password;
      this.resetPasswordObj.confirmPassword = this.resetPasswordForm.value.confirmPassword;
      this.resetPasswordObj.emailToken = this.emailToken;

      this.resetPasswordService.resetPassword(this.resetPasswordObj).subscribe({
        next:(res)=> {
          alert("Password Reset Successfuly");
          this.router.navigate(['/'])
        }, 
        error:(err)=> {
          alert("Something went Wrong!");
        }
      })
    }else{
      ValidateForm.validateAllFormFields(this.resetPasswordForm);
    }
  }
  
}
