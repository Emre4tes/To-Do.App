import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  getTodos() {
    throw new Error('Method not implemented.');
  }
  private todosSubject = new BehaviorSubject<Todo[]>(
    this.getTodosFromLocalStorage()
  ); //todosSubject, todo verilerini saklar ve bu verilerdeki değişiklikleri yönetir.
  //Başlangıçta, localStorage'dan yüklenen todo verileri ile başlar.
  todos$: Observable<Todo[]> = this.todosSubject.asObservable(); //todos$, dış bileşenlerin ve servislerin todo verilerini dinlemesini sağlar.

  private getTodosFromLocalStorage(): Todo[] {
    //localStorage'dan todo verilerini alır ve bu verileri Todo[] türünde bir diziye dönüştürür.
    return JSON.parse(localStorage.getItem('todos') || '[]');
  }

  private saveTodosToLocalStorage(todos: Todo[]): void {
    //verilerin tarayıcı kapatıldığında veya sayfa yenilendiğinde bile kalıcı olarak saklanmasını sağlar.
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  addTodoItem(todo: Todo): void {
    const todos = this.getTodosFromLocalStorage(); //localStorage'dan mevcut todo öğelerini alır ve bir Todo[] dizisi olarak döndürür. Bu, mevcut todo listesini yükler.
    todos.push(todo); //todo dizisine yeni todo öğesini ekler ve dizinin sonuna bir öğe ekler.
    this.saveTodosToLocalStorage(todos);
    this.todosSubject.next(todos);
  }

  removeTodoItem(todoId: number): void {
    // todoId'ye sahip todo öğesini diziden kaldırır ve bu güncellenmiş diziyi localStorage'a kaydeder.
    const todos = this.getTodosFromLocalStorage().filter(
      (todo) => todo.id !== todoId
    ); //todo öğelerini alır ve bir Todo[] dizisi olarak döndürür.
    //todo.id değeri verilen todoId ile eşleşmeyen tüm todo öğelerini içeren yeni bir dizi oluşturur.
    this.saveTodosToLocalStorage(todos); // güncellenmiş veriyi JSON fomratında localstorage'a kaydedder. Değişiklikleri kalıcı olrak saklanmasını sağlar.
    this.todosSubject.next(todos); //todo dizisindeki değişiklikleri dinleyen tüm abonelere (subscribers) güncellenmiş diziyi bildirir.
  }

  updateTodoItem(updatedTodo: Todo): void {
    //belirli bir id'ye sahip todo öğesini günceller. Güncellenmiş todo öğesi dizideki ilgili öğeyi değiştirir.
    const todos = this.getTodosFromLocalStorage().map((todo) =>
      todo.id === updatedTodo.id ? updatedTodo : todo
    ); //Eğer mevcut todo'nun id'si güncellenmiş todo'nun id'si ile eşleşiyorsa,
    // bu todo'yu güncellenmiş todo ile değiştirir (updatedTodo).
    this.saveTodosToLocalStorage(todos);
    this.todosSubject.next(todos);
  }

  updateTodos(updatedTodos: Todo[]): void {
    // tüm uygulama bileşenlerinin ve servislerin güncellenmiş todo dizisini almasını sağlar.
    this.saveTodosToLocalStorage(updatedTodos);
    this.todosSubject.next(updatedTodos);
  }
}

export interface Todo {
  id: number;
  title: string;
  categoryId: number;
}
