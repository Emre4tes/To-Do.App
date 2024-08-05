import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TodoRoutingModule } from './todo-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TodoComponent } from './todo.component';
import { TodoListComponent } from '../todo-pages/todo-list/todo-list.component';
import { TodoFormComponent } from '../todo-pages/todo-form/todo-form.component';


@NgModule({
  declarations: [
    TodoComponent,
    TodoListComponent,
    TodoFormComponent
  ],
  imports: [
    CommonModule,
    TodoRoutingModule,
    ReactiveFormsModule
  ]
})
export class TodoModule { }
