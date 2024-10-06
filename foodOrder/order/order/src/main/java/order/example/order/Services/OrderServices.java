package order.example.order.Services;

import order.example.order.Data.Order;
import order.example.order.Repository.OrderRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderServices {
    @Autowired
    OrderRepo repo;

    public void addOrder(Order order){
        repo.save(order);
    }

    public List<Order> getOrders(){
       return repo.findAll();
    }

    public Order updateOrder(int orderID, Order orderDetails) {
        Optional<Order> optionalOrder = repo.findById(orderID);
        if (optionalOrder.isPresent()) {
            Order order = optionalOrder.get();

            order.setStatus(orderDetails.getStatus());
            return repo.save(order);
        }
        return null;
    }



}
