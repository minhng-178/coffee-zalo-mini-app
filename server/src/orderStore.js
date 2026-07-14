// In-memory placeholder store. Orders are lost on restart — swap this for a
// real database before taking production traffic.
const orders = new Map();

function createOrder(orderId, order) {
  orders.set(orderId, { ...order, status: "pending", createdAt: Date.now() });
}

function getOrder(orderId) {
  return orders.get(orderId);
}

function setOrderStatus(orderId, status) {
  const order = orders.get(orderId);
  if (order) order.status = status;
}

module.exports = { createOrder, getOrder, setOrderStatus };
