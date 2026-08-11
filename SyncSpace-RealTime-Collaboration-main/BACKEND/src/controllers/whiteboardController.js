export const saveWhiteboard = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Whiteboard saved"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getWhiteboard = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};