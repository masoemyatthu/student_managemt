import React, { useEffect, useState, useCallback } from "react";

import StudentTable from "../components/students/StudentTable";
import StudentModal from "../components/students/StudentModal";

import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

// API URL
const API_BASE = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api"
).replace(/\/+$/, "");

const API_URL = `${API_BASE}/students`;

// Read API Response
const getResponseData = async (response) => {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {
      message: text || "Invalid server response",
    };
  }
};

// Extract Laravel response data
const extractArray = (result) => {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result?.data?.data)) return result.data.data;

  return [];
};

const Students = () => {
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // GET Students
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const result = await getResponseData(response);

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch students");
      }

      const studentData = extractArray(result);

      const formattedStudents = studentData.map((student) => {
        const studentName = student.name || "";

        const studentClass =
          student.student_class || student.studentClass || {};

        return {
          ...student,
          id: student.id,
          name: studentName,
          email: student.email || "",

          student_class_id: student.student_class_id ?? studentClass.id ?? "",

          classes: studentClass.name || student.class_name || "No Class",

          phone: student.phone || "",
          joinDate: student.created_at || "",

          avatar: studentName
            .split(" ")
            .filter(Boolean)
            .map((word) => word[0])
            .join("")
            .toUpperCase(),
        };
      });

      setStudents(formattedStudents);

      console.log("Students loaded:", formattedStudents);
    } catch (error) {
      console.error("Fetch Students Error:", error);
      toast.error(error.message || "Unable to fetch students");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load Students
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Search Students
  const filteredStudents = students.filter((student) => {
    const search = searchTerm.trim().toLowerCase();

    return (
      (student.name || "").toLowerCase().includes(search) ||
      (student.email || "").toLowerCase().includes(search) ||
      (student.classes || "").toLowerCase().includes(search)
    );
  });

  // POST / PUT Student
  const saveStudentHandler = async (studentData) => {
    if (saving) return;

    try {
      setSaving(true);

      const isEditing = Boolean(editingStudent);

      const url = isEditing ? `${API_URL}/${editingStudent.id}` : API_URL;

      // Debug received data
      console.log("Received Student Data:", studentData);

      const rawClassId = studentData?.student_class_id;

      console.log("Received Class ID:", rawClassId);

      // Validate class ID
      if (
        rawClassId === "" ||
        rawClassId === null ||
        rawClassId === undefined ||
        !Number.isFinite(Number(rawClassId)) ||
        !Number.isInteger(Number(rawClassId)) ||
        Number(rawClassId) <= 0
      ) {
        console.error("Invalid Class ID:", rawClassId);
        toast.error("Please select a valid class");
        return;
      }

      const classId = Number(rawClassId);

      // Prepare payload
      const payload = {
        student_class_id: classId,
        name: studentData.name?.trim() || "",
        email: studentData.email?.trim() || "",
        phone: studentData.phone?.trim() || null,
      };

      // Basic validation
      if (!payload.name || !payload.email) {
        toast.error("Please fill in all required fields");
        return;
      }

      console.log("Student API URL:", url);
      console.log("Student Payload:", payload);

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await getResponseData(response);

      console.log("Save Student Response:", result);

      if (!response.ok) {
        if (response.status === 422) {
          const validationErrors = Object.values(result.errors || {}).flat();

          if (validationErrors.length > 0) {
            validationErrors.forEach((error) => {
              toast.error(error);
            });
          } else {
            toast.error(result.message || "Validation failed");
          }

          return;
        }

        throw new Error(result.message || `Request failed: ${response.status}`);
      }

      toast.success(
        isEditing
          ? "Student updated successfully!"
          : "Student created successfully!",
      );

      setShowModal(false);
      setEditingStudent(null);

      await fetchStudents();
    } catch (error) {
      console.error("Save Student Error:", error);
      toast.error(error.message || "Unable to save student");
    } finally {
      setSaving(false);
    }
  };

  // Add Student
  const addStudent = () => {
    setEditingStudent(null);
    setShowModal(true);
  };

  // Edit Student
  const editMode = (student) => {
    setEditingStudent(student);
    setShowModal(true);
  };

  // Close Modal
  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingStudent(null);
  };

  // Delete Student
  const deleteHandler = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?",
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      });

      const result = await getResponseData(response);

      console.log("Delete Student Response:", result);

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete student");
      }

      toast.success("Student deleted successfully!");

      setStudents((previous) =>
        previous.filter((student) => String(student.id) !== String(id)),
      );
    } catch (error) {
      console.error("Delete Student Error:", error);
      toast.error(error.message || "Unable to delete student");
    }
  };

  // Render
  return (
    <div>
      {/* Student Management */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h6 className="mb-1">Student Management</h6>
          <p className="text-muted mb-0">Manage your students</p>
        </div>

        <button
          type="button"
          className="btn btn-primary d-flex align-items-center"
          onClick={addStudent}
          disabled={saving}
        >
          <span className="me-2">+</span>
          Add New Student
        </button>
      </div>

      {/* Search */}
      <div className="card mb-3 dashboard-card">
        <div className="card-body">
          <div className="row g-3 align-items-center">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text bg-light border-0">
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </span>

                <input
                  type="text"
                  className="form-control bg-light border-0"
                  placeholder="Search students by name, email, or class..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="card dashboard-card">
        <div className="card-body">
          {loading ? (
            <p className="text-center py-4">Loading students...</p>
          ) : (
            <StudentTable
              students={filteredStudents}
              onEdit={editMode}
              onDelete={deleteHandler}
            />
          )}
        </div>
      </div>

      {/* Student Modal */}
      <StudentModal
        student={editingStudent}
        show={showModal}
        onHide={closeModal}
        onSave={saveStudentHandler}
        saving={saving}
      />
    </div>
  );
};

export default Students;
