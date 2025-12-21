package com.univibe.backend.service.impl;

import com.univibe.backend.model.Category;
import com.univibe.backend.repository.CategoryJpaRepository;
import com.univibe.backend.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {
    private final CategoryJpaRepository categoryJpaRepository;

    @Override
    public Category getCategoryById(Long id) {
        return categoryJpaRepository.findById(id).orElse(null);
    }

    @Override
    public List<Category> getAllCategories() {
        return categoryJpaRepository.findAll();
    }

    @Override
    public Category getCategoryByName(String name) {
        return categoryJpaRepository.findByName(name);
    }

    @Override
    public Category addCategory(String name, String icon_url) {
        Category category = new Category();
        category.setName(name);
        category.setIcon_url(icon_url);
        return categoryJpaRepository.save(category);
    }

    @Override
    public Category updateCategory(Long id, String name, String icon_url) {
        Category category = this.getCategoryById(id);
        category.setName(name);
        category.setIcon_url(icon_url);
        return categoryJpaRepository.save(category);
    }

    @Override
    public Category deleteCategory(Long id) {
        Category toDelete = this.getCategoryById(id);
        categoryJpaRepository.delete(toDelete);
        return toDelete;
    }
}
