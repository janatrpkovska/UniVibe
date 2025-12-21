package com.univibe.backend.web;

import com.univibe.backend.model.Category;
import com.univibe.backend.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/category/")
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping("/get-category/{id}")
    public Category getCategory(@PathVariable Long id) {
        return categoryService.getCategoryById(id);
    }

    @PostMapping("/create-category")
    public Category createCategory(@RequestBody Category category) {
        return categoryService.addCategory(category.getName(), category.getIcon_url());
    }

    @PostMapping("/update-category")
    public Category updateCategory(@RequestBody Category category) {
        return categoryService.updateCategory(category.getId(), category.getName(), category.getIcon_url());
    }

    @GetMapping("/get-by-name")
    public Category getCategoryByName(@RequestParam String name) {
        return categoryService.getCategoryByName(name);
    }

    @GetMapping("/get-all")
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @DeleteMapping("/delete/{id}")
    public Category deleteCategory(@PathVariable Long id) {
        return categoryService.deleteCategory(id);
    }
}
