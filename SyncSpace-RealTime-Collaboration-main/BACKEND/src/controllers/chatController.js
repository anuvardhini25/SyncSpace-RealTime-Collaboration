export const sendMessage = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Message sent"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      messages: []
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};