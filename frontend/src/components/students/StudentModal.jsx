import React, { useState, useEffect } from "react";

const API_BASE = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api"
).replace(/\/+$/, "");

const CLASS_API_URL = `${API_BASE}/studentclass`;

const initialFormData = {
  name: "",
  email: "",
  phone: "",
  student_class_id: "",
};

// Read API response
const getResponseData = async (response) => {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    throw new Error("Invalid API response");
  }
};

// Extract class array
const extractArray = (result) => {
  if (Array.isArray(result)) return result;

  if (Array.isArray(result?.data)) return result.data;

  if (Array.isArray(result?.data?.data)) {
    return result.data.data;
  }

  if (Array.isArray(result?.student_classes)) {
    return result.student_classes;
  }

  return [];
};

// Check whether value is a valid numeric ID
const isValidId = (value) => {
  return (
    value !== null &&
    value !== undefined &&
    String(value).trim() !== "" &&
    Number.isSafeInteger(Number(value)) &&
    Number(value) > 0
  );
};

// Get numeric class ID
const getClassId = (item) => {
  const candidates = [
    item?.class_id,
    item?.student_class_id,
    item?.id,
    item?.class?.id,
    item?.studentClass?.id,
  ];

  const id = candidates.find(isValidId);

  return id ? String(id) : "";
};

// Get class name
const getClassName = (item) => {
  return String(
    item?.class_name ??
      item?.student_class_name ??
      item?.name ??
      item?.class?.name ??
      item?.studentClass?.name ??
      "",
  ).trim();
};

// Normalize class data
const normalizeClasses = (data) => {
  return data
    .map((item) => ({
      id: getClassId(item),
      name: getClassName(item),
    }))
    .filter((item) => item.id !== "" && item.name !== "");
};

