import User from "../models/user.js";
import { GenarateToken } from "../utility/JwtGenarate.js";

//  REGISTER USER
export const Createuser = async (req, res, next) => {
  try {
    let { name, email, password, role, phone } = req.body;
    email = email.toLowerCase();

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "This email already exists" });

    const profileUrl = req.file ? req.file.path : ""; 

    const user = await User.create({
      name,
      email,
      password,
      role,
      phone,
      profile: profileUrl,
    });

    const token = GenarateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profile: user.profile,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

//  LOGIN
export const Login = async (req, res, next) => {
  try {
    let { email, password } = req.body;
    email = email.toLowerCase();

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = GenarateToken(user._id);
    const { password: _, ...userData } = user.toObject();

    res.json({ success: true, token, user: userData });
  } catch (err) {
    next(err);
  }
};

//  GET LOGGED-IN USER
export const GetProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
};

//  UPDATE PROFILE
export const UpdateProfile = async (req, res, next) => {
  try {
    const { name, email, phone, role, bio } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase();
    if (phone) updateData.phone = phone;
    if (role) updateData.role = role;
    if (bio) updateData.bio = bio;
    if (req.file) updateData.profile = req.file.path; //  Cloudinary URL

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      select: "-password",
    });

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};

//  CHANGE PASSWORD
export const ChangePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch)
      return res.status(400).json({ message: "Old password is incorrect" });

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
};

//  DELETE ACCOUNT
export const DeleteAccount = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.json({ success: true, message: "Account deleted successfully" });
  } catch (err) {
    next(err);
  }
};
