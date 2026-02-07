import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {Products} from "../Interfaces/IProduct";

@Injectable({
  providedIn: 'root',
})
export class productsService{
    private baseUrl = "http://localhost:5164/";
    constructor() {}

    private http = inject (HttpClient)
    getProducts() : Observable<Products[]> {
        return this.http.get<Products[]>(`${this.baseUrl}` + "products")
    }
}