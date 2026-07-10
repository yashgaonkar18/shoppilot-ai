import Invoice from "../models/Invoice.js";
import User from "../models/User.js";

// Builds a wa.me deep link with the invoice pre-filled as a message
// No WhatsApp API/approval needed — opens WhatsApp on the shop owner's
// device with the message ready, owner taps Send themselves.
export const getWhatsAppLink = async (req, res) => {
  try {
    const { invoiceId } = req.params;

    const invoice = await Invoice.findOne({ _id: invoiceId, userId: req.user._id }).populate("sale");
    if (!invoice) {
      return res.status(404).json({ success: false, message: "Invoice not found" });
    }

    const sale = invoice.sale; // already populated via .populate("sale")
    if (!sale) {
      return res.status(404).json({ success: false, message: "Sale not found for this invoice" });
    }

    if (!sale.customer_phone) {
      return res.status(400).json({
        success: false,
        message: "No phone number was recorded for this customer",
        noPhone: true,
      });
    }

    const user = await User.findById(req.user._id);

    // Format phone — strip spaces/dashes, ensure country code
    let phone = sale.customer_phone.replace(/[\s\-()]/g, "");
    if (!phone.startsWith("+") && !phone.startsWith("91")) {
      phone = "91" + phone; // default to India country code
    }
    phone = phone.replace("+", "");

    // Build invoice message
    const itemLines = sale.sale_items
      .map((item) => `${item.product_name} x${item.qty} - ₹${item.line_total}`)
      .join("\n");

    const message = [
      `*${user.shop_name}*`,
      `Invoice: ${invoice.invoice_number}`,
      `Date: ${new Date(invoice.created_at).toLocaleDateString("en-IN")}`,
      ``,
      itemLines,
      ``,
      `*Total: ₹${invoice.total}*`,
      ``,
      `Thank you for shopping with us!`,
    ].join("\n");

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;

    res.status(200).json({
      success: true,
      whatsappUrl,
      customerPhone: sale.customer_phone,
    });
  } catch (error) {
    console.error("WhatsApp link error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};