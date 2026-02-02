import Message from "../models/Message.js";

/**
 * Send message
 */
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, jobId, text } = req.body;

    if (!receiverId || !jobId || !text) {
      return res.status(400).json({ message: "All fields required" });
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      job: jobId,
      text,
    });

    res.status(201).json(message);
  } catch (err) {
    console.error("Send message error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get conversation for a job
 */
export const getConversation = async (req, res) => {
  try {
    const { jobId, userId } = req.params;

    const messages = await Message.find({
      job: jobId,
      $or: [
        { sender: req.user._id, receiver: userId },
        { sender: userId, receiver: req.user._id },
      ],
    })
      .populate("sender", "name role")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error("Get conversation error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
