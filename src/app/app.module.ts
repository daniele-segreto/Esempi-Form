import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ArticoloComponent } from './components/articolo/articolo.component';
import { ContattiComponent } from './components/contatti/contatti.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Import solo dei moduli Firebase necessari
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { environment } from '../environments/environment';

// Initialize Firebase
firebase.initializeApp(environment.firebaseConfig);

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ArticoloComponent,
    ContattiComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
