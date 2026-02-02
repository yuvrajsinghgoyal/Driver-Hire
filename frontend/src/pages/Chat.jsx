// src/pages/Chat.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import { motion } from "framer-motion";
import { fadeIn } from "../animations/motionVariants";

export default function Chat() {
  const currentUser = JSON.parse(localStorage.getItem("dc_user"));

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [job, setJob] = useState(null);

  // ---------------- LOAD JOB ----------------
  const loadJob = async () => {
    try {
      const res = await API.get(`/jobs/${jobId}`);
      setJob(res.data);
    } catch (err) {
      console.log("Job load error:", err.message);
    }
  };

  // ---------------- LOAD CONVERSATION ----------------
  const { jobId, userId } = useParams();

const loadConversation = async () => {
  try {
    // guard: if params missing, bail
    if (!jobId || !userId) {
      console.error("Missing jobId or userId in URL params", { jobId, userId });
      return;
    }

    const res = await API.get(`/messages/${jobId}/${userId}`);
    setMessages(res.data);
  } catch (err) {
    console.log("Conversation load error");
  }
};

useEffect(() => {
  // ensure axios has auth header if token exists
  const token = localStorage.getItem("dc_token");
  if (token) API.defaults.headers.common.Authorization = `Bearer ${token}`;

  loadJob();
  loadConversation();
}, []);


  // ---------------- SEND MESSAGE ----------------
 const sendMessage = async () => {
  if (!text.trim()) return;

  if (!jobId || !userId) {
    alert('Cannot send message: missing job or user id');
    return;
  }

  try {
    await API.post("/messages", {
      receiverId: userId,
      jobId,
      text,
    });

    setText("");
    loadConversation();
  } catch (err) {
    console.error("Send message error:", err.response?.data || err.message);
    alert(err.response?.data?.message || "Failed to send message");
  }
};


  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <motion.div
        variants={fadeIn(0)}
        initial="hidden"
        animate="show"
        className="bg-slate-900 border border-slate-700 rounded-3xl h-[75vh] flex flex-col"
      >
        {/* HEADER */}
        <div className="border-b border-slate-700 px-5 py-3">
          <h2 className="text-lg font-semibold">
            {job?.title || "Chat"}
          </h2>
          <p className="text-xs text-slate-400">Job Discussion</p>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {messages.length === 0 && (
            <p className="text-slate-400 text-sm text-center mt-10">
              No messages yet 👋
            </p>
          )}

          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                // handle populated sender (object) or raw id
                (msg.sender && (msg.sender._id || msg.sender) === currentUser.id) || (msg.sender === currentUser.id)
                  ? "bg-emerald-500 text-slate-900 ml-auto"
                  : "bg-slate-800 text-slate-100"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* INPUT */}
        <div className="border-t border-slate-700 px-4 py-3 flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-full px-4 py-2 text-sm"
          />

          <button
            onClick={sendMessage}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-5 rounded-full font-semibold text-sm"
          >
            Send
          </button>
        </div>
      </motion.div>
    </div>
  );
}
