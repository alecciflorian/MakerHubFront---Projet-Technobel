import { Component, computed, OnInit, signal } from '@angular/core';
import { AuthService } from '../../Services/AuthService';
import { inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {ToolbarModule} from 'primeng/toolbar'
import { InputText } from "primeng/inputtext";
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { productsService } from '../../Services/productsServices';
import { ButtonDirective } from "primeng/button";

@Component({
  selector: 'app-navbar',
  imports: [
    ToolbarModule,
    InputText,
    IconFieldModule,
    InputIconModule,
    RouterLink,
    ButtonDirective
],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit{
  constructor(){}
  private readonly productService = inject(productsService)
  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)
  imgUrl : string = "logoFoodTruck.jpg"
  user = this.authService.currentUser;
  isDark = false;

  toggleDarkMode(){
    const element = document.querySelector('html');
    if(element){
      element.classList.toggle('dark-bg');
      this.isDark = true;
    }
  }

  ngOnInit(): void {
    this.authService.getUser();
  }


  searchProduct(event : Event){
  const search = (event.target as HTMLInputElement).value;
  this.productService.searchTerm.set(search)
}


  onLogout(){
    this.authService.logout();
    this.router.navigate(['/login'])
  }
}
