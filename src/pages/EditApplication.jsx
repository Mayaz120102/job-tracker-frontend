import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";

const EditApplication = () => {
  const [compnayName, setCompanyName] = useState("");
  const [jobtitle, setJobtitle] = useState("");
  const [status, setStatus] = useState("applied");
  const [appliedDate, setAppliedDate] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/applications/${id}`)
      .then((res) => {
        setCompanyName(res.data.company_name);
        setJobtitle(res.data.job_title);
        setStatus(res.data.status);
        setAppliedDate(res.data.applied_date);
        setJobUrl(res.data.job_url);
        setNotes(res.data.notes);
      })
      .catch((e) => setError("failed to load application"));
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/applications/${id}`, {
        company_name: compnayName,
        job_title: jobtitle,
        status: status,
        applied_date: appliedDate,
        job_url: jobUrl,
        notes: notes,
      });
      navigate("/");
      console.log("updated application");
    } catch (err) {
      console.log("from  edit applicatoin page", err);
      setError("Failed to Update Application");
    }
  };

  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-gray-50 px-4 py-16">
      <div className="w-full max-w-md">
        <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-700 text-center mb-6">
          Update Your Application
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleUpdate}>
          <div>
            <label
              htmlFor="company_name"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Company Name
            </label>
            <input
              id="company_name"
              value={compnayName}
              onChange={(e) => setCompanyName(e.target.value)}
              type="text"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100"
            />
          </div>
          <div>
            <label
              htmlFor="job_title"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Job Title
            </label>
            <input
              id="job_title"
              value={jobtitle}
              onChange={(e) => setJobtitle(e.target.value)}
              type="text"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100"
            />
          </div>
          <div>
            <label
              htmlFor="status"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Status
            </label>

            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100"
            >
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="offer">Offer</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="applied_date"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Applied Date
            </label>
            <input
              id="applied_date"
              type="date"
              value={appliedDate}
              onChange={(e) => setAppliedDate(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100"
            />
          </div>
          <div>
            <label
              htmlFor="job_url"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Job Url
            </label>
            <input
              id="job_url"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              type="text"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100"
            />
          </div>
          <div>
            <label
              htmlFor="notes"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Notes
            </label>
            <input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              type="text"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-red-500 focus:bg-white focus:ring-2 focus:ring-red-100"
            />
          </div>

          <button className="mt-5 w-full rounded-xl bg-gray-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-gray-700 active:scale-[0.98]">
            Update Application
          </button>
        </form>
      </div>
    </main>
  );
};

export default EditApplication;
