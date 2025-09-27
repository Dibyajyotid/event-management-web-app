import User from "../models/user.model.js";

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
