import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import "./PlaceOrder.css";
import { StoreContext } from "../../Context/StoreContext";

const PlaceOrder = () => {
  const { getTotalCartAmount } = useContext(StoreContext);
  const { register, handleSubmit, reset } = useForm();
  const { state } = useLocation();  // Retrieve passed data from Cart
  const navigate = useNavigate();  // For navigation

  // Check if state and the variables exist
  const itemNames = state?.itemNames || "";
  const totalQuantity = state?.totalQuantity || 0;
  const totalAmount = state?.totalAmount || getTotalCartAmount() + 2;  // Fallback to computed totalAmount if state is missing

  const onSubmit = async (data) => {
    const orderData = {
      ...data,
      quantity: totalQuantity,
      total: totalAmount,
      itemName: itemNames,
    };

    try {
      const response = await axios.post('http://localhost:8084/ms-api/orders', orderData);
      console.log(response.data);
      toast.success("Order placed successfully!"); // Show success message
      reset();  // Reset form fields after successful submission
      setTimeout(() => {
        navigate("/myorders");  // Redirect to home page after a short delay
      }, 2000);  // Delay to allow Toastify message to be visible
    } catch (error) {
      console.error('There was a problem with the Axios request:', error);
      toast.error("There was a problem placing your order."); // Show error message
    }
  };

  return (
    <div>
      <form className="place-order" onSubmit={handleSubmit(onSubmit)}>
        <div className="place-order-left">
          <p className="title">Delivery Information</p>
          <div className="multi-fields">
            <input type="text" placeholder="Name" {...register("customerName")} />
          </div>
          <input type="email" placeholder="Email address" {...register("email")} />
          <input type="text" placeholder="Address" {...register("address")} />
          <input type="text" placeholder="Phone" {...register("phone")} />
        </div>
        <div className="place-order-right">
          <div className="cart-total">
            <h2>Cart Totals</h2>
            <div>
              <div className="cart-total-details">
                <p>Subtotal</p>
                <p>${getTotalCartAmount()}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <b>Total</b>
                <b>${totalAmount}</b> {/* Displaying total passed from Cart */}
              </div>
            </div>
            <button type="submit">PROCEED TO PAYMENT</button>
          </div>
        </div>
      </form>
      <ToastContainer /> {/* Add ToastContainer to your JSX */}
    </div>
  );
};

export default PlaceOrder;
