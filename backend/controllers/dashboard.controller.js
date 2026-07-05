import Product from "../models/Product.js";
import Sale from "../models/Sale.js";
import Invoice from "../models/Invoice.js";

export const getDashboard = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();

    const totalSales = await Sale.countDocuments();

    const totalInvoices = await Invoice.countDocuments();

    const revenue = await Sale.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" }
        }
      }
    ]);

    const lowStockProducts = await Product.find({
      $expr: {
        $lte: ["$qty", "$low_stock_threshold"]
      }
    });

    const recentSales = await Sale.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      dashboard: {
        totalProducts,
        totalSales,
        totalInvoices,
        totalRevenue: revenue[0]?.totalRevenue || 0,
        lowStockProducts,
        recentSales
      }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};