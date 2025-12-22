const Message = require("../models/message.model");
const Conversation = require("../models/conservation.model");

const sendMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const { message } = req.body;
    const senderId = req.user.id;
    console.log(senderId, receiverId,message);
    
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({ senderId, receiverId, message });
    await newMessage.save();

    conversation.messages.push(newMessage._id);
    await conversation.save();

    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error during send message controller",
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const { id } = req.params;

    // Logic to retrieve messages for user with id
    const messages = [
      { from: id, content: "Hello!" },
      { from: id, content: "How are you?" },
    ];
    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve messages" });
  }
};

module.exports = { sendMessage, getMessages };
