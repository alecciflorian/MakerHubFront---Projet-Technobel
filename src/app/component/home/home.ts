import { Component, OnInit, signal, inject, PLATFORM_ID, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { Products } from '../../Interfaces/IProduct';
import {productsService} from '../../Services/productsServices'
import { HttpErrorResponse } from '@angular/common/http';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import {delay} from 'rxjs';
import {Navbar} from '../navbar/navbar';
import {User} from '../../Interfaces/IUser';
import { AuthService } from '../../Services/AuthService';
import { DialogModule, Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms'; 


@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    ChartModule,
    ButtonModule,
    ProgressSpinnerModule,
    DialogModule,
    InputTextModule,
    FormsModule,
    Navbar,
    Dialog
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit{
  
  constructor() {
  }
  data : any
  options : any
  products = signal<Products[]>([]);
  loading = signal<boolean> (true);
  error = signal<string|null>(null);
  private productsService = inject(productsService)
  private readonly authService = inject(AuthService)
  user = this.authService.currentUser;
  categories = this.productsService.allCategories;
  filteredProducts = this.productsService.productSearch;
  selectedProduct : any = null;
  visible : boolean = false;
  visibleDeleteProduct : boolean = false;
  visibleNewProduct : boolean = false;


  ngOnInit(): void {
    this.authService.getUser();
    this.loadProduct();
}

showSearchTerm(){
  this.productsService.searchTerm
}

showModalNewProduct(product : any){
  this.selectedProduct = product;
  this.visibleNewProduct = true;
}

showModalDelete(product : any){
  this.selectedProduct = product;
  this.visibleDeleteProduct = true;
}

showModalAdd(product : any){
  this.selectedProduct = product
  this.visible = true;
}

changeTruck(truck: string | null){
  this.productsService.selectedTruck.set(truck)
}

handleLogout(){
  this.authService.logout();
}

  loadProduct() : void {
    this.productsService.getProducts().pipe(delay(1200)).subscribe({
      next : (data : Products[]) => {
        this.productsService.products.set(data)
        this.loading.set(false);
      },
        error: (err : HttpErrorResponse) => {
         this.error.set (`Erreur ${err.status}: ${err.message}`)
         this.loading.set (false);
         console.error("Erreur HTTP: ",err)
        }
    })
    }
  }
