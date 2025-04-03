import { backend_url} from "../../App";
import React, { useEffect, useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "./dashboard.css";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const Dashboard = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${backend_url}/orderstatus`);
        const data = await response.json();
        if (response.ok) {
          setOrders(data);
        } else {
          console.error("Error fetching orders:", data.message);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // Orders by Month
  const ordersByMonth = orders.reduce((acc, order) => {
    const month = new Date(order.createdAt).toLocaleString("default", { month: "short", year: "numeric" });
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});
  const orderData = Object.entries(ordersByMonth).map(([month, count]) => ({ month, orders: count }));

  // Order Status Distribution
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.orderStatus] = (acc[order.orderStatus] || 0) + 1;
    return acc;
  }, {});
  const statusData = Object.entries(statusCounts).map(([status, count]) => ({ name: status, value: count }));

  // Revenue by Month
  const revenueByMonth = orders.reduce((acc, order) => {
    const month = new Date(order.createdAt).toLocaleString("default", { month: "short", year: "numeric" });
    acc[month] = (acc[month] || 0) + order.totalAmount;
    return acc;
  }, {});
  const revenueData = Object.entries(revenueByMonth).map(([month, revenue]) => ({ month, revenue }));

  // Top-Selling Products
  const productSales = orders.flatMap(order => order.items).reduce((acc, item) => {
    acc[item.name] = (acc[item.name] || 0) + item.quantity;
    return acc;
  }, {});
  const productData = Object.entries(productSales).map(([name, sales]) => ({ name, sales }));

  // Payment Status Breakdown
  const paymentCounts = orders.reduce((acc, order) => {
    acc[order.paymentStatus] = (acc[order.paymentStatus] || 0) + 1;
    return acc;
  }, {});
  const paymentData = Object.entries(paymentCounts).map(([status, count]) => ({ name: status, value: count }));

  // Orders Per User
  const ordersPerUser = orders.reduce((acc, order) => {
    const user = order.userId.name || "Unknown User";
    acc[user] = (acc[user] || 0) + 1;
    return acc;
  }, {});
  const userData = Object.entries(ordersPerUser).map(([name, orders]) => ({ name, orders }));

  return (
    <div className="dashboard-container">
      <div className="dashboard-grid">
        
        {/* Orders Over Time */}
        <div className="card">
          <h3>Orders Over Time</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={orderData}>
              <XAxis dataKey="month" stroke="#555" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="orders" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Order Status Distribution */}
        <div className="card">
          <h3>Order Status Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {statusData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Month */}
        <div className="card">
          <h3>Revenue by Month</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueData}>
              <XAxis dataKey="month" stroke="#555" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Selling Products */}
        <div className="card">
          <h3>Top Selling Products</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={productData}>
              <XAxis dataKey="name" stroke="#555" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#ff7300" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Status Breakdown */}
        <div className="card">
          <h3>Payment Status Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={paymentData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {paymentData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Per User */}
        <div className="card">
          <h3>Orders Per User</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={userData}>
              <XAxis dataKey="name" stroke="#555" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
