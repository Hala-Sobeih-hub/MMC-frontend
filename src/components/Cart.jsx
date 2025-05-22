import React, { useEffect, useState } from "react";


export default function Cart({ newProductId, newQuantity }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get token and decode user ID
  const token = localStorage.getItem("token");
  let userId = null;

  

  useEffect(() => {


    const fetchAndUpdateCart = async () => {
      try {
        // 1. Fetch user's existing cart
        const cartRes = await fetch(`/api/cart/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!cartRes.ok) throw new Error("Failed to fetch cart");

        let cartData = await cartRes.json();
        let updatedItems = [...(cartData.items || [])];

        // 2. If new item passed in props, add or update it
        if (newProductId && newQuantity) {
          const existingItem = updatedItems.find(
            (item) => item.productId === newProductId
          );

          if (existingItem) {
            existingItem.quantity += newQuantity;
          } else {
            updatedItems.push({
              productId: newProductId,
              quantity: newQuantity,
            });
          }

          // 3. Save updated cart back to DB
          const saveRes = await fetch(`/api/cart/${cartData._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ items: updatedItems }),
          });

          if (!saveRes.ok) throw new Error("Failed to update cart");
        }

        // 4. Get detailed product info for display
        const fullItems = await Promise.all(
          updatedItems.map(async (item) => {
            const res = await fetch(`/api/products/${item.productId}`);
            const product = await res.json();
            return {
              ...product,
              quantity: item.quantity,
            };
          })
        );

        setCartItems(fullItems);
        setLoading(false);
      } catch (err) {
        console.error("Cart error:", err.message);
        setLoading(false);
      }
    };

    fetchAndUpdateCart();
  }, [userId, newProductId, newQuantity]);

  if (loading) return <div className="p-4">Loading cart...</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p>No items in the cart.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between bg-white shadow-md p-4 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p>Quantity: {item.quantity}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">
                  ${item.price * item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
