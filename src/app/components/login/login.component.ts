import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import ValidateForm from 'src/app/helpers/validateForm';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UserStoreService } from 'src/app/services/user-store.service';
import { ResetPasswordService } from 'src/app/services/reset-password.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';
  public resetPasswordEmail!: string;
  public isValidEmail!: boolean;

  loginForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private userStore: UserStoreService,
    private toast: ToastrService, 
    private resetPasswordService: ResetPasswordService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? (this.eyeIcon = 'fa-eye') : (this.eyeIcon = 'fa-eye-slash');
    this.isText ? (this.type = 'text') : (this.type = 'password');
  }

  onLogin() {
    if (this.loginForm.valid) {
      // console.log('Saved Data', this.loginForm.value);
      this.auth.login(this.loginForm.value).subscribe({
        next: (res) => {
          // alert(res.message);
          //this.toast.success(res.message, 'Success');
          this.loginForm.reset();
          this.auth.storeToken(res.accessToken);
          this.auth.storeRefreshToken(res.refreshToken);
          const tokeyPayload = this.auth.decodeToken();
          this.userStore.setFullNameFromStore(tokeyPayload.name);
          this.userStore.setRoleFromStore(tokeyPayload.role);

          // on success loging navigate to the
          this.router.navigate(['dashboard']);
        },
        error: (err) => {
          console.log(err);
          alert(err?.error.message);
          // this.toast.error(err?.error.message, 'Error');
        },
      });
    } else {
      // throw the error using toaster and with required fields
      console.log('Form in not valid');
      ValidateForm.validateAllFormFields(this.loginForm);
      //alert("Your from is invalid");
    }
  }

  checkValidEmail(event: string) {
    const value = event;
    const pattern = /^[\w\-\.]+@([\w\-]+\.)+[\w\-]{2,3}$/;
    // if (value.match(pattern)) {
    //   return true;
    // }
    this.isValidEmail = pattern.test(value);
    return this.isValidEmail;
  }

  confirmToSend(){
   if (this.checkValidEmail(this.resetPasswordEmail)){
    console.log(this.resetPasswordEmail);

    // api call to send the forget link
    this.resetPasswordService.sendResetPasswordLink(this.resetPasswordEmail)
      .subscribe({
        next: (resp)=>{
          console.log("resp",resp);
          
          alert("Reset Password link sent to your email!");
          this.resetPasswordEmail = "";
          const buttonRef = document.getElementById('closeBtn');
          buttonRef?.click();
        }, 
        error: (err)=>{
          // alert(err?.error.message);
          alert(err);
        }
      })
  }   
  }
}
