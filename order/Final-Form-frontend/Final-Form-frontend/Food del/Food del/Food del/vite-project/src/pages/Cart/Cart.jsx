import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../Context/StoreContext";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cartItems, food_list, getTotalCartAmount, removeFromCart } = useContext(StoreContext);
  const navigate = useNavigate();

  const deliveryFee = getTotalCartAmount() === 0 ? 0 : 2;

  // Function to handle removing an item from the cart
  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId); // Assuming this function is provided in StoreContext
  };

  // Function to handle navigation to the PlaceOrder component
  const handleProceedToPayment = () => {
    const orderItems = food_list
      .filter((item) => cartItems[item._id] > 0)
      .map((item) => ({
        item_name: item.name,
        quantity: cartItems[item._id],
        total: item.price * cartItems[item._id],
      }));

    const totalQuantity = orderItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalAmount = getTotalCartAmount() + deliveryFee;
    const itemNames = orderItems.map((item) => item.item_name).join(", ");

    // Pass data via navigate
    navigate("/order", { state: { itemNames, totalQuantity, totalAmount } });
  };

  return (
    <div className="cart">
      <div className="cart-items">
        <h2>Your Cart</h2>
        {food_list.filter((item) => cartItems[item._id] > 0).length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          food_list
            .filter((item) => cartItems[item._id] > 0)
            .map((item) => (
              <div key={item._id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-image" />
                <div className="cart-item-details">
                  <p className="cart-item-name">{item.name}</p>
                  <p>Quantity: {cartItems[item._id]}</p>
                  <p>Total: ${item.price * cartItems[item._id]}</p>
                  <button
                    className="remove-button"
                    onClick={() => handleRemoveFromCart(item._id)}
                  >
                    X
                  </button>
                </div>
              </div>
            ))
        )}
        <hr />
        <div className="cart-summary">
          <p>Total Quantity: {Object.keys(cartItems).reduce((total, key) => total + cartItems[key], 0)}</p>
          <p>Total Amount: ${getTotalCartAmount() + deliveryFee}</p>
        </div>
        <button onClick={handleProceedToPayment}>PROCEED TO CHECKOUT</button>
      </div>
    </div>
  );
};

export default Cart;
