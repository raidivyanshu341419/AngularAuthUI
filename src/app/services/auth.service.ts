import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenApiModel } from '../models/token-api.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl: string = 'https://localhost:7255/api/User/';
  private userPayload: any;
  constructor(private httpClient: HttpClient, private router: Router) {
    this.userPayload = this.decodeToken();
  }

  signUp(userObj: any) {
    return this.httpClient.post<any>(`${this.baseUrl}register`, userObj);
  }

  login(loginObj: any) {
    return this.httpClient.post<any>(`${this.baseUrl}authenticate`, loginObj);
  }

  storeToken(token: string) {
    localStorage.setItem('token', token);
  }

  storeRefreshToken(tokenValue: string) {
    localStorage.setItem('refreshToken', tokenValue);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  signOut() {
    localStorage.clear();
    this.router.navigate(['login']);
  }

  decodeToken() {
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!; // ! for null check
    console.log(jwtHelper.decodeToken(token));    
    return jwtHelper.decodeToken(token);
  }

  // getFullNameFromToken(){
  //   if(this.userPayload){
  //     return this.userPayload.name;
  //   }
  // }
  getFullNameFromToken(){
    if(this.userPayload){
      // const key = Object.keys(this.userPayload); 
      // const userName = key.find(key => key.includes('name'))!;
      return this.userPayload.name;
    }
  }

  getRoleFromToken(){
    if(this.userPayload){
      return this.userPayload.role;
    }
  }

  renewToken(tokenApi: TokenApiModel){
    return this.httpClient.post(`${this.baseUrl}refresh`, tokenApi)
  }
}
