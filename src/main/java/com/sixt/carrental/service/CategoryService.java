package com.sixt.carrental.service;

import com.sixt.carrental.entity.Category;
import com.sixt.carrental.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor

public class CategoryService{
    private final CategoryRepository categoryRepository;

    //Create new category
    public Category createCategory(Category category){
        if(categoryRepository.existsByCode(category.getCode())){
            throw new RuntimeException("Category code already exists: " + category);
        }
        return categoryRepository.save(category);
    }

    // Get all categories
    public List<Category> getAllCategories(){
        return categoryRepository.findAll();
    }
    //Find by code
    public Optional<Category> findByCode(String code){
        return categoryRepository.findByCode(code);
    }
    // Find by ID
    public Optional<Category> findById(Long id){
        return categoryRepository.findById(id);
    }

    // Update category
    public Category updateCategory(Category category){
        if(!categoryRepository.existsById(category.getId())){
            throw new RuntimeException("Category not found with ID: " + category.getId());
        }
        return categoryRepository.save(category);
    }

    //Delete category
    public void deleteCategory(Long id){
        if(!categoryRepository.existsById(id)){
            throw new RuntimeException("Category not found with ID: " + id);
        }
        categoryRepository.deleteById(id);
    }
}