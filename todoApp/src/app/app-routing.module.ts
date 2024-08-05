import { TodoModule } from './modules/todo/todo/todo.module';
import { CategoryModule } from './modules/category/category/category.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './modules/category/category/category.component';
import { TodoComponent } from './modules/todo/todo/todo.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'category',
    pathMatch: 'full'
  },
  {
    path: 'category',
    loadChildren: () =>
      import('./modules/category/category/category.module').then(m => m.CategoryModule),
  },
  {
    path: 'todo',
    loadChildren: () =>
      import('./modules/todo/todo/todo.module').then(m => m.TodoModule),
  },
  {
    path: "**",
    component:NotFoundPageComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
