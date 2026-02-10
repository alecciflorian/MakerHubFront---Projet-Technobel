import { User } from "../Interfaces/IUser";
import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class AuthService{
        currentUser = signal <User | null> (null);
        setUser(user : User){
        this.currentUser.set(user)
        localStorage.setItem('currentUser', JSON.stringify(user))
  }

  getUser() : User | null{
    const user = localStorage.getItem('currentUser')
    if(user){
      const parsedUser = JSON.parse(user);
      this.currentUser.set(parsedUser);
      return parsedUser;
    }
    return null;
  }

   logout() {
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
  }
}