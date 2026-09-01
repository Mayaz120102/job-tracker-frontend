import { useEffect, useState } from "react";
import api from "../utils/api";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    api
      .get("/applications")
      .then((res) => setApplications(res.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/applications/${id}`);
      setApplications((prev) => prev.filter((app) => app.id !== id));
    } catch (err) {
      console.log(err, "error from handledelete-dashboardpage");
      setDeleteError("Failed to delete Application");
    }
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "applied":
        return "bg-blue-100 text-blue-700";
      case "interview":
        return "bg-yellow-100 text-yellow-700";
      case "offer":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div>
        <p>loading...........</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p>something went wrong</p>
      </div>
    );
  }

  return (
    <div className="px-25 py-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <Link
          to="/applications/new"
          className="px-4 py-2 rounded-md bg-green-600 text-white text-sm font-semibold hover:bg-green-700"
        >
          + Add Application
        </Link>
      </div>
      {deleteError && (
        <p className="text-red-600 text-sm mb-2">{deleteError}</p>
      )}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mt-3">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                Job
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                Applied Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                Job Url
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {applications.map((application) => (
              <tr key={application.id} className="hover:bg-gray-200">
                <td className="px-6 py-4">{application?.company_name}</td>
                <td className="px-6 py-4">{application?.job_title}</td>
                <td className="hover:bg-gray-50 px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium  ${getStatusClasses(application?.status)}`}
                  >
                    {application?.status}
                  </span>
                </td>
                <td className="px-6 py-4">{application?.applied_date}</td>
                <td className="px-6 py-4">
                  <a
                    href={application.job_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </a>
                </td>

                <td className="flex gap-3 text-sm px-6 py-4">
                  <Link
                    to={`/applications/${application.id}`}
                    className="text-blue-700"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(application.id)}
                    className="text-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
