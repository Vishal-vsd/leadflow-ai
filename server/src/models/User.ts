import bcrypt from "bcryptjs";
import mongoose, {Document} from "mongoose";

interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: "admin" | "user";

    comparePassword(enteredPassword:string): Promise<boolean>
}

const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    }
}, {
    timestamps: true
})

userSchema.pre("save", async function(){
    if(!this.isModified("password")){
        return;
    }
    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.methods.comparePassword = async function (enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password)
}

const User = mongoose.model<IUser>("User", userSchema)

export default User;