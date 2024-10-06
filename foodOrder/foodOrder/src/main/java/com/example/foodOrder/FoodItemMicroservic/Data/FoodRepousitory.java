package com.example.foodOrder.FoodItemMicroservic.Data;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FoodRepousitory
        extends JpaRepository<Food, Long> {
    List<Food> findByProductnameContainingIgnoreCase(String productname);

}
