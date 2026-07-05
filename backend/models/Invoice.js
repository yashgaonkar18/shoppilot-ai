import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
{
    invoice_number: {
        type: String,
        required: true,
        unique: true
    },

    sale: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sale",
        required: true
    },

    total: {
        type: Number,
        required: true
    },

    created_at: {
        type: Date,
        default: Date.now
    },

    pdf_url: {
        type: String,
        default: ""
    }

},
{
    timestamps: true
});

const Invoice = mongoose.model("Invoice", invoiceSchema);

export default Invoice;