import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  //retrieve token from cookies
  const token = req.cookies?.jwt;

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || "fallback_secret",
    (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }
      req.user = decoded;
      next();
    }
  );
};

export default authenticateToken;
