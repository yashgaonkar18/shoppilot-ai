import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import Invoice from "../models/Invoice.js";


export const createSale = async (req, res) => {
  try {
    const { customer_name, customer_phone, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    let total = 0;
    const saleItems = [];

    for (const item of items) {
      const product = await Product.findOne({ _id: item.product_id, userId: req.user._id });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `${item.product_name} not found`,
        });
      }

      if (product.qty < item.qty) {
        return res.status(400).json({
          success: false,
          message: `${product.name} has only ${product.qty} left`,
        });
      }

      product.qty -= item.qty;
      await product.save();

      const line_total = item.qty * product.sell_price;

      total += line_total;

      saleItems.push({
        product_id: product._id,
        product_name: product.name,
        qty: item.qty,
        unit_price: product.sell_price,
        line_total,
      });
    }

    const sale = await Sale.create({
      customer_name,
      customer_phone,
      total,
      sale_items: saleItems,
      userId: req.user._id,
    });

    const invoice = await Invoice.create({
      invoice_number: `INV-${Date.now()}`,
      total,
      sale: sale._id,
      userId: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Sale Completed",
      sale,
      invoice,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Get All Sales
export const getSales = async (req, res) => {
  try {
    const sales = await Sale.find({ userId: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: sales.length,
      sales,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Sale By ID
export const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findOne({ _id: req.params.id, userId: req.user._id });

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    res.status(200).json({
      success: true,
      sale,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Sale
export const deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: "Sale not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Sale deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};