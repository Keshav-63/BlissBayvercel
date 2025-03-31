"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye } from "react-feather";
import Table from "../components/ui/Table";
import Modal from "../components/ui/Modal";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";

const API_URL = "https://blissbay.onrender.com/api/events";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    organizer: "",
    contactInfo: "",
    category: "",
    status: "upcoming",
    expectedAttendees: "",
  });


  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      console.log("data", data);
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]:
        name === "expectedAttendees" ? Number.parseInt(value) || "" : value,
    });
  };

  const openAddModal = () => {
    setCurrentEvent(null);
    setFormData({
      title: "",
      description: "",
      location: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      organizer: "",
      contactInfo: "",
      category: "",

      status: "upcoming",
      expectedAttendees: "",
    });
    setModalOpen(true);
  };

  const openEditModal = (event) => {
    setCurrentEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      location: event.location,
      startDate: event.startDate,
      endDate: event.endDate,
      startTime: event.startTime,
      endTime: event.endTime,
      organizer: event.organizer,
      contactInfo: event.contactInfo,
      category: event.category,

      status: event.status,
      expectedAttendees: event.expectedAttendees,
    });
    setModalOpen(true);
  };

  const openViewModal = (event) => {
    setCurrentEvent(event);
    setViewModalOpen(true);
  };

  const openDeleteModal = (event) => {
    setCurrentEvent(event);
    setDeleteModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  if (!formData.title || !formData.description ||!formData.category || !formData.location || !formData.status || !formData.startDate || !formData.endDate || !formData.startTime || !formData.endTime || !formData.organizer || !formData.contactInfo) {
    alert("Please fill all required fields.");
    return;
  }
    try {
      let response;
      if (currentEvent) {
        // Update existing event
        response = await fetch(
          `${API_URL}/update/${currentEvent._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );
      } else {
        // Add new event
        response = await fetch(`${API_URL}/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
      }

      if (!response.ok) {
        throw new Error("Failed to save event");
      }

   fetchEvents();
      setModalOpen(false);
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

const handleDelete = async () => {
  try {
    const response = await fetch(
      `${API_URL}/delete/${currentEvent._id}`,
      { method: "DELETE" }
    );

    if (!response.ok) throw new Error("Failed to delete event");

 fetchEvents();
    setDeleteModalOpen(false);
  } catch (error) {
    console.error("Error deleting event:", error);
  }
};

  // Convert events to calendar format
const calendarEvents = events.map((event) => {
  // Extract only the date part (YYYY-MM-DD) from startDate and endDate
  const startDate = event.startDate.split("T")[0];
  const endDate = event.endDate.split("T")[0];

  return {
    id: event._id,
    title: event.title || "Untitled Event",
    start: new Date(`${startDate}T${event.startTime}:00`), // Combine date and time
    end: new Date(`${endDate}T${event.endTime}:00`), // Combine date and time
  };
});
  console.log("calendarEvents", calendarEvents);
  const localizer = momentLocalizer(moment);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Calendar */}
      {/* <div style={{ height: "500px", marginBottom: "20px" }}>
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectEvent={(event) => openViewModal(event)}
          tooltipAccessor={(event) =>
            `${event.title}\n${new Date(event.start).toLocaleDateString(
              "en-IN"
            )} - ${new Date(event.end).toLocaleDateString("en-IN")}`
          }
        />
      </div> */}
      <div style={{ height: "500px", marginBottom: "20px" }}>
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectEvent={(  ) => openViewModal()}
        />
      </div>

      {/* Table */}
      <Table
        columns={[
          { header: "Title", accessor: "title" },
          { header: "Location", accessor: "location" },
          {
            header: "Date",
            render: (row) => {
              const startDate = new Date(row.startDate).toLocaleDateString(
                "en-IN"
              );
              const endDate = new Date(row.endDate).toLocaleDateString("en-IN");

              if (row.startDate === row.endDate) {
                return startDate;
              }
              return `${startDate} to ${endDate}`;
            },
          },
          { header: "Category", accessor: "category" },
          {
            header: "Status",
            accessor: "status",
            render: (row) => {
              let badgeClass = "badge-info";
              if (row.status === "completed") badgeClass = "badge-success";
              if (row.status === "cancelled") badgeClass = "badge-danger";

              return (
                <span className={`badge ${badgeClass}`}>
                  {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
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
                <button
                  className="btn btn-outline"
                  onClick={() => openDeleteModal(row)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ),
          },
        ]}
        data={events}
        actions={
          <button className="btn btn-primary" onClick={openAddModal}>
            <Plus size={16} />
            <span>Add Event</span>
          </button>
        }
        searchable={true}
        searchPlaceholder="Search events..."
      />

      {/* Add/Edit Event Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={currentEvent ? "Edit Event" : "Add New Event"}
        footer={
          <>
            <button
              className="btn btn-outline"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              {currentEvent ? "Update" : "Add"} Event
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Event Title</label>
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
              <label className="form-label">Start Date</label>
              <input
                type="date"
                name="startDate"
                className="form-input"
                value={formData.startDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">End Date</label>
              <input
                type="date"
                name="endDate"
                className="form-input"
                value={formData.endDate}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Start Time</label>
              <input
                type="time"
                name="startTime"
                className="form-input"
                value={formData.startTime}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">End Time</label>
              <input
                type="time"
                name="endTime"
                className="form-input"
                value={formData.endTime}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Organizer</label>
              <input
                type="text"
                name="organizer"
                className="form-input"
                value={formData.organizer}
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
                <option value="Fashion">Fashion</option>
                <option value="Seasonal">Seasonal</option>
                <option value="Food & Beverage">Food & Beverage</option>
                <option value="Technology">Technology</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Charity">Charity</option>
                <option value="Other">Other</option>
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
                <option value="upcoming">Upcoming</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Expected Attendees</label>
              <input
                type="number"
                name="expectedAttendees"
                className="form-input"
                value={formData.expectedAttendees}
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

      {/* View Event Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Event Details"
        footer={
          <button
            className="btn btn-outline"
            onClick={() => setViewModalOpen(false)}
          >
            Close
          </button>
        }
      >
        {currentEvent && (
          <div>
            <div className="grid grid-2 mb-4">
              <div>
                <h4 className="text-sm text-secondary">Event Title</h4>
                <p>{currentEvent.title}</p>
              </div>

              <div>
                <h4 className="text-sm text-secondary">Location</h4>
                <p>{currentEvent.location}</p>
              </div>

              <div>
                <h4 className="text-sm text-secondary">Date</h4>
                <p>
                  {currentEvent.startDate === currentEvent.endDate
                    ? new Date(currentEvent.startDate).toLocaleDateString(
                        "en-IN"
                      )
                    : `${new Date(currentEvent.startDate).toLocaleDateString(
                        "en-IN"
                      )} to ${new Date(currentEvent.endDate).toLocaleDateString(
                        "en-IN"
                      )}`}
                </p>
              </div>

              <div>
                <h4 className="text-sm text-secondary">Time</h4>
                <p>
                  {currentEvent.startTime} - {currentEvent.endTime}
                </p>
              </div>

              <div>
                <h4 className="text-sm text-secondary">Organizer</h4>
                <p>{currentEvent.organizer}</p>
              </div>

              <div>
                <h4 className="text-sm text-secondary">Contact Info</h4>
                <p>{currentEvent.contactInfo}</p>
              </div>

              <div>
                <h4 className="text-sm text-secondary">Category</h4>
                <p>{currentEvent.category}</p>
              </div>

              <div>
                <h4 className="text-sm text-secondary">Status</h4>
                <p>
                  <span
                    className={`badge ${
                      currentEvent.status === "completed"
                        ? "badge-success"
                        : currentEvent.status === "cancelled"
                        ? "badge-danger"
                        : "badge-info"
                    }`}
                  >
                    {currentEvent.status.charAt(0).toUpperCase() +
                      currentEvent.status.slice(1)}
                  </span>
                </p>
              </div>

              <div>
                <h4 className="text-sm text-secondary">Expected Attendees</h4>
                <p>{currentEvent.expectedAttendees}</p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm text-secondary">Description</h4>
              <p>{currentEvent.description}</p>
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
        <p>
          Are you sure you want to delete the event "{currentEvent?.title}"?
        </p>
        <p className="text-secondary mt-4">This action cannot be undone.</p>
      </Modal>
    </div>
  );
};

export default Events;
