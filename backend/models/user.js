import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const UserSchema = new mongoose.Schema({
   name: { type: String, required: true },
   email: { type: String, unique: true, required: true },
   password: { type: String, required: true } ,
   profile:{type:String},
    role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },  
})

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

UserSchema.methods.comparePassword = function(inputPassword) {
    return bcrypt.compare(inputPassword, this.password);
}

const User = mongoose.model('users', UserSchema);
export default User;
