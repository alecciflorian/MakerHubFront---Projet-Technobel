import { User } from "../Interfaces/IUser";
import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class AuthService{
        currentUser = signal <User | null> (null);
        setUser(user : User){
        this.currentUser.set(user)
        sessionStorage.setItem('currentUser', JSON.stringify(user))
  }

  getUser() : User | null{
    const user = sessionStorage.getItem('currentUser')
    if(user){
      const parsedUser = JSON.parse(user);
      this.currentUser.set(parsedUser);
      return parsedUser;
    }
    return null;
  }

   logout() {
    this.currentUser.set(null);
    sessionStorage.removeItem('currentUser');
  }
}