import { useState } from "react";
import axiosInstance from "../services/axiosInterface";
import "../index";

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (selectedFile: File) => {
    const allowedTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Only Excel or CSV files are allowed");
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      await axiosInstance.post("http://localhost:3000/upload", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("Uploaded successfully ✅");
    } catch (err: any) {
      console.log("ERROR Message:", err.response?.data);
      alert(err.response?.data?.message || "Upload failed ❌");
    } finally {
      setFile(null);
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>📂 Upload Excel / CSV</h2>

      {/* Drag & Drop Area */}
      <label className="upload-box">
        <input
          type="file"
          onChange={(e) => handleFileChange(e.target.files![0])}
          hidden
        />

        <div>
          <p>Drag & Drop file here</p>
          <span>or click to browse</span>
        </div>
      </label>

      {/* File Preview */}
      {file && (
        <div className="file-info">
          📄 {file.name}
        </div>
      )}

      {/* Upload Button */}
      <button
        className="upload-btn"
        onClick={handleUpload}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default Upload;