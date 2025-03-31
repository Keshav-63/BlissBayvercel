"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Eye } from "react-feather"
import Table from "../components/ui/Table"
import Modal from "../components/ui/Modal"

const API_URL = "https://blissbay.onrender.com/api/security"; 

const Security = () => {
  const [personnel, setPersonnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("personnel");

  const [personnelModalOpen, setPersonnelModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPersonnel, setCurrentPersonnel] = useState(null);

  // Form states
  const [personnelForm, setPersonnelForm] = useState({
    name: "",
    position: "",
    shift: "",
    phone: "",
    email: "",
    joinDate: "",
    status: "active",
  });

 
  useEffect(() => {
    fetchPersonnel();
  }, []);
  const fetchPersonnel = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setPersonnel(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching personnel:", error);
      setLoading(false);
    }
  };

  const handlePersonnelInputChange = (e) => {
    const { name, value } = e.target;
    setPersonnelForm({
      ...personnelForm,
      [name]: value,
    });
  };

  const openAddPersonnelModal = () => {
    setCurrentPersonnel(null);
    setPersonnelForm({
      name: "",
      position: "",
      shift: "",
      phone: "",
      email: "",
      joinDate: "",
      status: "active",
    });
    setPersonnelModalOpen(true);
  };

  const openEditPersonnelModal = (person) => {
    setCurrentPersonnel(person);
    setPersonnelForm({
      name: person.name,
      position: person.position,
      shift: person.shift,
      phone: person.phone,
      email: person.email,
      joinDate: person.joinDate,
      status: person.status,
    });
    setPersonnelModalOpen(true);
  };


  const openDeleteModal = (person) => {
    setCurrentPersonnel(person);
    setDeleteModalOpen(true);
  };

 
  const handlePersonnelSubmit = async (e) => {
    e.preventDefault();
      if(
        !personnelForm.name ||
        !personnelForm.position ||
        !personnelForm.shift ||
        !personnelForm.phone ||
        !personnelForm.email ||
        !personnelForm.joinDate ||
        !personnelForm.status 
      ) {
        alert("Please fill all required fields.");
        return;
      }
        


 setIsSubmitting(true);
    if (currentPersonnel) {
    
      try {
        const response = await fetch(
          `${API_URL}/update/${currentPersonnel._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(personnelForm),
          }
        );

        if (response.ok) {
          fetchPersonnel(); 
          setPersonnelModalOpen(false);
        }
      } catch (error) {
        console.error("Error updating personnel:", error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
  
      try {
        console.log("personnelForm", personnelForm);
        const response = await fetch(`${API_URL}/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(personnelForm),
        });

        if (response.ok) {
          fetchPersonnel(); // Refresh list
          setPersonnelModalOpen(false);
        }
      } catch (error) {
        console.error("Error adding personnel:", error);
      } finally {
        setIsSubmitting(false); // Re-enable the button
      }
    }
  };

  // Handle delete personnel
  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_URL}/delete/${currentPersonnel._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchPersonnel(); // Refresh list
        setDeleteModalOpen(false);
      }
    } catch (error) {
      console.error("Error deleting personnel:", error);
    }
  };
  const personnelColumns = [
    { header: "Name", accessor: "name" },
    { header: "Position", accessor: "position" },
    { header: "Shift", accessor: "shift" },
    { header: "Phone", accessor: "phone" },
    { header: "Email", accessor: "email" },
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
            onClick={() => openEditPersonnelModal(row)}
          >
            <Edit size={16} />
          </button>
          <button
            className="btn btn-outline"
            onClick={() => openDeleteModal(row, "personnel")}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  const personnelTableActions = (
    <button className="btn btn-primary" onClick={openAddPersonnelModal}>
      <Plus size={16} />
      <span>Add Personnel</span>
    </button>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="mb-4">
        <div className="flex gap-4 border-b">
          <button
            className={`btn ${
              activeTab === "personnel" ? "btn-primary" : "btn-outline"
            }`}
            onClick={() => setActiveTab("personnel")}
          >
            Security Personnel
          </button>
        </div>
      </div>

      {activeTab === "personnel" && (
        <Table
          columns={personnelColumns}
          data={personnel}
          actions={personnelTableActions}
          searchable={true}
          searchPlaceholder="Search personnel..."
        />
      )}

      {/* Personnel Modal */}
      <Modal
        isOpen={personnelModalOpen}
        onClose={() => setPersonnelModalOpen(false)}
        title={currentPersonnel ? "Edit Personnel" : "Add New Personnel"}
        footer={
          <>
            <button
              className="btn btn-outline"
              onClick={() => setPersonnelModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handlePersonnelSubmit}
              disabled={isSubmitting} // Disable the button when submitting
            >
              {isSubmitting
                ? "Submitting..."
                : currentPersonnel
                ? "Update"
                : "Add"}{" "}
            </button>
          </>
        }
      >
        <form onSubmit={handlePersonnelSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={personnelForm.name}
                onChange={handlePersonnelInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Position</label>
              <select
                name="position"
                className="form-input"
                value={personnelForm.position}
                onChange={handlePersonnelInputChange}
                required
              >
                <option value="">Select Position</option>
                <option value="Security Manager">Security Manager</option>
                <option value="Security Supervisor">Security Supervisor</option>
                <option value="Security Officer">Security Officer</option>
                <option value="CCTV Operator">CCTV Operator</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Shift</label>
              <select
                name="shift"
                className="form-input"
                value={personnelForm.shift}
                onChange={handlePersonnelInputChange}
                required
              >
                <option value="">Select Shift</option>
                <option value="Morning">Morning (6AM - 2PM)</option>
                <option value="Evening">Evening (2PM - 10PM)</option>
                <option value="Night">Night (10PM - 6AM)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                value={personnelForm.phone}
                onChange={handlePersonnelInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={personnelForm.email}
                onChange={handlePersonnelInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Join Date</label>
              <input
                type="date"
                name="joinDate"
                className="form-input"
                value={personnelForm.joinDate}
                onChange={handlePersonnelInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                name="status"
                className="form-input"
                value={personnelForm.status}
                onChange={handlePersonnelInputChange}
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
        <p>
          Are you sure you want to delete{" "}
          {currentPersonnel && 'personnel "' + currentPersonnel.name + '"'}
        </p>
        <p className="text-secondary mt-4">This action cannot be undone.</p>
      </Modal>
    </div>
  );
}

export default Security

