
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Category, CategoryService } from 'src/app/modules/services/category.service';
import { TodoService } from 'src/app/modules/services/todo.service';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss']
})
export class TodoFormComponent implements OnInit, OnDestroy {
  todoForm: FormGroup;
  categories: Category[] = [];
  private categorySubscription: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private todoService: TodoService
  ) {
    this.todoForm = this.fb.group({
      title: ['', Validators.required],//Validators.required  bu alanı doldurmak zorunda oldugumuzu belirtir.
      categoryId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.categorySubscription = this.categoryService.getCategories().subscribe((categories: Category[]) => {
      this.categories = categories; //Kategoriye işle
    });
  }

  ngOnDestroy(): void {
    this.categorySubscription.unsubscribe(); //aboneliği temizle  Aboneliği iptal etmek, bellek sızıntılarını önler ve uygulamanın performansını korur.
  }

  onSubmit(): void {
    if (this.todoForm.valid) {
      const newTodo = {
        id: Date.now(),
        title: this.todoForm.value.title,
        categoryId: Number(this.todoForm.value.categoryId)
      };
      console.log('Adding ToDo:', newTodo);
      this.todoService.addTodoItem(newTodo);
      this.todoForm.reset();
    }
  }
}
