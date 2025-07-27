import axios from "axios";
import multer from "multer";
const USER_SERVICE_URL = "http://localhost:5000"; // 🔁 Replace with actual URL
export const isAuth = async (req, res, next) => {
    try {
        const token = req.headers.token;
        if (!token) {
            res.status(403).json({
                message: "Please Login1",
            });
            return;
        }
        const { data } = await axios.get(`${USER_SERVICE_URL}/api/v1/user/me`, {
            headers: {
                token,
            },
        });
        req.user = data;
        next();
    }
    catch (error) {
        res.status(403).json({
            message: "Please Login2",
        });
    }
};
// ✅ Multer Setup (no change here)
const storage = multer.memoryStorage();
const uploadFile = multer({ storage }).single("file");
export default uploadFile;
