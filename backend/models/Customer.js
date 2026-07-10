import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
{
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    name: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    email: {
        type: String,
        default: ""
    },

    address: {
        type: String,
        default: ""
    }

},
{
    timestamps: true
});

customerSchema.index({ phone: 1, userId: 1 }, { unique: true });

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;