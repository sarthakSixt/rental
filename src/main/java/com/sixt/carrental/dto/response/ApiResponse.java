package com.sixt.carrental.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ApiResponse {

    private Boolean success;
    private String message;
    private Object data;

    // Success response
    public static ApiResponse success(String message, Object data) {
        return new ApiResponse(true, message, data);
    }

    // Success without data
    public static ApiResponse success(String message) {
        return new ApiResponse(true, message, null);
    }

    // Error response
    public static ApiResponse error(String message) {
        return new ApiResponse(false, message, null);
    }
}