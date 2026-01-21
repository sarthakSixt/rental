package com.sixt.carrental.controller;

import com.sixt.carrental.dto.response.ApiResponse;
import com.sixt.carrental.entity.Category;
import com.sixt.carrental.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CategoryController {

    private final CategoryService categoryService;

    // GET /api/categories - Get all categories
    @GetMapping
    public ResponseEntity<ApiResponse> getAllCategories() {
        try {
            List<Category> categories = categoryService.getAllCategories();
            return ResponseEntity.ok(ApiResponse.success("Categories fetched successfully", categories));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to fetch categories: " + e.getMessage()));
        }
    }

    // GET /api/categories/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getCategoryById(@PathVariable Long id) {
        try {
            return categoryService.findById(id)
                    .map(category -> ResponseEntity.ok(ApiResponse.success("Category found", category)))
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(ApiResponse.error("Failed to fetch category: " + e.getMessage()));
        }
    }
}