import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryRoutingModule } from './category-routing.module';
import { CategoryComponent } from './category.component';

import { ReactiveFormsModule } from '@angular/forms';
import { CategoryListComponent } from '../category-pages/category-list/category-list.component';
import { CategoryFormComponent } from '../category-pages/category-form/category-form.component';


@NgModule({
  declarations: [
    CategoryComponent,
    CategoryListComponent,
    CategoryFormComponent
  ],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    ReactiveFormsModule
  ]
})
export class CategoryModule { }
