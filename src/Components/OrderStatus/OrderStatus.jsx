import React, { useState, useEffect } from 'react';
import { backend_url, currency } from '../../App';
import './OrderStatus.css';

const OrderStatus = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${backend_url}/orderstatus`);
      const data = await response.json();
      // Sort orders: latest first
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="view-orders">
      <h2>All Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.userId?.name || 'Unknown'}</td>
                <td>{currency}{order.totalAmount}</td>
                <td>{order.orderStatus}</td>
                <td>
                  <UpdateOrderStatus orderId={order._id} fetchOrders={fetchOrders} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const UpdateOrderStatus = ({ orderId, fetchOrders }) => {
  const [status, setStatus] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const updateStatus = async () => {
    try {
      const response = await fetch(`${backend_url}/orderstatus/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, newStatus: status }),
      });
      const data = await response.json();
      if (data.success) {
        setSuccessMessage('Order status updated successfully.');
        setErrorMessage('');
        fetchOrders(); // Call fetchOrders from the parent component
      } else {
        setErrorMessage(data.message || 'Failed to update order status.');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      setErrorMessage('An error occurred while updating the order status.');
      setSuccessMessage('');
    }
  };

  return (
    <div>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">Select status</option>
        <option value="Processing">Processing</option>
        <option value="Shipped">Shipped</option>
        <option value="Delivered">Delivered</option>
        <option value="Cancelled">Cancelled</option>
      </select>
      <button onClick={updateStatus}>Update</button>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default OrderStatus;
