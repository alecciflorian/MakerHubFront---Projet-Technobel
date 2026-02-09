import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {User} from "../Interfaces/IUser";

@Injectable({
  providedIn: 'root',
})
export class userService {
  private baseUrl = "http://localhost:5164";
  constructor() {}

  private http = inject (HttpClient)
  getUser() : Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}` + "/users")
  login(credantials : any) : Observable<User> {
    return this.http.post<User>(`${this.baseUrl }` + "/login", credantials)
  }

  addUser(user : User) : Observable<User> {
    return this.http.post<User>(`${this.baseUrl}` + "/users/register-user", user)
  }
}
