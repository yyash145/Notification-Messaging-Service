import React, { useState } from "react";
import axios from "axios";

const Upload = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    await axios.post("http://localhost:3000/upload", formData, {
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