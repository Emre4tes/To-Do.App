import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import {
  combineLatest,
  debounceTime,
  map,
  Observable,
  of,
  startWith,
} from 'rxjs';
import {
  Category,
  CategoryService,
} from 'src/app/modules/services/category.service';
import { Todo, TodoService } from 'src/app/modules/services/todo.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss'],
})
export class TodoListComponent implements OnInit {
  todos$: Observable<Todo[]> = of([]);
  categories: Category[] = [];
  filterForm: FormGroup;
  todosForm: FormGroup;
  removedTodos: number[] = [];

  constructor(
    private fb: FormBuilder,
    private todoService: TodoService,
    private categoryService: CategoryService
  ) {
    this.filterForm = this.fb.group({
      category: [''],
      search: [''],
    });

    this.todosForm = this.fb.group({
      todos: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.categoryService.categories$.subscribe(
      (categories) => (this.categories = categories)
    ); //yeni kategori dizisini dinler ve this.categories özelliğine atar.
    //Bu, bileşende kategori verilerini güncel tutar.

    const category$ = this.filterForm
      .get('category')!
      .valueChanges.pipe(startWith('')); //form kontrolünün değer değişimlerini dinleyen bir Observable oluşturur.
    //startWith('') operatörü ile, observable'ın ilk değerinin boş bir string ('') olmasını sağlar.                ??neden
    const search$ = this.filterForm.get('search')!.valueChanges.pipe(
      // form kontrolünün değer değişikliklerini izleyen bir Observable oluşturur ve çeşitli dönüşüm işlemleri uygular.
      startWith(''),
      debounceTime(500)
    );

    this.todos$ = combineLatest([
      this.todoService.todos$,
      category$,
      search$,
    ]).pipe(
      //combineLatest: Birden fazla Observable'ı birleştirir ve her biri yeni bir değer yayınladığında
      //bir dizi olarak son değerleri yayınlar.
      map(([todos, category, search]) => {
        return todos.filter((todo) => {
          const matchesCategory = category
            ? todo.categoryId === +category
            : true; //Eğer category değeri varsa, todo.categoryId'nin seçilen kategoriyle eşleşip eşleşmediğini kontrol eder.
          const matchesSearch = search
            ? todo.title.toLowerCase().includes(search.toLowerCase())
            : true; //Eğer search değeri varsa, todo.title'ın arama terimini içerip içermediğini kontrol eder.
          return matchesCategory && matchesSearch; //Yapılacak işin hem kategori hem de arama terimi ile eşleşip eşleşmediğini kontrol eder.
        });
      })
    );

    this.todos$.subscribe((todos) => this.setTodos(todos)); //todos => this.setTodos(todos): Observable yeni bir yapılacak işler (todos) listesi yayınladığında,
  }                                                         //bu listeyi this.setTodos(todos) işlevine geçirir.

  get todos(): FormArray {
    return this.todosForm.get('todos') as FormArray;
  }

  setTodos(todos: Todo[]): void {
    // formumuzda todo verilerimizin güncellemek ve bu verilere kontrol mekanızması oluşturmamızı sağlıyor.
    const todoFGs = todos.map((todo) =>
      this.fb.group({
        id: [todo.id],
        title: [todo.title],
        categoryId: [todo.categoryId],
      })
    );
    const todoFormArray = this.fb.array(todoFGs);
    this.todosForm.setControl('todos', todoFormArray);
  }

  getCategoryName(categoryId: number): string {
    // kategori ID'sini alıp ilgili kategori adını döndürmektir.
    const category = this.categories.find((cat) => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  }

  addTodoItem(): void {
    const todoFormGroup = this.fb.group({
      id: [null],
      title: [''],
      categoryId: [null],
    });
    this.todos.push(todoFormGroup);
    this.todosForm.markAsDirty();
  }

  removeTodoItem(index: number): void {
    const todoId = this.todos.at(index).value.id; //Belirtilen indeksteki todo'nun ID'sini al
    this.todos.removeAt(index); //Todo'yu form array'den kaldır
    this.todosForm.markAsDirty(); //formun değiştirildiğini belirtir
    this.removedTodos.push(todoId); // Kaldırılan todo'nun ID'sini removedTodos listesine ekle
  }

  saveChanges(): void {
    if (this.todosForm.valid) {
      //Formun geçerli olup olmadığını kontrol et
      const updatedTodos: Todo[] = this.todosForm.value.todos; //Güncellenmiş todo öğelerini al

      const finalTodos = updatedTodos.filter(
        (todo) => !this.removedTodos.includes(todo.id)
      ); // ??

      this.todoService.updateTodos(finalTodos); //Güncellenmiş todo'ları servise gönderir
      this.todosForm.markAsPristine(); //formun değişikliklerin kaydedildiğini belirtir ve formun tekrar değiştirilmiş olarak işaretlenmesini sağlar.
      this.removedTodos = []; // Kaldırılan todo'ları sıfırla
    }
  }
}
