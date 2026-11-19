import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";

const StudentTable = ({ students, onEdit, onDelete }) => {
  const getClassBadge = (classes) => {
    switch (classes) {
      case "PHP Class":
        return <span className="badge bg-primary">PHP Class</span>;

      case "Laravel Class":
        return <span className="badge bg-danger">Laravel Class</span>;

      case "React Class":
        return <span className="badge bg-info">React Class</span>;

      case "NodeJs Class":
        return <span className="badge bg-success">NodeJs Class</span>;

      default:
        return (
          <span className="badge bg-secondary">{classes || "No Class"}</span>
        );
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleDateString();
  };

  return (
    <div className="table-responsive">
      <table className="table table-sm table-hover align-middle">
        <thead>
          <tr>
            <th>Student</th>
            <th>Phone</th>
            <th>Classes</th>
            <th>Join Date</th>
            <th className="text-end">ACTIONS</th>
          </tr>
        </thead>

        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-4">
                <div className="text-muted">No students found</div>
              </td>
            </tr>
          ) : (
            students.map((student) => (
              <tr key={student.id}>
                <td>
                  <div className="d-flex align-items-center">
                    <div className="me-3 avatar">
                      {student.avatar || student.name?.charAt(0) || "?"}
                    </div>

                    <div>
                      <div className="fw-semibold">{student.name}</div>

                      <small className="text-muted">{student.email}</small>
                    </div>
                  </div>
                </td>

                <td>{student.phone || "N/A"}</td>

                <td>{getClassBadge(student.classes)}</td>

                <td>{formatDate(student.joinDate)}</td>

                <td className="text-end">
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm d-flex align-items-center"
                      onClick={() => onEdit(student)}
                      title="Edit Student"
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                    </button>

                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm d-flex align-items-center"
                      onClick={() => onDelete(student.id)}
                      title="Delete Student"
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
