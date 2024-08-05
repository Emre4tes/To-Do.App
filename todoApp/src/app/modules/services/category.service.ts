import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private categoriesMap: Map<number, Category> = new Map<number, Category>(); //Kategorileri Map içinde tutmak, onlara hızlı ve verimli bir şekilde erişmenizi sağlar.
                                                                             //Örneğin, kategori id'sine göre doğrudan erişim mümkündür.
  private categoriesSubject = new BehaviorSubject<Category[]>([]); //BehaviorSubject kategorilerdeki değişiklikleri dinlemek ve bu değişiklikleri diğer bileşenlere bildirmek
                                                                  //için kullanılabilir.
  categories$: Observable<Category[]> = this.categoriesSubject.asObservable();

  constructor() {
    this.loadCategoriesFromLocalStorage(); //localStorage'dan kategori verilerini alır ve categoriesMap üzerinde günceller.
  }

  private loadCategoriesFromLocalStorage(): void {
    //tarayıcıda saklanan kategori verilerini alır ve sınıfın içindeki categoriesMap'e yükler. Böylece uygulama başladığında veya sayfa yenilendiğinde, kategoriler yüklenmiş olur.
    const categories = this.getCategoriesFromLocalStorage();
    categories.forEach((category) =>
      this.categoriesMap.set(category.id, category)
    );// local storage'dan kategorileri alıp bir Map veri yapısına yerleştirir ve ardından bir Subject aracılığıyla bu kategorilerin güncellenmiş listesini yayınlar.
    this.categoriesSubject.next(Array.from(this.categoriesMap.values()));
  }

  private getCategoriesFromLocalStorage(): Category[] {
    //localStorage'dan kategori verilerini çeker ve JSON formatından JavaScript dizisine dönüştürür.
    return JSON.parse(localStorage.getItem('categories') || '[]');
  }

  private saveCategoriesToLocalStorage(): void {
    //categoriesMap'teki kategori verilerini localStorage'a kaydeder. uygulama kapatıldığında veya sayfa yenilendiğinde veriler korunur.
    const categories = Array.from(this.categoriesMap.values());
    localStorage.setItem('categories', JSON.stringify(categories));
  }

  getCategories(): Observable<Category[]> {
    //CategoryService'in dışarıdan erişilebilir bir metodudur ve kategori verilerini sağlamak için kullanılır.
    return this.categories$;
  }

  addCategory(category: Category): void {
    this.categoriesMap.set(category.id, category);
    this.saveCategoriesToLocalStorage();
    this.categoriesSubject.next(Array.from(this.categoriesMap.values()));
  }

  removeCategory(categoryId: number): void {
    if (this.categoriesMap.delete(categoryId)) {
      this.saveCategoriesToLocalStorage();
      this.categoriesSubject.next(Array.from(this.categoriesMap.values()));
    }
  }

  categoryExists(name: string): boolean {
    //bir kategori adının categoriesMap içinde mevcut olup olmadığını kontrol eder. Bu, aynı adla bir kategori olup olmadığını belirlemek için kullanılır.
    for (let category of this.categoriesMap.values()) {
      if (category.name.toLowerCase() === name.toLowerCase()) {
        return true;
      }
    }
    return false;
  }
}

export interface Category {
  id: number;
  name: string;
}
