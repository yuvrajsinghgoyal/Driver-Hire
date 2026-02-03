// src/pages/RecruiterChat.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import { motion } from "framer-motion";
import { fadeIn } from "../animations/motionVariants";

export default function RecruiterChat() {
  const { jobId, driverId } = useParams();

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [job, setJob] = useState(null);
  const [driver, setDriver] = useState(null);

  // --------------------------------
  // Load job + driver info (UI only)
  // --------------------------------
  const loadData = async () => {
    try {
      const jobRes = await API.get(`/jobs/${jobId}`);
      setJob(jobRes.data);

      const driverRes = await API.get(`/users/${driverId}`);
      setDriver(driverRes.data);
    } catch (err) {
      console.log("Chat load error:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --------------------------------
  // TEMP: Send message (UI only)
  // --------------------------------
  const sendMessage = () => {
    if (!text.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        _id: Date.now(),
        sender: "me",
        text,
      },
    ]);

    setText("");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <motion.div
        variants={fadeIn(0)}
        initial="hidden"
        animate="show"
        className="bg-gray-100 border border-gray-300 rounded-3xl h-[75vh] flex flex-col"
      >
        {/* =====================
            HEADER
        ====================== */}
        <div className="border-b border-gray-300 px-5 py-3">
          <h2 className="text-lg font-semibold">
            {driver?.name || "Chat"}
          </h2>
          <p className="text-xs text-gray-600">
            {job?.title || "Job discussion"}
          </p>
        </div>

        {/* =====================
            MESSAGES
        ====================== */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {messages.length === 0 && (
            <p className="text-gray-600 text-sm text-center mt-10">
              No messages yet. Start the conversation 👋
            </p>
          )}

          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm
                ${
                  msg.sender === "me"
                    ? "bg-gray-600 text-white ml-auto"
                    : "bg-white text-gray-900"
                }
              `}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* =====================
            INPUT
        ====================== */}
        <div className="border-t border-gray-300 px-4 py-3 flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 bg-white border border-gray-300 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-600/50"
          />

          <button
            onClick={sendMessage}
            className="bg-gray-600 hover:bg-gray-500 px-5 rounded-full font-semibold text-sm text-white"
          >
            Send
          </button>
        </div>
      </motion.div>
    </div>
  );
}
