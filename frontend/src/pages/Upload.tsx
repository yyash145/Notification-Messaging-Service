import { useState } from "react";
import axiosInstance from "../services/axiosInterface";
import "../index";

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const res = await axiosInstance.post("http://localhost:3000/upload", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const { success, failed, errors } = res.data;
      // ✅ CASE 1: All success
      if (failed === 0) {
        alert(`✅ All rows uploaded successfully`);
      }

      // ⚠️ CASE 2: Partial success
      else if (success > 0) {
        const errorPreview = errors
          .slice(0, 3)
          .map((e: any) => `Row ${e.row}: ${e.error}`)
          .join("\n");

        alert(
          `⚠️ Uploaded with issues\n\n` +
          `Success: ${success}\nFailed: ${failed}\n\n` +
          `Errors:\n${errorPreview}\n\n` +
          (errors.length > 3 ? `...and more` : "")
        );
      }

      // ❌ CASE 3: Full failure
      else {
        const errorPreview = errors
          .slice(0, 5)
          .map((e: any) => `Row ${e.row}: ${e.error}`)
          .join("\n");

        alert(
          `❌ Upload failed\n\n` +
          `Errors:\n${errorPreview}`
        );
      }
    } catch (err: any) {
      console.error("ERROR Message:", err.response?.data);
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
          onChange={(e) => {
            setFile(e.target.files![0]);
            e.target.value = "";
          }}
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