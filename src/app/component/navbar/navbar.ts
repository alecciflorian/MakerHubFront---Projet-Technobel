import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/AuthService';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit{

  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)
  imgUrl : string = "logoFoodTruck.jpg"
  user = this.authService.currentUser;

  ngOnInit(): void {
    this.authService.getUser();
  }


  onLogout(){
    this.authService.logout();
    this.router.navigate(['/login'])
  }
}
