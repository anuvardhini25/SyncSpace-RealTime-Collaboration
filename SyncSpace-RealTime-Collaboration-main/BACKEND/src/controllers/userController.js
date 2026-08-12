export const getUsers = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      users: []
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: {}
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};