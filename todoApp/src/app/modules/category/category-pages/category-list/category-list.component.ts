import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Category, CategoryService } from 'src/app/modules/services/category.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  categories$: Observable<Category[]>;
  categories: Category[] | undefined;

  constructor(private categoryService: CategoryService) {
    this.categories$ = this.categoryService.categories$;
  }

  ngOnInit(): void {
    // Kategorileri manuel olarak yüklemeye gerek yok çünkü categories$ zaten verileri yansıtıyor
  }
  removeCategory(categoryId: number): void {
    this.categoryService.removeCategory(categoryId);
  }
}
