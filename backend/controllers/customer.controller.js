import Customer from "../models/Customer.js";

export const getCustomers = async (req, res) => {
  try {

    const customers = await Customer.find({ userId: req.user._id }).sort({
      createdAt: -1
    });

    res.status(200).json({
      success: true,
      customers
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

export const createCustomer = async (req, res) => {

  try {

    const customer = await Customer.create({ ...req.body, userId: req.user._id });

    res.status(201).json({
      success: true,
      customer
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }

};

export const updateCustomer = async (req, res) => {

  try {

    const customer = await Customer.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!customer) {

      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });

    }

    res.status(200).json({
      success: true,
      customer
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }

};

export const deleteCustomer = async (req, res) => {

  try {

    const customer = await Customer.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!customer) {

      return res.status(404).json({
        success: false,
        message: "Customer not found"
      });

    }

    res.status(200).json({
      success: true,
      message: "Customer deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};