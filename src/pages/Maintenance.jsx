"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Eye, Check } from "react-feather"
import Table from "../components/ui/Table"
import Modal from "../components/ui/Modal"

const API_URL = "https://blissbay.onrender.com/api/maintenance";

const Maintenance = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentRequest, setCurrentRequest] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    requestedBy: "",
    contactInfo: "",
    category: "",
    description: "",
    priority: "medium",
    status: "pending",
    dateRequested: "",
    assignedTo: "",
  });



  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setRequests(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
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
    setCurrentRequest(null);
    setFormData({
      title: "",
      location: "",
      requestedBy: "",
      contactInfo: "",
      category: "",
      description: "",
      priority: "medium",
      status: "pending",
      dateRequested: new Date().toISOString().split("T")[0],
      assignedTo: "",
    });
    setModalOpen(true);
  };

  const openEditModal = (request) => {
    setCurrentRequest(request);
    setFormData(request);
    setModalOpen(true);
  };

  const openViewModal = (request) => {
    setCurrentRequest(request);
    setViewModalOpen(true);
  };

  const openDeleteModal = (request) => {
    setCurrentRequest(request);
    setDeleteModalOpen(true);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
      if (
        !formData.title ||
        !formData.location ||
        !formData.requestedBy ||
        !formData.contactInfo ||
        !formData.category ||
        !formData.description ||
        !formData.priority ||
        !formData.status ||
        !formData.assignedTo ||
        !formData.dateRequested 
      ) {
        alert("Please fill all required fields.");
        return;
      }
    try {
      if (currentRequest) {
        // Update request
        await fetch(`${API_URL}/update/${currentRequest._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        // Add new request
        await fetch(`${API_URL}/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }
      setModalOpen(false);
      fetchRequests();
    } catch (error) {
      console.error("Error submitting request:", error);
    }
  };

  // Handle status update
  const handleStatusChange = async (request, newStatus) => {
    try {
      await fetch(`${API_URL}/update/${request._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...request, status: newStatus }),
      });
      fetchRequests();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      await fetch(`${API_URL}/delete/${currentRequest._id}`, { method: "DELETE" });
      setDeleteModalOpen(false);
      fetchRequests();
    } catch (error) {
      console.error("Error deleting request:", error);
    }
  };

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Location", accessor: "location" },
    { header: "Category", accessor: "category" },
    {
      header: "Requested On",
      accessor: "dateRequested",
      render: (row) => new Date(row.dateRequested).toLocaleDateString("en-IN"),
    },
    {
      header: "Priority",
      accessor: "priority",
      render: (row) => {
        let badgeClass = "badge-info";
        if (row.priority === "high") badgeClass = "badge-danger";
        if (row.priority === "medium") badgeClass = "badge-warning";
        if (row.priority === "low") badgeClass = "badge-success";

        return (
          <span className={`badge ${badgeClass}`}>
            {row.priority.charAt(0).toUpperCase() + row.priority.slice(1)}
          </span>
        );
      },
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => {
        let badgeClass = "badge-warning";
        if (row.status === "in-progress") badgeClass = "badge-info";
        if (row.status === "completed") badgeClass = "badge-success";

        let statusText = row.status;
        if (statusText === "in-progress") statusText = "In Progress";

        return (
          <span className={`badge ${badgeClass}`}>
            {statusText.charAt(0).toUpperCase() + statusText.slice(1)}
          </span>
        );
      },
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            className="btn btn-outline"
            onClick={() => openViewModal(row)}
          >
            <Eye size={16} />
          </button>
          <button
            className="btn btn-outline"
            onClick={() => openEditModal(row)}
          >
            <Edit size={16} />
          </button>
          {row.status !== "completed" && (
            <button
              className="btn btn-outline"
              onClick={() => handleStatusChange(row, "completed")}
              title="Mark as Completed"
            >
              <Check size={16} />
            </button>
          )}
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
      <span>Add Request</span>
    </button>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Table
        columns={columns}
        data={requests}
        actions={tableActions}
        searchable={true}
        searchPlaceholder="Search maintenance requests..."
      />

      {/* Add/Edit Request Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={
          currentRequest
            ? "Edit Maintenance Request"
            : "Add Maintenance Request"
        }
        footer={
          <>
            <button
              className="btn btn-outline"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              {currentRequest ? "Update" : "Submit"} Request
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                name="title"
                className="form-input"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
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
              <label className="form-label">Requested By</label>
              <input
                type="text"
                name="requestedBy"
                className="form-input"
                value={formData.requestedBy}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Info</label>
              <input
                type="text"
                name="contactInfo"
                className="form-input"
                value={formData.contactInfo}
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
                <option value="HVAC">HVAC</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Structural">Structural</option>
                <option value="Carpentry">Carpentry</option>
                <option value="Flooring">Flooring</option>
                <option value="Painting">Painting</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                name="priority"
                className="form-input"
                value={formData.priority}
                onChange={handleInputChange}
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
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
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Assigned To</label>
              <input
                type="text"
                name="assignedTo"
                className="form-input"
                placeholder="Email of the person assigned"
                value={formData.assignedTo}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-input"
              rows="3"
              value={formData.description}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
        </form>
      </Modal>

      {/* View Request Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Maintenance Request Details"
        footer={
          <button
            className="btn btn-outline"
            onClick={() => setViewModalOpen(false)}
          >
            Close
          </button>
        }
      >
        {currentRequest && (
          <div>
            <div className="grid grid-2 mb-4">
              <div>
                <h4 className="text-sm text-secondary">Title</h4>
                <p>{currentRequest.title}</p>
              </div>

              <div>
                <h4 className="text-sm text-secondary">Location</h4>
                <p>{currentRequest.location}</p>
              </div>

              <div>
                <h4 className="text-sm text-secondary">Requested By</h4>
                <p>{currentRequest.requestedBy}</p>
              </div>

              <div>
                <h4 className="text-sm text-secondary">Contact Info</h4>
                <p>{currentRequest.contactInfo}</p>
              </div>

              <div>
                <h4 className="text-sm text-secondary">Category</h4>
                <p>{currentRequest.category}</p>
              </div>

              <div>
                <h4 className="text-sm text-secondary">Date Requested</h4>
                <p>
                  {new Date(currentRequest.dateRequested).toLocaleDateString(
                    "en-IN"
                  )}
                </p>
              </div>

              <div>
                <h4 className="text-sm text-secondary">Priority</h4>
                <p>
                  <span
                    className={`badge ${
                      currentRequest.priority === "high"
                        ? "badge-danger"
                        : currentRequest.priority === "medium"
                        ? "badge-warning"
                        : "badge-success"
                    }`}
                  >
                    {currentRequest.priority.charAt(0).toUpperCase() +
                      currentRequest.priority.slice(1)}
                  </span>
                </p>
              </div>

              <div>
                <h4 className="text-sm text-secondary">Status</h4>
                <p>
                  <span
                    className={`badge ${
                      currentRequest.status === "pending"
                        ? "badge-warning"
                        : currentRequest.status === "in-progress"
                        ? "badge-info"
                        : "badge-success"
                    }`}
                  >
                    {currentRequest.status === "in-progress"
                      ? "In Progress"
                      : currentRequest.status.charAt(0).toUpperCase() +
                        currentRequest.status.slice(1)}
                  </span>
                </p>
              </div>

              <div>
                <h4 className="text-sm text-secondary">Assigned To</h4>
                <p>{currentRequest.assignedTo || "Not assigned yet"}</p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm text-secondary">Description</h4>
              <p>{currentRequest.description}</p>
            </div>
          </div>
        )}
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
        <p>Are you sure you want to delete this maintenance request?</p>
        <p className="text-secondary mt-4">This action cannot be undone.</p>
      </Modal>
    </div>
  );
}

export default Maintenance

