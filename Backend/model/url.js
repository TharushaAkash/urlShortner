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
            type: Date,
            index: { expires: 86400 }  //Delete data after 1day
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