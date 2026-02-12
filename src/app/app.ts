import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './component/navbar/navbar';
import { Home } from './component/home/home';
import {PageDeConnexion} from './component/page-de-connexion/page-de-connexion';




@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Home, PageDeConnexion],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('MakerHubFront');
}
