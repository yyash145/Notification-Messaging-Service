import React, { useState } from "react";
import axiosInstance from "../services/axiosInterface";
const Upload = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    await axiosInstance.post("http://localhost:3000/upload", formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    alert("Uploaded successfully");
  };

  return (
    <div>
      <h2>Upload Excel</h2>
      <input type="file" onChange={(e) => setFile(e.target.files![0])} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default Upload;