import { useRef, useState } from "react";
import api from "../utils/api";

const ResumeSection = ({ application, onUploadSuccess }) => {
  const [uploadError, setUploadError] = useState("");

  const fileInputRef = useRef(null);

  const handleUpload = async (file) => {
    try {
      const formdata = new FormData();
      formdata.append("file", file);
      console.log(formdata);

      const response = await api.post(
        `/applications/${application.id}/resume`,
        formdata,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      console.log(response.data);
      onUploadSuccess(response.data.resume_url);
    } catch (err) {
      setUploadError("Resume Upload Failed");
      console.log(err);
    }
  };

  const handleView =async()=>{
    try{
      const response = await api.get(`/applications/${application.id}/resume`)
      window.open(response.data.signed_url, "_blank")
    }catch(err){
      console.log(err)
    }
  }

  return (
    <div>
      {application.resume_url ? (
        <div className="flex flex-col gap-1">
          <span onClick={handleView} className="text-blue-600 hover:underline cursor-pointer">
            {application.resume_url}
          </span>
          <button
            className="px-3 py-1 rounded-md bg-gray-600 text-white text-xs font-semibold hover:bg-gray-700"
            onClick={() => fileInputRef.current.click()}
          >
            Replace Resume
          </button>
        </div>
      ) : (
        <>
          <button
            className="px-3 py-1 rounded-md bg-gray-600 text-white text-xs font-semibold hover:bg-gray-700"
            onClick={() => fileInputRef.current.click()}
          >
            Upload Resume
          </button>
        </>
      )}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            handleUpload(file);
          }
          console.log(file);
        }}
      />
    </div>
  );
};

export default ResumeSection;
