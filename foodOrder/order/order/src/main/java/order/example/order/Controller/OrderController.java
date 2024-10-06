package order.example.order.Controller;

import order.example.order.Data.Order;
import order.example.order.Services.OrderServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class OrderController {
    @Autowired
    OrderServices services;

    @PostMapping("/order")
    public void addOrder(@RequestBody Order order){
        services.addOrder(order);
    }

    @GetMapping("/orders")
    public List<Order> getOrders(){
         return services.getOrders();
    }

    @PutMapping("/order/{orderID}")
    public void updateOrder(@PathVariable int orderID, @RequestBody Order orderDetails) {
        // Pass both the path variable (ID) and request body (details) to update the order
        services.updateOrder(orderID, orderDetails);
    }

}
