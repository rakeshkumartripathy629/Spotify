import jwt from "jsonwebtoken";
import { User } from "./model.js";
// ✅ Hardcoded secret key (not recommended for production)
const JWT_SECRET = "aGz78!qL@1vN#7wKrUzPxLsd93TrK$z"; // <-- Replace this with a strong secret
export const isAuth = async (req, res, next) => {
    try {
        const token = req.headers.token;
        if (!token) {
            res.status(403).json({
                message: "Please Login",
            });
            return;
        }
        const decodedValue = jwt.verify(token, JWT_SECRET);
        if (!decodedValue || !decodedValue._id) {
            res.status(403).json({
                message: "Invalid token",
            });
            return;
        }
        const userId = decodedValue._id;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            res.status(403).json({
                message: "User Not found",
            });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(403).json({
            message: "Please Login",
        });
    }
};
