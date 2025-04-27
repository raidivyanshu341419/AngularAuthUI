import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import ValidateForm from 'src/app/helpers/validateForm';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';

  signupform! : FormGroup;
  constructor(private fb: FormBuilder, private authService: AuthService, 
    private router: Router)
    {

    }

  ngOnInit(): void {
   this.signupform = this.fb.group({
    firstName : ['', Validators.required],
    lastName : ['', Validators.required],
    userName : ['', Validators.required],
    email : ['', Validators.required],
    password : ['', Validators.required],
   })
  }
  
  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? (this.eyeIcon = 'fa-eye') : (this.eyeIcon = 'fa-eye-slash');
    this.isText ? (this.type = 'text') : (this.type = 'password');
  }
  
  onSubmit() {
    if (this.signupform.valid) {
      // save the data in database
      console.log('Saved Data', this.signupform.value);
      this.authService.signUp(this.signupform.value).subscribe({
        next: (res) =>{
          alert(res.message)
          this.signupform.reset();
          this.router.navigate(['login'])
        }, 
        error: (err)=> {
          alert(err?.error.message);
        }
      })
    } else {
      // throw the error using toaster and with required fields
      console.log('Form in not valid');
      ValidateForm.validateAllFormFields(this.signupform); 
       // alert("Your from is invalid");
    }
  }
}
