import mongoose from "mongoose";


const urlSchema = new mongoose.Schema(
    {
        long_url: {
            type: String,
            required: true
        },

        short_url: {
            type: String,
            required: true,
            unique: true
        },

        expireAt: {
            type: Date
        },

        password: {
            type: String,
        },

        isPassword: {
            type: Boolean,
            default: false
        }
    }
)

const Url = mongoose.model("Url", urlSchema);
export default Url;