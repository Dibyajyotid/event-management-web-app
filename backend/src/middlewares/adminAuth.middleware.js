const adminAuth = (req, res, next) => {
  console.log("decoded Admin", req.user);
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Access denied. Admin role required." });
  }
  next();
};

export default adminAuth;
