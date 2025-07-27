import { NextFunction, Request, Response } from "express";
import axios from "axios";
import multer from "multer";

interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  playlist: string[];
}

interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

const USER_SERVICE_URL = "http://localhost:5000"; // 🔁 Replace with actual URL

export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.token as string;

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
  } catch (error) {
    res.status(403).json({
      message: "Please Login2",
    });
  }
};

// ✅ Multer Setup (no change here)
const storage = multer.memoryStorage();
const uploadFile = multer({ storage }).single("file");

export default uploadFile;
