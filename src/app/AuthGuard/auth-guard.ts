  import {Router, CanActivateFn } from '@angular/router';
  import {inject, Injectable, signal} from '@angular/core';
  import { User } from '../Interfaces/IUser';


Injectable({
  providedIn: "root"
})
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router)
  const token = localStorage.getItem('token')
  
  
  if(token){
    return true;
  }
  else{
    router.navigate(['/login']);
    return false;
  }
};
