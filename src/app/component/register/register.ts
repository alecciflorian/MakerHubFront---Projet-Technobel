import {Component, inject, signal} from '@angular/core';
import {userService} from '../../Services/userServices';
import {User} from '../../Interfaces/IUser';
import {FormControl, ReactiveFormsModule, FormGroup, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {ProgressSpinner} from 'primeng/progressspinner';
import {ToastModule} from 'primeng/toast';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    ProgressSpinner,
    ToastModule,
    RouterLink
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  user = signal<User|undefined>(undefined);
  private router = inject(Router);
  private userService = inject(userService);
  
  isLoading = signal<boolean>(false);
  loadingMessage = signal('Création du compte');
  
  formCreateAccount = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required, 
      Validators.minLength(8), 
      Validators.pattern(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/)
    ]),
    password_confirmation: new FormControl('', [Validators.required])
  });

  onSubmit() {
    const {password, password_confirmation} = this.formCreateAccount.value;
    
    if (password !== password_confirmation) {
      alert("Les mots de passes ne correspondent pas. Veuillez réessayer");
      return;
    }
    
    if(this.formCreateAccount.valid){
      this.loadingMessage.set("Création du compte");
      this.sendData(this.formCreateAccount.value as User);
    }
  }

  sendData(userdata : User){
    this.isLoading.set(true);
    this.userService.addUser(userdata).subscribe({
      next: (data : User)=> {
        this.user.set(data);
        this.isLoading.set(false);
        alert("Compte créé avec succès !");
        this.router.navigate(["/login"]);
      },
      error: error => {
        console.log(error, "Impossible de créer l'utilisateur");
        this.isLoading.set(false);
      }
    })
  }
}