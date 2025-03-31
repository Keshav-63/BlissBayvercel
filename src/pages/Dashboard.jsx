"use client";

import { useState, useEffect } from "react";
import {
  Users,
  ShoppingBag,
  AlertTriangle,
  Tool,
  Calendar,
  DollarSign,
} from "react-feather";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [tenants, setTenants] = useState([]);
  const [rentAmount, setRentAmount] = useState(0);
  const [requests, setRequests] = useState([]);
  const [events, setEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState(0);
  const [pending, setPending] = useState(0);

  useEffect(() => {
    fetchTenants();
    fetchRequests();
    fetchEvents();
  }, []);

  const fetchTenants = async () => {
    try {
      const response = await fetch("https://blissbay.onrender.com/api/tenants");
      const data = await response.json();
      setTenants(data);
      const totalRent = data.reduce(
        (acc, tenant) => acc + tenant.rentAmount,
        0
      );
      setRentAmount(totalRent);
    } catch (error) {
      console.error("Error fetching tenants:", error);
    }
  };

  const fetchRequests = async () => {
    try {
      const response = await fetch(
        "https://blissbay.onrender.com/api/maintenance"
      );
      const data = await response.json();
      setRequests(data);
      const pendingCount = data.filter(
        (data) => data.status === "pending"
      ).length;
      setPending(pendingCount);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch("https://blissbay.onrender.com/api/events");
      const data = await response.json();
      setEvents(data);
      const upcomingCount = data.filter(
        (data) => data.status === "upcoming"
      ).length;
      setUpcomingEvents(upcomingCount);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };


  const calculateMonthlyRevenue = () => {
    const monthlyRevenue = Array(12).fill(0); 
    tenants.forEach((tenant) => {
      const month = new Date(tenant.leaseStart).getMonth(); 
      monthlyRevenue[month] += tenant.rentAmount; 
    });
    
    console.log("Monthly Revenue:", monthlyRevenue);
    return monthlyRevenue;
  };

  const monthlyRevenue = calculateMonthlyRevenue();

  // Chart data and options
  const chartData = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Monthly Revenue (₹)",
        data: monthlyRevenue,
        backgroundColor: "rgba(46, 204, 113, 0.5)", // Light green
        borderColor: "rgba(46, 204, 113, 1)", // Dark green
        borderWidth: 1,
      },
    ],
    
  };
console.log("Chart Data:", chartData);
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Revenue from Tenants",
      },
    },
  };

  return (
    <div>
      <div className="stats-grid">
        {/* Other stat cards */}
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="stat-title">Total Tenants</div>
              <div className="stat-value">{tenants.length}</div>
            </div>
            <div className="stat-icon" style={{ color: "#3498db" }}>
              <Users size={24} />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="stat-title">Monthly Revenue from Tenant</div>
              <div className="stat-value">₹{rentAmount.toLocaleString()}</div>
            </div>
            <div className="stat-icon" style={{ color: "#9b59b6" }}>
              <DollarSign size={24} />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="stat-title">Pending Maintenance</div>
              <div className="stat-value">{pending}</div>
              <div className="stat-description">
                Requests awaiting resolution
              </div>
            </div>
            <div className="stat-icon" style={{ color: "#f39c12" }}>
              <Tool size={24} />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <div className="stat-title">Upcoming Events</div>
              <div className="stat-value">{upcomingEvents}</div>
              <div className="stat-description">
                Scheduled in the next 30 days
              </div>
            </div>
            <div className="stat-icon" style={{ color: "#2ecc71" }}>
              <Calendar size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Card */}
      <div className="card recent-activity">
        <h3 className="card-title">Monthly Revenue</h3>
        <div style={{ height: "300px" }}>
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
