import {Component, inject, signal} from '@angular/core';
import {userService} from '../../Services/userServices';
import {User} from '../../Interfaces/IUser';
import {FormControl, ReactiveFormsModule, FormGroup, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {ProgressSpinner} from 'primeng/progressspinner';
import {ToastModule} from 'primeng/toast';
import {LoginUser} from '../../Interfaces/LoginUser';
import { AuthService } from '../../Services/AuthService';

@Component({
  selector: 'app-page-de-connexion',
  imports: [
    ReactiveFormsModule,
    ProgressSpinner,
    ToastModule,
    RouterLink
  ],
  templateUrl: './page-de-connexion.html',
  styleUrl: './page-de-connexion.scss',
})
export class PageDeConnexion {
  user = signal<User|undefined>(undefined);
  private router = inject(Router);
  private userService = inject(userService);
  private authService = inject(AuthService);
  
  isLoading = signal<boolean>(false);
  loadingMessage = signal('');
  
  formSignIn = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  onSubmit() {
    if(this.formSignIn.valid){
      this.loadingMessage.set("Connexion en cours");
      this.getData(this.formSignIn.value as LoginUser);
    }
  }

  getData(userdata : LoginUser){
    this.isLoading.set(true);
    this.userService.login(userdata).subscribe({
      next: (data : User)=> {
        if(data){
          this.authService.setUser(data);
        }
        
        setTimeout(()=> {
          this.router.navigate(["/home"]);
        }, 1000)
      },
      error: error => {
        console.log(error, "Impossible de récupérer l'utilisateur")
        this.isLoading.set(false);
      }
    })
  }
}