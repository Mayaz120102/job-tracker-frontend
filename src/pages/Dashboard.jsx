import { useEffect, useState } from "react";
import api from "../utils/api";
import { Link } from "react-router-dom";
import ResumeSection from "../components/ResumeSection";

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const pageSize = 5;

  useEffect(() => {
    setLoading(true);
    setError("");

    api
      .get("/applications", {
        params: {
          search: search || undefined,
          status: statusFilter || undefined,
          skip: (page - 1) * pageSize,
          limit: pageSize,
        },
      })
      .then((res) => setApplications(res.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [search, statusFilter, page]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/applications/${id}`);

      setApplications((prev) => prev.filter((app) => app.id !== id));
      setDeleteError("");
    } catch (err) {
      console.log(err, "error from handledelete-dashboardpage");
      setDeleteError("Failed to delete Application");
    }
  };

  const next = () => {
    setPage((prev) => prev + 1);
  };

  const prev = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
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
      <div className="min-h-[50vh] flex items-center justify-center px-4">
        <p className="text-sm sm:text-base text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center px-4">
        <p className="text-sm sm:text-base text-red-600 text-center">
          Something went wrong
        </p>
      </div>
    );
  }

  return (
    <div className="w-full px-3 sm:px-5 md:px-8 lg:px-10 xl:px-16 py-5 sm:py-8">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Dashboard
          </h1>

          <Link
            to="/applications/new"
            className="w-full sm:w-fit text-center px-5 py-2.5 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition"
          >
            + Add Application
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] lg:flex lg:justify-end gap-2">
          <input
            type="search"
            className="w-full sm:min-w-0 lg:w-72 border border-gray-300 rounded-lg px-3 py-2.5 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            placeholder="Search applications..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <select
            id="status"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-48 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">All Status</option>
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {deleteError && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
          <p className="text-sm text-red-600">{deleteError}</p>
        </div>
      )}

      {applications.length > 0 ? (
        <>
          <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                      Company
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                      Job
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                      Applied Date
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                      Job URL
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                      Actions
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wide">
                      Resume
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {applications.map((application) => (
                    <tr
                      key={application.id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-5 py-4 text-sm font-medium text-gray-800">
                        {application?.company_name || "-"}
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-700">
                        {application?.job_title || "-"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClasses(
                            application?.status,
                          )}`}
                        >
                          {application?.status || "Unknown"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm text-gray-700 whitespace-nowrap">
                        {application?.applied_date || "-"}
                      </td>

                      <td className="px-5 py-4">
                        {application?.job_url ? (
                          <a
                            href={application.job_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline text-sm font-medium"
                          >
                            View
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">N/A</span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3 text-sm whitespace-nowrap">
                          <Link
                            to={`/applications/${application.id}`}
                            className="text-blue-700 hover:text-blue-900 font-medium"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() => handleDelete(application.id)}
                            className="text-red-700 hover:text-red-900 font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="min-w-[150px]">
                          <ResumeSection
                            application={application}
                            onUploadSuccess={(newResumeUrl) => {
                              setApplications((prev) =>
                                prev.map((app) =>
                                  app.id === application.id
                                    ? {
                                        ...app,
                                        resume_url: newResumeUrl,
                                      }
                                    : app,
                                ),
                              );
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:hidden space-y-4">
            {applications.map((application) => (
              <div
                key={application.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-5"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="min-w-0">
                    <h2 className="font-semibold text-gray-900 text-base sm:text-lg truncate">
                      {application?.company_name || "-"}
                    </h2>

                    <p className="text-sm text-gray-500 mt-1 break-words">
                      {application?.job_title || "-"}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClasses(
                      application?.status,
                    )}`}
                  >
                    {application?.status || "Unknown"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Applied Date
                    </p>
                    <p className="text-sm text-gray-800 break-words">
                      {application?.applied_date || "-"}
                    </p>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-3">
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Job URL
                    </p>

                    {application?.job_url ? (
                      <a
                        href={application.job_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline font-medium"
                      >
                        View Job
                      </a>
                    ) : (
                      <p className="text-sm text-gray-400">N/A</p>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs font-medium text-gray-500 mb-2">
                    Resume
                  </p>

                  <div className="w-full overflow-hidden">
                    <ResumeSection
                      application={application}
                      onUploadSuccess={(newResumeUrl) => {
                        setApplications((prev) =>
                          prev.map((app) =>
                            app.id === application.id
                              ? {
                                  ...app,
                                  resume_url: newResumeUrl,
                                }
                              : app,
                          ),
                        );
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t border-gray-100 mt-4 pt-4">
                  <Link
                    to={`/applications/${application.id}`}
                    className="flex-1 text-center px-4 py-2.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium text-sm transition"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(application.id)}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 font-medium text-sm transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-4 py-12 text-center">
          <p className="text-sm text-gray-500">No applications found.</p>
        </div>
      )}

      <div className="px-1 sm:px-4 py-5 sm:py-6 flex items-center justify-center gap-3">
        <button
          onClick={prev}
          disabled={page === 1}
          className="px-3 sm:px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
        >
          ← Prev
        </button>

        <span className="text-sm text-gray-700 whitespace-nowrap">
          Page {page}
        </span>

        <button
          onClick={next}
          disabled={applications.length < pageSize}
          className="px-3 sm:px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
