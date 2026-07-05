import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true,
        unique: true
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

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;