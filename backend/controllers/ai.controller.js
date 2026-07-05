import ai from "../config/gemini.js";

import Product from "../models/Product.js";
import Sale from "../models/Sale.js";
import Invoice from "../models/Invoice.js";
import User from "../models/User.js";

export const chat = async (req, res) => {
  try {
    const { prompt } = req.body;

    const products = await Product.find();

    const sales = await Sale.find();

    const invoices = await Invoice.find();

    const user = await User.findById(req.user.id);

    const context = `
You are ShopPilot AI.

Shop Name:
${user.shop_name}

Owner:
${user.owner_name}

Products:
${JSON.stringify(products)}

Sales:
${JSON.stringify(sales)}

Invoices:
${JSON.stringify(invoices)}

User Question:
${prompt}

Answer professionally.

Do not invent information.

Use only the available shop data.
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: context,
    });

    res.json({
      success: true,
      response: result.text,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};