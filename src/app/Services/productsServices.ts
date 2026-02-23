import { HttpClient } from "@angular/common/http";
import { computed, inject, Injectable, signal } from "@angular/core";
import { Observable } from "rxjs";
import {Products} from "../Interfaces/IProduct";

@Injectable({
  providedIn: 'root',
})
export class productsService{
    private baseUrl = "http://localhost:5164/";
    constructor() {}
    
    products = signal<Products[]>([]);
    selectedTruck = signal<string | null>(null);
    quantityProducts = signal<number>(0);
    
    private http = inject (HttpClient)


    getProducts() : Observable<Products[]> {
        return this.http.get<Products[]>(`${this.baseUrl}` + "products");
    }
  
    updateProductQuantity(id : number, quantity : number) : Observable<Products>{
        return this.http.patch<Products>(`${this.baseUrl}products/${id}`,{
            quantity : quantity
        });
    } 

    deleteProductQuantity(id : number, quantity : number) : Observable<Products>{
        return this.http.patch<Products>(`${this.baseUrl}products/${id}`, {
            quantity : quantity
        })
    }

    addProduct(productData : {name : string, price : number, quantity : number ,type : string, }) : Observable<Products>{
        return this.http.post<Products>(`${this.baseUrl}products/addProduct`, productData)
    }

    //Record va servir à définir le type "Clé, valeurs" (Clé de type string; valeurs de type string)
    private truckMapping: Record<string, string[]> = {
        'FoodTruck': [
        'Sauce Froide', 
        'Sauce Chaude', 
        'Laitage', 
        'Surgelé', 
        'Boulangerie', 
        'Viande', 
        'Végétarien', 
        'Poisson', 
        'Épice', 
        'Cuisson', 
        'Condiment Sec', 
        'Emballage'
        ],
        'CoffeeTruck': [
            'Café', 'Laitage', 'Boulangerie', 'Snack', 
            'Soft', 'Récipient', 'Emballage', 'Hygiène'
        ],
        'AperitzTruck': [
            'Alcool', 'Liqueur', 'Vin', 'Soft', 'Bière', 
            'Snack', 'Vaisselle Jetable', 'Récipient'
        ],
};

  searchTerm = signal<string>('');

  
  filteredProducts = computed(() => {
      //recupération de tous les produits
      const allProduits = this.products();
      //récupération du camion sélectionné
      const truck = this.selectedTruck();
      
      //si aucun truck sélectionner alors on retourne tous les produits
      if(!truck){
          return allProduits;
        }
        
        //on va chercher le dictionnaire et on choisi le truck
        const allowedCategories = this.truckMapping[truck];
        //sinon on retourne les catégories en fonctions du truck choisi
        if(allowedCategories){
            const filtered = allProduits.filter(p => {
                return allowedCategories.includes(p.type);      
            })
            //sinon on retourne tous les produits filtré par le type de truck
            return filtered;
        }
        return allProduits;
    });
    productSearch = computed(() => {
      const search = this.searchTerm().toLowerCase().trim();
      const list = this.filteredProducts();
    
      if(!search){
          return list;
      }
    
      return list.filter(p => p.name.toLowerCase().includes(search))
    })

    allCategories = computed(() => {
        const produits = this.filteredProducts();
        //évite les doublons
        const cat = produits.map(p => p.type).filter(Boolean);
        //[...] = met tout le contenu du tableau dans un nouveau     
        return [...new Set(cat)]
    })
    }