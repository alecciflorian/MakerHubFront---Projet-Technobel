import {Component, inject, signal} from '@angular/core';
import {userService} from '../../Services/userServices';
import {User} from '../../Interfaces/IUser';
import {FormBuilder, Validators, FormGroup, FormControl, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {ProgressSpinner} from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-page-de-connexion',
  imports: [
    ReactiveFormsModule,
    ProgressSpinner,
    ToastModule
  ],
  templateUrl: './page-de-connexion.html',
  styleUrl: './page-de-connexion.scss',
})
export class PageDeConnexion {
  constructor() {
  }
  user = signal<User|undefined>(undefined);
  private router = inject(Router);
  isLoading = signal<boolean> (false);
  formCreateAccount = new FormGroup(
    {
      username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      email: new FormControl('',{nonNullable: true, validators : [Validators.required]}),
      password: new FormControl('',{nonNullable: true, validators : [Validators.required, Validators.minLength(8), Validators.pattern(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/)]}),
      password_confirmation: new FormControl('', {nonNullable: true, validators:  [Validators.required]}),
    }
  )

  private userService = inject(userService);
  onSubmit(){
    if(this.formCreateAccount.value.password != this.formCreateAccount.value.password_confirmation){
      alert("Les deux mots de passe ne correspondent pas");
    }
    if(this.formCreateAccount.valid){
      this.sendData(this.formCreateAccount.value as User);
    }
  }

  sendData(userdata : User){
    this.isLoading.set(true);
    this.userService.addUser(userdata).subscribe({
      next: (data : User)=> {
        this.user.set(data);
        setTimeout(()=> {
          this.router.navigate(["/login"]);
        }, 1000)
      },
      error: error => {
        console.log(error, "Impossible de créer l'utilisateur");
        this.isLoading.set(false);
      }
    })
  }
}
