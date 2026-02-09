import {Component, inject, signal} from '@angular/core';
import {userService} from '../../Services/userServices';
import {User} from '../../Interfaces/IUser';
import {FormBuilder, Validators, FormGroup, FormControl, ReactiveFormsModule, FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {ProgressSpinner} from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import {LoginUser} from '../../Interfaces/LoginUser';

@Component({
  selector: 'app-page-de-connexion',
  imports: [
    ReactiveFormsModule,
    ProgressSpinner,
    ToastModule,
    FormsModule
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
  loadingMessage = signal('');
  formCreateAccount = new FormGroup(
    {
      username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      email: new FormControl('',{nonNullable: true, validators : [Validators.required]}),
      password: new FormControl('',{nonNullable: true, validators : [Validators.required, Validators.minLength(8), Validators.pattern(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/)]}),
      password_confirmation: new FormControl('', {nonNullable: true, validators:  [Validators.required]}),
    }
  )
  formSignIn = new FormGroup(
    {
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    }
  )

  private userService = inject(userService);

  onSubmit(mode: 'signup' | 'signin') {
    if (mode === 'signup') {
      this.handleSignUp();
    } else {
      this.handleSignIn();
    }
  }

  private handleSignUp() {
    const {password, password_confirmation} = this.formCreateAccount.value;
    if (password != password_confirmation) {
      alert("Les mots de passes ne correspondent pas. Veuillez réessayer");
      return;
    }
    if(this.formCreateAccount.valid){
      this.loadingMessage.set("Création du compte");
      this.sendData(this.formCreateAccount.value as User)
    }
  }

  private handleSignIn() {
    if(this.formSignIn.valid){
        this.loadingMessage.set("Connexion en cours");
        this.getData(this.formSignIn.value as User);
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
  getData(userdata : LoginUser){
    this.isLoading.set(true);
    this.userService.login(userdata).subscribe({
      next: (data : User)=> {
        this.user.set(data);
        setTimeout(()=> {
          this.router.navigate(["/home"]);
        })
      },
      error: error => {
        console.log(error, "Impossible de récupérer l'utilisateur")
        this.isLoading.set(false);
      }
    })
  }
}

