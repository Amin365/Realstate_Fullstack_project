import User from "../models/user.js";
import { GenarateToken } from "../utility/JwtGenarate.js";




export const Createuser = async (req, res, next) => {
    let { name, email, password ,role} = req.body;
    try {
        email = email.toLowerCase();

        const exist = await User.findOne({ email }).select("-password");
        if (exist) {
            const error = new Error("This Email is Already Exist");
            error.statusCode = 400;
            throw error;
        }

        const user = await User.create({ name, email, password,role })
        const token = GenarateToken(user._id);
        res.json({ token ,user});
    } catch (err) {
        next(err); 
    }
};




// login


export const Login = async (req, res, next) => {
  let { email, password } = req.body;
  try {
    email = email.toLowerCase();

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    const token = GenarateToken(user._id);

    // remove password before sending response
    const { password: _, ...userWithoutPassword } = user.toObject();

    res.status(200).json({ token, user: userWithoutPassword });
  } catch (err) {
    next(err);
  }
}






