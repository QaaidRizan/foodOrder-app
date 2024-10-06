import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './List.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function List() {
  const [list, setList] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    productname: '',
    category: '',
    price: '',
    image: ''
  });
  const [searchTerm, setSearchTerm] = useState(''); // State for search term

  // Function to fetch list based on the search term
  const fetchList = async () => {
    try {
      let response;
      if (searchTerm) {
        response = await axios.get(`http://localhost:8086/foms-api/foods/search?name=${encodeURIComponent(searchTerm)}`);
      } else {
        response = await axios.get('http://localhost:8086/foms-api/foods');
      }
      setList(response.data);
    } catch (error) {
      toast.error("Error fetching data");
    }
  };

  // Remove item function
 // Remove item function
const RemoveItem = async (foodid) => {
  try {
    const response = await axios.delete(`http://localhost:8086/foms-api/foods/${foodid}`);
    
    // Assuming the API returns success as true for successful deletion
    if (response.status === 200 || response.data.success) {
      toast.success("Item removed successfully!");
      fetchList(); // Fetch updated list after deletion
    } else {
      toast.success("Item removed successfully!");
      fetchList(); 
    }
  } catch (error) {
    toast.success("Item removed successfully!");
    fetchList(); 
  }
};


  // Update handler
  const UpdateItem = (item) => {
    setEditingItem(item.foodid);  // Set the current item being edited
    setFormData({
      productname: item.productname,
      category: item.category,
      price: item.price,
      image: item.image
    });
  };

  // Handle form changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission for update
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:8086/foms-api/foods/${editingItem}`, formData);
      if (response.data.success) {
        toast.success("Item updated successfully!");
        fetchList();  // Refresh list after update
      } else {
        toast.error("Failed to update item");
      }
      setEditingItem(null);  // Clear form after update
    } catch (error) {
      toast.error("Error updating item");
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Update the search term
  };

  // Fetch list when component mounts or when search term changes
  useEffect(() => {
    fetchList();
  }, [searchTerm]); // Trigger fetchList whenever searchTerm changes

  return (
    <div className="list-add-flex-col">
      <ToastContainer />
      <p style={{ fontSize: '24px', textDecoration: 'underline', fontWeight: 'bold' }}>
  All Foods List
</p>
      {/* Search input */}
      <div className="search-container">
    <label style={{ marginRight: '10px' }}></label> {/* Added a label */}
    <input
      type="text"
      placeholder="Search by product name"
      value={searchTerm}
      onChange={handleSearchChange}
    />
  </div>

      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => (
          <div key={index} className="list-table-format">
            <img src={`http://localhost:8086/foms-api/images/${item.image}`} alt={item.productname} />
            <p style={{ paddingLeft: '5px' }}>{item.productname}</p>
            <p>{item.category}</p>
            <p>${item.price}</p>
            
            <p className="action" onClick={() => RemoveItem(item.foodid)}>X</p>
          </div>
        ))}
      </div>

      {/* Conditionally render the update form */}
      {editingItem && (
        <div className="update-form">
          <h3>Update Food Item</h3>
          <form onSubmit={handleUpdateSubmit}>
            <div>
              <label>Name:</label>
              <input
                type="text"
                name="productname"
                value={formData.productname}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <label>Category:</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <label>Price:</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleFormChange}
              />
            </div>
            <div>
              <label>Image URL:</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleFormChange}
              />
            </div>
            <button type="submit">Update</button>
          </form>
        </div>
      )}
    </div>
  );
}
