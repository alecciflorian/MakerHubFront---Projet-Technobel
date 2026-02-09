import { Component, OnInit, signal, inject } from '@angular/core';
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

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    ChartModule,
    ButtonModule,
    ProgressSpinnerModule,
    Navbar
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit{
  user = signal<User|string>("Florian");
  products = signal<Products[]>([]);
  loading = signal<boolean> (true);
  error = signal<string|null>(null);

  constructor() {
  }
  private productsService = inject(productsService)

  ngOnInit(): void {
    this.loadProduct();
    this.user;
}

  loadProduct() : void {
    this.productsService.getProducts().pipe(delay(1200)).subscribe({
      next : (data : Products[]) => {
        this.products.set(data);
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
