import Order from "../models/order.js";
import Product from "../models/product.js";

export async function createOrder(req, res) {
  const data = req.body;
  const orderInfo = {
    orderedItems: [],
  };

  if (req.user == null) {
    res.status(401).json({
      message: "Please login and try again",
    });
    return;
  }
  orderInfo.email = req.user.email;
  orderInfo.userId = req.user._id;  // Add user ID for referencing in payment

  // Generate order ID with format ORD0001, ORD0002, etc.
  const lastOrder = await Order.find().sort({ orderDate: -1 }).limit(1);
  if (lastOrder.length == 0) {
    orderInfo.orderId = "ORD0001";
  } else {
    const lastOrderId = lastOrder[0].orderId; //ORD0065
    const lastOrderNumberInString = lastOrderId.replace("ORD", ""); //0065
    const lastOrderNumber = parseInt(lastOrderNumberInString); //65
    const currentOrderNumber = lastOrderNumber + 1; //66
    const formattedNumber = String(currentOrderNumber).padStart(4, "0"); //0066
    orderInfo.orderId = "ORD" + formattedNumber;
  }

  let oneDayCost = 0;

  for (let i = 0; i < data.orderedItems.length; i++) {
    try {
      const product = await Product.findOne({ key: data.orderedItems[i].key });
      if (product == null) {
        res.status(404).json({
          message: "Product with key " + data.orderedItems[i].key + " not found",
        });
        return;
      }
      if (product.availability == false) {
        res.status(400).json({
          message:
            "Product with key " + data.orderedItems[i].key + " is not Available",
        });
        return;
      }

      orderInfo.orderedItems.push({
        product: {
          key: product.key,
          name: product.name,
          image: product.profilePicture[0],
          price: product.price,
        },
        quantity: data.orderedItems[i].qty,
      });

      oneDayCost += product.price * data.orderedItems[i].qty;
    } catch (e) {
      res.status(500).json({
        message: "Failed to create order",
      });
      return;
    }
  }

  orderInfo.days = data.days;
  orderInfo.startingDate = data.startingDate;
  orderInfo.endingDate = data.endingDate;
  orderInfo.totalAmount = oneDayCost * data.days;
  orderInfo.status = "pending"; // Add status field for payment tracking

  try {
    const newOrder = new Order(orderInfo);
    const result = await newOrder.save();
    
    // Return more detailed order data for payment processing
    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: result,
      orderId: result._id,
      total: result.totalAmount
    });

  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
}

export async function getQuote(req, res) {
  const data = req.body;
  const orderInfo = {
    orderedItems: [],
  };
  
  let oneDayCost = 0;

  for (let i = 0; i < data.orderedItems.length; i++) {
    try {
      const product = await Product.findOne({ key: data.orderedItems[i].key });
      if (product == null) {
        res.status(404).json({
          message: "Product with key " + data.orderedItems[i].key + " not found",
        });
        return;
      }
      if (product.availability == false) {
        res.status(400).json({
          message:
            "Product with key " + data.orderedItems[i].key + " is not Available",
        });
        return;
      }

      orderInfo.orderedItems.push({
        product: {
          key: product.key,
          name: product.name,
          image: product.profilePicture[0],
          price: product.price,
        },
        quantity: data.orderedItems[i].qty,
      });

      oneDayCost += product.price * data.orderedItems[i].qty;
    } catch (e) {
      res.status(500).json({
        message: "Failed to create order quote",
      });
      return;
    }
  }

  orderInfo.days = data.days || 1; // Default to 1 day if not specified
  orderInfo.startingDate = data.startingDate;
  orderInfo.endingDate = data.endingDate;
  orderInfo.totalAmount = oneDayCost * orderInfo.days;

  try {
    res.status(200).json({
      success: true,
      message: "Order Quotation",
      total: orderInfo.totalAmount,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Failed to create order quotation",
    });
  }
}

// Get user's orders
export async function getUserOrders(req, res) {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ userId }).sort({ orderDate: -1 });
    
    res.status(200).json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch orders' 
    });
  }
}

// Get order details
export async function getOrderDetails(req, res) {
  try {
    const orderId = req.params.id;
    const userId = req.user._id;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ 
        success: false,
        message: 'Order not found' 
      });
    }
    
    // Verify order belongs to user
    if (order.userId.toString() !== userId.toString()) {
      return res.status(403).json({ 
        success: false,
        message: 'Unauthorized access to this order' 
      });
    }
    
    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch order details' 
    });
  }
}

// Update order status after payment
export async function updateOrderStatus(req, res) {
  try {
    const { orderId, status } = req.body;
    const userId = req.user._id;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Verify order belongs to user
    if (order.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this order'
      });
    }
    
    order.status = status;
    await order.save();
    
    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
}