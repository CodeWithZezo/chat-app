const Message = require("../models/message.model");
const Conversation = require("../models/conservation.model");

const sendMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const { message } = req.body;
    const senderId = req.user.id;

    // Validation
    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message content is required",
      });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({ 
      senderId, 
      receiverId, 
      message: message.trim() 
    });

    conversation.messages.push(newMessage._id);

    // Use Promise.all correctly with await
    await Promise.all([conversation.save(), newMessage.save()]);

    // Return the populated message with all fields including createdAt
    const populatedMessage = await Message.findById(newMessage._id);
    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during send message",
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const userId = req.user.id;

    const conversation = await Conversation.findOne({
      participants: { $all: [userId, userToChatId] },
    }).populate("messages");

    if (!conversation) {
      return res.status(200).json([]);
    }

    res.status(200).json(conversation.messages);
  } catch (error) {
    console.error("Error in getMessages:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during get messages",
    });
  }
};

module.exports = { sendMessage, getMessages };