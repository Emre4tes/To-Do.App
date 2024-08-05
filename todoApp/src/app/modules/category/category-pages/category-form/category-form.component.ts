import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from 'src/app/modules/services/category.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
})
export class CategoryFormComponent {
  categoryForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  onSubmit(): void {//verilerini işlemek, doğrulamak ve gerekli işlemleri yapmaktır.
    this.errorMessage = null; //Herhangi bir hata mesajını temizler
    if (this.categoryForm.valid) {
      const categoryName = this.categoryForm.value.name.trim(); //formdan kategori adını alır ,baştaki ve sondaki boşlukları temizler
      if (this.categoryService.categoryExists(categoryName)) {
        // formda bu kategori adına sahip olmadıgında hata mesajı verir.
        this.errorMessage = 'Category with the same name already exists!';
      } else {
        const newCategory = {
          //yeni bir kategori oluşturur
          id: Date.now(), //ve bu kategoriye benzersiz bir kimlik verir
          name: categoryName,
        };
        this.categoryService.addCategory(newCategory);
        this.categoryForm.reset();
      }
    }
  }
}
