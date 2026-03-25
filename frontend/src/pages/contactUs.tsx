import { useState } from "react";
import axiosInstance from "../services/axiosInterface";
import "./contact.css";

const Contact = () => {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSend = async () => {
    try {
      await axiosInstance.post("/contact/viaMail", {
        message,
      });

      setStatus("Message sent successfully ✅");
      setMessage("");
    } catch(error: any) {
      setStatus("Failed to send message ❌");
      console.error("Failed to send message", error.response?.data || error.message);
    }
  };

  return (
    <div className="contact-container">
      <h2>Contact Us</h2>

      {/* Contact Info */}
      <div className="contact-info">
        <p><strong>Email:</strong> yyash145@gmail.com</p>
        <p><strong>Phone:</strong> +91 9634311567</p>
      </div>

      {/* Message Box */}
      <textarea
        placeholder="Write your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button onClick={handleSend}>Send Message</button>

      {status && <p className="status">{status}</p>}
    </div>
  );
};

export default Contact;