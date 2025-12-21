package com.univibe.backend.service;

import com.univibe.backend.model.Category;

import java.util.List;

public interface CategoryService {
    Category getCategoryById(Long id);
    List<Category> getAllCategories();
    Category getCategoryByName(String name);
    Category addCategory(String name, String icon_url);
    Category updateCategory(Long id, String name, String icon_url);
    Category deleteCategory(Long id);
}
