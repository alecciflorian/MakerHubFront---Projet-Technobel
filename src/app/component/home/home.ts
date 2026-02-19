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
    import { ToastModule } from 'primeng/toast';
    import { RippleModule } from 'primeng/ripple';
    import { MessageService } from 'primeng/api';
    import { BadgeModule } from 'primeng/badge';

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
        Dialog,
        ToastModule,
        RippleModule,
        BadgeModule
      ],
      templateUrl: './home.html',
      styleUrl: './home.scss',
    })
    export class Home implements OnInit{
      
      constructor() {
      }
      private messageService = inject(MessageService)
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
      quantityProduct = signal<number>(0);
      quantityProductDelete = signal<number>(0);
      selectedProductQuantity : Products | null = null;
      newName = signal<string>('');
      newQuantity = signal<number>(0);
      newPrice = signal<number>(0);
      newType = signal<string>('');
      truck = this.productsService.selectedTruck;
      showCriticalQuantityProducts = signal<boolean>(false);


      ngOnInit(): void {
        this.authService.getUser();
        this.loadProduct();
    }

    // showSuccessToast(){
    //   this.messageService.add({severity : 'success', summary: 'Succes', detail: 'Produits ajouté avec succès'})
    // }


    getCriticalProduct = computed(() => {
      const allProducts = this.filteredProducts();
      if(this.showCriticalQuantityProducts()){
        return allProducts.filter(p => p.quantity < 10);
      }
      return allProducts;
    })

    toggleCriticalQuantityProduct(){
      return this.showCriticalQuantityProducts.set(!this.showCriticalQuantityProducts());
    }

    resetProductOnChange(){
      return this.showCriticalQuantityProducts.set(false);
    }

    lowQuantityProduct = computed(() => {
      return this.productsService.products().filter(p => p.quantity < 10).length;
    })

      addProduct(){
        const payload = {
          name : this.newName(),
          price : this.newPrice(),
          quantity : this.newQuantity(),
          type : this.newType(),
        };
        
        if(payload.name.trim() && payload.type && payload.quantity && payload.price){
          this.productsService.addProduct(payload).subscribe({
            next : (addData) => {
              this.messageService.add({severity : 'success', summary: 'Succes', detail: 'Produit ajouté avec succès'})
              //prends l'ancien tableau et rajoute les nouvelles valeurs 
              this.productsService.products.update(prev => [...prev, addData])
              this.visibleNewProduct = false;
              this.newName.set('');
              this.newPrice.set(0);
              this.newQuantity.set(0);
              this.newType.set('');
            },
            error : (err) => console.error("Erreur API", err)
          })
        }
      }

    stockSeverity(product : Products) {
          if (product.quantity === 0) return 'danger';
          else if (product.quantity > 0 && product.quantity < 10) return 'warn';
          else return 'success';
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
      this.quantityProductDelete.set(0);
      this.visibleDeleteProduct = true;
    }

    showModalAdd(product : any){
      this.selectedProduct = product;
      this.quantityProduct.set(0);
      this.visible = true;
    }


    confirmQuantityDelete(){
      if(this.selectedProduct && this.quantityProduct() >= 0){
        const newQuantityToDelete = this.selectedProduct.quantity - this.quantityProduct();
        this.productsService.deleteProductQuantity(this.selectedProduct.productId, newQuantityToDelete).subscribe({
          next : (deleteQuantityProduct) => {
            this.messageService.add({severity : 'success', summary: 'Succes', detail: 'Quantité supprimée avec succès'})
            this.productsService.products.update(prev => prev.map(p => p.productId === deleteQuantityProduct.productId ? deleteQuantityProduct : p));
            this.visible = false;
            this.quantityProduct.set(0);
          },
          error : (err) => console.error("Erreur API", err)
        });
      }
    }

    confirmQuantityAdd(){
      if(this.selectedProduct && this.quantityProduct() > 0){
        const newQuantity = this.selectedProduct.quantity + this.quantityProduct();
        this.productsService.updateProductQuantity(this.selectedProduct.productId, newQuantity).subscribe({
          next : (updateProduct) => {
            this.messageService.add({severity : 'success', summary: 'Succes', detail: 'Quantité ajoutée avec succès'})
            this.productsService.products.update(prev => prev.map(p => p.productId === updateProduct.productId ? updateProduct : p));
            this.visible = false;
            this.quantityProduct.set(0);
          },
          error: (err) => console.error("Erreur API :", err)
        });
        }
      }
    

    logo = computed(() => {
      const truck = this.productsService.selectedTruck();
      switch(truck){
        case 'CoffeeTruck' : return '☕';
        case 'AperitzTruck' : return '🍸'
        default : return '🍔';
      }
    });

    changeTruck(truck: string | null){
      this.productsService.selectedTruck.set(truck)
    }

    handleLogout(){
      this.authService.logout();
    }

      loadProduct() : void {
        this.productsService.getProducts().subscribe({
          next : (data : Products[]) => {
            this.productsService.products.set(data);
            this.products.set(data)
            this.loading.set(false);
          },
            error: (err : HttpErrorResponse) => {
            this.error.set (`Erreur ${err.status}: ${err.message}`)
            this.loading.set (false);
            console.error("Erreur HTTP: ",err)
            }
        });
        }
      }