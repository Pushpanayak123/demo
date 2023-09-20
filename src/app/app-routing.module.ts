import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Exercise2Component } from './exercise2/exercise2.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'exercise1', component: HomeComponent },
  { path: 'exercise2', component: Exercise2Component },
  { path: '**', redirectTo: 'exercise1', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
