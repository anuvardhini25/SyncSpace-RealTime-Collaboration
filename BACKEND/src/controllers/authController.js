import { registerUser, loginUser } from "../services/authService.js";
import User from "../models/User.js";

export const signup = async (req, res) => {
  try {
    const result = await registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: result.token,
      user: result.user,
    });
  } catch (error) {
  console.error("========== SIGNUP ERROR ==========");
  console.error(error);
  console.error(error.stack);

  return res.status(500).json({
    success: false,
    message: error.message,
  });
}
};

export const login = async (req, res) => {
  try {
    const result = await loginUser(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Returns the currently authenticated user based on the JWT in the
// Authorization header. Used by the frontend on app load (AuthContext)
// to restore the session after a page refresh. Previously missing,
// which meant every refresh silently logged the user out.
export const getMe = async (req, res) => {
  try {
    // req.user is attached by the `protect` middleware
    res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};