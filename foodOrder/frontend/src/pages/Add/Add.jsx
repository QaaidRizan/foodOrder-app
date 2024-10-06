import React, { useState, useCallback } from 'react';
import './Add.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { assets } from '../../assets/assets';

export default function Add() {

  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    productname: "",
    description: "",
    price: "",
    category: "Salad"
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const onChangeHandler = useCallback((event) => {
    const { name, value } = event.target;
    setData(prevData => ({ ...prevData, [name]: value }));
    setSuccessMessage(''); // Clear success message on input change
    setErrorMessage(''); // Clear error message on input change
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        console.log('Image uploaded:', reader.result); // Debugging image upload
      };
      reader.onerror = () => {
        setErrorMessage("Error reading the image file.");
      };
      reader.readAsDataURL(file);
    } else {
      setErrorMessage("Please upload a valid image file.");
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
  
    const formData = new FormData();
    formData.append('image', event.target.image.files[0]);
    formData.append('productname', data.productname);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('price', data.price);
  
    try {
      const response = await fetch("http://localhost:8086/foms-api/foods", {
        method: "POST",
        body: formData
      });
  
      if (response.ok) {
        setSuccessMessage("Product added successfully!");
        setErrorMessage('');
        setData({ productname: "", description: "", category: "Salad", price: "" });
        setImage(null); // Clear the image after successful submission
        toast.success("Product added successfully!");
        console.log('Product added successfully'); // Debugging success
      } else {
        const errorData = await response.json();
        setErrorMessage(`Failed to add product: ${errorData.error || 'Unknown error'}`);
        setSuccessMessage('');
        toast.error(`Failed to add product: ${errorData.error || 'Unknown error'}`);
        console.log('Error adding product:', errorData); // Debugging error
      }
    } catch (error) {
      setErrorMessage(`Error adding product: ${error.message}`);
      setSuccessMessage('');
      toast.error(`Error adding product: ${error.message}`);
      console.log('Catch error:', error); // Debugging catch block error
    }
  };
  return (
    
    <div className="container">
      
      <div className="paper">
     <h2 ><u>Add Product</u></h2><br /><br />
        <form onSubmit={onSubmitHandler} className="form">
          <div className="form-group">
            <label>Upload Image</label>
            <div className="upload-area">
              <label htmlFor="image">
                <img
                  src={image || assets.upload_area}
                  alt="Upload Area"
                  className="upload-img"
                />
              </label>
        <div className='img-upload'>    <input
                onChange={handleImageChange}
                type="file"
                id="image"
                hidden
              /></div>  
            </div>
          </div>
          <div className="form-group"><br />
            <label><center></center>Product Name</label>
            <input
              type="text"
              name="productname"
              value={data.productname}
              onChange={onChangeHandler}
              required
            /> <br />
          </div>
          <div className="form-group">
            <label>Product Description</label>
            <textarea
              name="description"
              value={data.description}
              onChange={onChangeHandler}
              rows="4"
              required
            />
          </div>
          <div className="form-group"><br />
            <label>Product Category</label>
            <select
              name="category"
              value={data.category}
              onChange={onChangeHandler}
              required
            >
              <option value="Salad">Salad</option>
              <option value="Roles">Roles</option>
              <option value="Dessert">Dessert</option>
              <option value="Sandwich">Sandwich</option>
              <option value="Cake">Cake</option>
              <option value="Pasta">Pasta</option>
              <option value="Noodles">Noodles</option>
            </select>
          </div><br />
          <div className="form-group">
            <label>Product Price</label>
            <input
              type="number"
              name="price"
              value={data.price}
              onChange={onChangeHandler}
              required
              min="0"
            />
          </div><br /><br />
          <button className='submit-button' type="submit">Add Product</button>
          {successMessage && <p className="success-message">{successMessage}</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}  
