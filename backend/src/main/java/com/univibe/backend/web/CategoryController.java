package com.univibe.backend.web;

import com.univibe.backend.model.Category;
import com.univibe.backend.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/category/")
public class CategoryController {
    private final CategoryService categoryService;

    @GetMapping("/public/get-category/{id}")
    public Category getCategory(@PathVariable Long id) {
        return categoryService.getCategoryById(id);
    }

    @PostMapping("/create-category")
    @PreAuthorize("hasRole('ADMIN')")
    public Category createCategory(@RequestBody Category category) {
        return categoryService.addCategory(category.getName(), category.getIcon_url());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/update-category")
    public Category updateCategory(@RequestBody Category category) {
        return categoryService.updateCategory(category.getId(), category.getName(), category.getIcon_url());
    }

    @GetMapping("/public/get-by-name")
    public Category getCategoryByName(@RequestParam String name) {
        return categoryService.getCategoryByName(name);
    }

    @GetMapping("/public/get-all")
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public Category deleteCategory(@PathVariable Long id) {
        return categoryService.deleteCategory(id);
    }
}