const StudentModal = ({ show, onHide, student, onSave, saving = false }) => {
  const [formData, setFormData] = useState(initialFormData);
  const [classes, setClasses] = useState([]);
  const [classLoading, setClassLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Fetch Classes
  useEffect(() => {
    if (!show) return;

    const controller = new AbortController();

    const fetchClasses = async () => {
      try {
        setClassLoading(true);
        setErrors({});

        const response = await fetch(CLASS_API_URL, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          signal: controller.signal,
        });

        const result = await getResponseData(response);

        if (!response.ok) {
          throw new Error(result.message || "Unable to fetch classes");
        }

        const classData = extractArray(result);
        const normalizedClasses = normalizeClasses(classData);

        console.log("Class API Response:", result);
        console.log("Original Class Data:", classData);
        console.log("Normalized Classes:", normalizedClasses);

        setClasses(normalizedClasses);

        if (normalizedClasses.length === 0) {
          setErrors((previous) => ({
            ...previous,
            student_class_id:
              "No valid classes found. Check your Class API response.",
          }));
        }
      } catch (error) {
        if (error.name === "AbortError") return;

        console.error("Fetch Classes Error:", error);

        setClasses([]);

        setErrors((previous) => ({
          ...previous,
          student_class_id: error.message,
        }));
      } finally {
        if (!controller.signal.aborted) {
          setClassLoading(false);
        }
      }
    };

    fetchClasses();

    return () => controller.abort();
  }, [show]);

  // Set Form Data
  useEffect(() => {
    if (!show) return;

    if (student) {
      const classValue =
        student.student_class_id ??
        student.student_class?.id ??
        student.student_class?.name ??
        student.studentClass?.id ??
        student.studentClass?.name ??
        student.class_id ??
        "";

      setFormData({
        name: student.name || "",
        email: student.email || "",
        phone: student.phone || "",
        student_class_id: String(classValue),
      });
    } else {
      setFormData({ ...initialFormData });
    }

    setErrors({});
  }, [student, show]);

  // Resolve existing class ID when editing
  useEffect(() => {
    if (!show || !student || classes.length === 0) return;

    const currentValue = String(formData.student_class_id).trim();

    if (!currentValue) return;

    // Already a valid class ID
    const matchedById = classes.find((item) => item.id === currentValue);

    if (matchedById) return;

    // If the existing value is a class name, find its ID
    const matchedByName = classes.find(
      (item) => item.name.toLowerCase() === currentValue.toLowerCase(),
    );

    if (matchedByName) {
      setFormData((previous) => ({
        ...previous,
        student_class_id: matchedByName.id,
      }));
    }
  }, [classes, student, show, formData.student_class_id]);

  // Change Handler
  const changeHandler = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
      general: "",
    }));
  };

  // Validate Form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Email is invalid";
    }

    const classId = Number(formData.student_class_id);

    const selectedClass = classes.find((item) => Number(item.id) === classId);

    if (
      !formData.student_class_id ||
      !isValidId(formData.student_class_id) ||
      !selectedClass
    ) {
      newErrors.student_class_id = "Please select a valid class";
    }

    setErrors(newErrors);

    console.log("Form Data:", formData);
    console.log("Class List:", classes);
    console.log("Selected Class:", selectedClass);

    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const submitHandler = async (e) => {
    e.preventDefault();

    if (saving || classLoading) return;

    if (!validateForm()) return;

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || null,
      student_class_id: Number(formData.student_class_id),
    };

    console.log("Student Payload:", payload);

    try {
      await onSave(payload);
    } catch (error) {
      console.error("Submit Student Error:", error);

      if (error.errors) {
        const backendErrors = {};

        Object.keys(error.errors).forEach((key) => {
          backendErrors[key] = Array.isArray(error.errors[key])
            ? error.errors[key][0]
            : error.errors[key];
        });

        setErrors(backendErrors);
      } else {
        setErrors((previous) => ({
          ...previous,
          general: error.message || "Unable to save student",
        }));
      }
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content modal-custom">
          {/* Header */}
          <div className="modal-header">
            <h6 className="modal-title">
              {student ? "Edit Student" : "Create New Student"}
            </h6>

            <button
              type="button"
              className="btn-close"
              onClick={onHide}
              disabled={saving}
            />
          </div>

          {/* Body */}
          <div className="modal-body">
            <form onSubmit={submitHandler}>
              <div className="row g-3">
                {/* General Error */}
                {errors.general && (
                  <div className="col-12">
                    <div className="alert alert-danger">{errors.general}</div>
                  </div>
                )}

                {/* Name */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="name" className="form-label">
                    Full Name <span className="text-danger">*</span>
                  </label>

                  <input
                    type="text"
                    name="name"
                    id="name"
                    className={`form-control ${
                      errors.name ? "is-invalid" : ""
                    }`}
                    value={formData.name}
                    onChange={changeHandler}
                    placeholder="Enter full name"
                    disabled={saving}
                  />

                  {errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </div>

                {/* Email */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="email" className="form-label">
                    Email Address <span className="text-danger">*</span>
                  </label>

                  <input
                    type="email"
                    name="email"
                    id="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    value={formData.email}
                    onChange={changeHandler}
                    placeholder="Enter email address"
                    disabled={saving}
                  />

                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>

                {/* Class */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="student_class_id" className="form-label">
                    Classes <span className="text-danger">*</span>
                  </label>

                  <select
                    name="student_class_id"
                    id="student_class_id"
                    className={`form-select ${
                      errors.student_class_id ? "is-invalid" : ""
                    }`}
                    value={formData.student_class_id}
                    onChange={changeHandler}
                    disabled={saving || classLoading || classes.length === 0}
                  >
                    <option value="">
                      {classLoading ? "Loading classes..." : "Select Class"}
                    </option>

                    {classes.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>

                  {errors.student_class_id && (
                    <div className="invalid-feedback">
                      {errors.student_class_id}
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div className="col-md-6 mb-3">
                  <label htmlFor="phone" className="form-label">
                    Phone Number
                  </label>

                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={changeHandler}
                    placeholder="Enter phone number"
                    disabled={saving}
                  />
                </div>

               
              </div>

              {/* Footer */}
              <div className="modal-footer px-0 pb-0">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onHide}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving || classLoading || classes.length === 0}
                >
                  {saving
                    ? "Saving..."
                    : student
                      ? "Update Student"
                      : "Create Student"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentModal;
