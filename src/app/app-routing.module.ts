import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticoloComponent } from './components/articolo/articolo.component';
import { ContattiComponent } from './components/contatti/contatti.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'articoli',
    pathMatch: 'full'
  },
  {
    path: 'articoli',
    component: ArticoloComponent
  },
  {
    path: 'contatti',
    component: ContattiComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
