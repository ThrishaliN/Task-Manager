import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true, // Simple unique constraint
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters'],
    },
    provider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local'
    },
    avatar: String,
    displayName: String,
    firstName: String,
    lastName: String,
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password only for local users
userSchema.pre('save', async function(next) {
  if (this.provider === 'local' && this.password && this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return this.provider === 'local' && this.password
    ? await bcrypt.compare(enteredPassword, this.password)
    : false;
};

const User = mongoose.model('User', userSchema);
export default User;

