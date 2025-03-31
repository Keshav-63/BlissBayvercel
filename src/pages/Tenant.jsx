"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2 } from "react-feather"
import Table from "../components/ui/Table"
import Modal from "../components/ui/Modal"

const API_URL = "https://blissbay.onrender.com/api/tenants";

const Tenant = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTenant, setCurrentTenant] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    location: "",
    contactPerson: "",
    phone: "",
    email: "",
    leaseStart: "",
    leaseEnd: "",
    rentAmount: "",
    status: "active",
  });


  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setTenants(data);
    } catch (error) {
      console.error("Error fetching tenants:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const openAddModal = () => {
    setCurrentTenant(null);
    setFormData({
      name: "",
      category: "",
      location: "",
      contactPerson: "",
      phone: "",
      email: "",
      leaseStart: "",
      leaseEnd: "",
      rentAmount: "",
      status: "active",
    });
    setModalOpen(true);
  };

  const openEditModal = (tenant) => {
    setCurrentTenant(tenant);
    setFormData(tenant);
    setModalOpen(true);
  };

  const openDeleteModal = (tenant) => {
    setCurrentTenant(tenant);
    setDeleteModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

      if (
        !formData.name ||
        !formData.category ||
        !formData.location ||
        !formData.contactPerson ||
        !formData.phone ||
        !formData.email ||
        !formData.leaseStart ||
        !formData.leaseEnd ||
        !formData.rentAmount ||
        !formData.status
      ) {
        alert("Please fill all required fields.");
        return;
      }


    setIsSubmitting(true); // Disable the button
    try {
      if (currentTenant) {
        // Update Tenant (PUT)
        const response = await fetch(`${API_URL}/update/${currentTenant._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error("Failed to update tenant");
      } else {
        // Add New Tenant (POST)
        console.log("Adding new tenant:", formData);
        const response = await fetch(`${API_URL}/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error("Failed to add tenant");
      }
      setModalOpen(false);
      fetchTenants();
    } catch (error) {
      console.error("Error saving tenant:", error);
    } finally {
      setIsSubmitting(false); // Re-enable the button
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_URL}/delete/${currentTenant._id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete tenant");

      setDeleteModalOpen(false);
      fetchTenants();
    } catch (error) {
      console.error("Error deleting tenant:", error);
    }
  };

  const columns = [
    { header: "Name", accessor: "name" },
    {
      header: "Rent",
      accessor: "rentAmount",
      render: (row) => `₹${row.rentAmount.toLocaleString("en-IN")}`,
    },
    { header: "Location", accessor: "location" },
    { header: "Person", accessor: "contactPerson" },
    { header: "Phone", accessor: "phone" },
    {
      header: "Lease Start",
      accessor: "leaseStart",
      render: (row) => new Date(row.leaseStart).toLocaleDateString("en-IN"),
    },
    {
      header: "Lease End",
      accessor: "leaseEnd",
      render: (row) => new Date(row.leaseEnd).toLocaleDateString("en-IN"),
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => (
        <span
          className={`badge ${
            row.status === "active" ? "badge-success" : "badge-warning"
          }`}
        >
          {row.status === "active" ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            className="btn btn-outline"
            onClick={() => openEditModal(row)}
          >
            <Edit size={16} />
          </button>
          <button
            className="btn btn-outline"
            onClick={() => openDeleteModal(row)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const tableActions = (
    <button className="btn btn-primary" onClick={openAddModal}>
      <Plus size={16} />
      <span>Add Tenant</span>
    </button>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Table
        columns={columns}
        data={tenants}
        actions={tableActions}
        searchable={true}
        searchPlaceholder="Search tenants..."
      />

      {/* Add/Edit Tenant Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={currentTenant ? "Edit Tenant" : "Add New Tenant"}
        footer={
          <>
            <button
              className="btn btn-outline"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Submitting..."
                : currentTenant
                ? "Update"
                : "Add"}{" "}
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Tenant Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                className="form-input"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Clothing">Clothing</option>
                <option value="Electronics">Electronics</option>
                <option value="Food & Beverage">Food & Beverage</option>
                <option value="Books & Stationery">Books & Stationery</option>
                <option value="Health & Fitness">Health & Fitness</option>
                <option value="Toys & Games">Toys & Games</option>
                <option value="Cosmetics">Cosmetics</option>
                <option value="Home Goods">Home Goods</option>
                <option value="Jewelry">Jewelry</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                name="location"
                className="form-input"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Person</label>
              <input
                type="text"
                name="contactPerson"
                className="form-input"
                value={formData.contactPerson}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Lease Start Date</label>
              <input
                type="date"
                name="leaseStart"
                className="form-input"
                value={formData.leaseStart}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Lease End Date</label>
              <input
                type="date"
                name="leaseEnd"
                className="form-input"
                value={formData.leaseEnd}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Monthly Rent (₹)</label>
              <input
                type="number"
                name="rentAmount"
                className="form-input"
                value={formData.rentAmount}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                name="status"
                className="form-input"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Delete"
        footer={
          <>
            <button
              className="btn btn-outline"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleDelete}
              style={{ backgroundColor: "#e74c3c" }}
            >
              Delete
            </button>
          </>
        }
      >
        <p>Are you sure you want to delete tenant "{currentTenant?.name}"?</p>
        <p className="text-secondary mt-4">This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default Tenant

