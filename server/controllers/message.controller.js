const Message = require("../models/message.model");
const Conversation = require("../models/conservation.model");

const sendMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const { message } = req.body;
    const senderId = req.user.id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({ senderId, receiverId, message });

    conversation.messages.push(newMessage._id);
    Promise.all([conversation.save(), newMessage.save()]);

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
    const { id : userToChatId } = req.params;
    const userId = req.user.id;
    const conservation = await Conversation.findOne({
      participants: { $all: [userId, userToChatId] },
    }).populate("messages");

    if (!conservation) {
      return res.status(200).json({ success: true, messages: [] });
    }
    res.status(200).json(conservation.messages);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error during send message controller",
    });
  }
};

module.exports = { sendMessage, getMessages };
