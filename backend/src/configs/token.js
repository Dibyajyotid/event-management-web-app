import jwt from "jsonwebtoken";

export const generateToken = (user, res) => {
  const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  //sending the token in cookies in httpOnly to prevent XSS attacks
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, //prevent XSS attacks , cross site scripting attacks
    sameSite: "None", // Prevent CSRF attacks, cross site request forgery attacks
    // secure: process.env.NODE_ENV !== "development",
    secure: true,
  });

  return token;
};
