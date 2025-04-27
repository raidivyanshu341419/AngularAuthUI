import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public users: any = [];
  public fullName: any = [];
  public role: any = [];
  constructor(private api: ApiService, private auth: AuthService, private userStore : UserStoreService) {  }

  ngOnInit() {
    debugger;
    this.api.getUsers().subscribe((res) => {
      this.users = res;
    });

     // get fullName from userStore and token
     this.userStore.getFullNameFromStore()
     .subscribe((res) => {
       let fullNameFromToken = this.auth.getFullNameFromToken();
       this.fullName = res|| fullNameFromToken;
      //  alert(this.fullName );
     })

     // get role from userStore and token
     this.userStore.getRoleFromStore()
     .subscribe((res) => {
       let role = this.auth.getRoleFromToken();
       this.role = res|| role;
      //  alert(this.role );
     })
  }

  logout(){
    this.auth.signOut();
  }
}
