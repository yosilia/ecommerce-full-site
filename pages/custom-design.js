import Header from "@/ComponentsUser/Header";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import Button, { ButtonStyle } from "@/ComponentsUser/Button";
import styled from "styled-components";
import MeasurementsSection from "@/ComponentsUser/MeasurementsSection";

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  font-family: "Lora", serif;
`;

const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 40px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  font-family: "Lora", serif;
`;

export default function CustomDesignPage() {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    phone: "",
    appointmentDate: "",
    appointmentTime: "",
    measurements: {},
    notes: "",
    image: null,
  });

  const getAvailableTimeSlots = (date) => {
    if (!date) return [];

    const dayOfWeek = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
    });

    const timeSlots = {
      Monday: ["5:00 PM - 6:00 PM", "6:00 PM - 7:00 PM"],
      Tuesday: ["12:00 PM - 1:00 PM", "5:00 PM - 6:00 PM"],
      Wednesday: ["12:00 PM - 1:00 PM", "5:00 PM - 6:00 PM"],
      Thursday: ["12:00 PM - 1:00 PM", "5:00 PM - 6:00 PM"],
      Friday: ["12:00 PM - 1:00 PM", "5:00 PM - 6:00 PM"],
      Saturday: ["12:00 PM - 1:00 PM", "1:00 PM - 2:00 PM"],
      Sunday: [], // No appointments on Sundays
    };
    return timeSlots[dayOfWeek] || [];
  };

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        clientName: user.name || prev.clientName,
        clientEmail: user.email || prev.clientEmail,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  useEffect(() => {
    async function fetchLatestRequest() {
      try {
        // Note: using ?email= since your API GET handler uses email as the query param
        const res = await fetch(`/api/design-requests?email=${user.email}`);
        const data = await res.json();
        if (Array.isArray(data.data) && data.data.length > 0) {
          // Sort requests by createdAt descending to get the latest one
          const latestRequest = data.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          )[0];
          setFormData((prev) => ({
            ...prev,
            measurements: {
              ...prev.measurements,
              ...latestRequest.measurements,
            },
          }));
        }
      } catch (error) {
        console.error("Error fetching latest design request:", error);
      }
    }

    if (user && user.email) {
      fetchLatestRequest();
    }
  }, [user]);

  const [bookedAppointments, setBookedAppointments] = useState([]);

  // Fetch booked appointments when a date is selected
  useEffect(() => {
    if (formData.appointmentDate) {
      fetchBookedAppointments(formData.appointmentDate);
    }
  }, [formData.appointmentDate]);

  const fetchBookedAppointments = async (date) => {
    try {
      const response = await fetch(`/api/design-requests?date=${date}`);
      const data = await response.json();
      setBookedAppointments(
        Array.isArray(data?.data) ? data.data.map((a) => a.appointmentTime) : []
      );
      // Extract booked times
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  async function handleImageUpload(e) {
    const files = Array.from(e.target.files); // Convert FileList to array
    if (!files.length) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData, // Sends multiple images
      });

      const data = await res.json();
      if (data.links) {
        setFormData((prev) => ({
          ...prev,
          images: [...(prev.images || []), ...data.links], // Store all images in an array
        }));
      } else {
        alert("Image upload failed.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload images.");
    }
  }

  function removeImage(index) {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }

  // submitting request

  async function submitRequest(e) {
    e.preventDefault();

    // Ensure appointment date and time are selected
    if (!formData.appointmentDate || !formData.appointmentTime) {
      alert("Please select an appointment date and time.");
      return;
    }

    try {
      const res = await fetch("/api/design-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Design request submitted successfully!");
        setFormData({ ...formData, appointmentDate: "", appointmentTime: "" });
        fetchBookedAppointments(formData.appointmentDate); // Refresh booked slots
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error submitting request:", error);
    }
  }

  return (
    <Header>
      <form
        onSubmit={submitRequest}
        className="p-6 bg-white rounded-lg shadow-md max-w-lg mx-auto"
      >
        <h1 className="text-2xl font-semibold mb-4">
          Submit a Custom Design Request
        </h1>
        <Box className="p-4 border rounded bg-gray-100">
          <Input
            type="text"
            placeholder="Your Name"
            value={formData.clientName}
            onChange={(e) =>
              setFormData({ ...formData, clientName: e.target.value })
            }
            className="w-full p-2 mb-3 border rounded"
          />
          <Input
            type="email"
            placeholder="Your Email"
            value={formData.clientEmail}
            onChange={(e) =>
              setFormData({ ...formData, clientEmail: e.target.value })
            }
            className="w-full p-2 mb-3 border rounded"
          />
          <Input
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="w-full p-2 mb-3 border rounded"
          />
          <div>
            <p>Enter a date to schedule an appointment for a consultation</p>
            <Input
              type="date"
              value={formData.appointmentDate}
              onChange={(e) =>
                setFormData({ ...formData, appointmentDate: e.target.value })
              }
              className="w-full p-2 mb-3 border rounded"
            />

            {formData.appointmentDate && (
              <>
                <p>Select an available time:</p>

                {/* Check if the selected day is Sunday == 0 */}
                {new Date(formData.appointmentDate).getDay() === 0 ? (
                  <p className="text-red-500">
                    This day is unavailable for booking.
                  </p>
                ) : bookedAppointments.length >= 5 ? (
                  <p className="text-red-500">
                    This day is fully booked. Choose another date.
                  </p>
                ) : (
                  <Select
                    className="w-full p-2 mb-3 border rounded"
                    value={formData.appointmentTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        appointmentTime: e.target.value,
                      })
                    }
                  >
                    <option value="">Select a time</option>
                    {getAvailableTimeSlots(formData.appointmentDate).map(
                      (time) =>
                        bookedAppointments.includes(time) ? (
                          <option key={time} value={time} disabled>
                            {time} (Fully Booked)
                          </option>
                        ) : (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        )
                    )}
                  </Select>
                )}
              </>
            )}
          </div>
          <p>Enter in any additional notes you'd like to add</p>
          <Input
            placeholder="Additional Notes"
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            className="w-full p-2 mb-3 border rounded"
          ></Input>

          {/* Image Upload */}
          <div className="mb-3">
            <label className="block font-semibold mb-2">
              Upload Inspiration Image:
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* Uploaded Images - Horizontal Scroll */}
          {formData.images && formData.images.length > 0 && (
            <div className="mb-3 overflow-x-auto whitespace-nowrap flex gap-2 p-2 border rounded">
              {formData.images.map((img, index) => (
                <div key={index} className="relative flex-shrink-0">
                  <img
                    src={img}
                    alt={`Uploaded ${index}`}
                    className="rounded-lg shadow border object-cover"
                    style={{ width: "150px", height: "150px" }} // Adjust size
                  />
                  {/* Remove Button */}
                  <Button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                  >
                    ✕
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Measurements */}
          <MeasurementsSection
            measurements={formData.measurements}
            setMeasurements={(newMeasurements) =>
              setFormData((prev) => {
                // If newMeasurements is a function updater, call it with the current measurements
                const updatedMeasurements =
                  typeof newMeasurements === "function"
                    ? newMeasurements(prev.measurements)
                    : newMeasurements;
                return {
                  ...prev,
                  measurements: {
                    ...prev.measurements,
                    ...updatedMeasurements,
                  },
                };
              })
            }
          />
        </Box>
        <div style={{ display: "flex", margin: "20px" }}>
          <Button
            type="submit"
            className="bg-gray-800 text-white px-4 py-2 rounded w-full mt-4"
          >
            Submit Request
          </Button>
        </div>
      </form>
    </Header>
  );
}
