import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";

export default function Cart({ newProductId, newQuantity, newRentalDate }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartId, setCartId] = useState(null);
  const [userInfo, setUserInfo] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const API = `http://localhost:8080/api/cart`;

  const token = localStorage.getItem("token");
  let userId = null;

  if (token) {
    try {
      const decoded = jwt_decode(token);
      userId = decoded.id || decoded._id;
    } catch (err) {
      console.error("Invalid token", err);
    }
  }

  useEffect(() => {
    if (!userId) return;

    const fetchAndUpdateCart = async () => {
      try {
        // 1. Fetch existing cart
        const cartRes = await fetch(`${API}/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!cartRes.ok) throw new Error("Failed to fetch cart");

        const cartData = await cartRes.json();
        const existingCart = cartData.result;
        let updatedItems = [...(existingCart?.itemsList || [])];
        setCartId(existingCart._id);
        setUserInfo(existingCart.userId);

        // 2. Add/update new item
        if (newProductId && newQuantity && newRentalDate) {
          const existingItem = updatedItems.find(
            (item) => item.productId === newProductId
          );

          if (existingItem) {
            existingItem.quantity = newQuantity;
          } else {
            // Fetch product price
            const prodRes = await fetch(
              `http://localhost:8080/api/products/${newProductId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            const product = await prodRes.json();

            updatedItems.push({
              productId: newProductId,
              quantity: newQuantity,
              price: product.result.price,
              rentalDate: newRentalDate,
            });
          }

          // 3. Save updated cart
          const saveRes = await fetch(`${API}/${existingCart._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              itemsList: updatedItems,
              deliveryAddress: existingCart.deliveryAddress || "TBD",
              eventNotes: existingCart.eventNotes || "",
            }),
          });

          if (!saveRes.ok) throw new Error("Failed to update cart");
        }

        // 4. Get detailed product info
        const detailedItems = (existingCart.itemsList || []).map((item) => ({
          name: item.productId.name,
          image: item.productId.image,
          price: item.productId.price,
          quantity: item.quantity,
          rentalDate: item.rentalDate,
          _id: item.productId._id,
        }));

        setCartItems(detailedItems);
        setLoading(false);
      } catch (err) {
        console.error("Cart error:", err.message);
        setError("Error loading cart");
        setLoading(false);
      }
    };

    fetchAndUpdateCart();
  }, [userId, newProductId, newQuantity, newRentalDate]);

  if (!userId) return <div className="p-4">Please log in.</div>;
  if (loading) return <div className="p-4">Loading cart...</div>;

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

      {userInfo && (
        <div className="mb-4">
          <p className="font-semibold">
            User: {userInfo.firstName} {userInfo.lastName}
          </p>
          <p>Email: {userInfo.email}</p>
        </div>
      )}

      {error && <p className="text-red-500 font-semibold">{error}</p>}

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
                  <p>Rental Date: {item.rentalDate}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">
                  ${item.price * item.quantity}
                </p>
              </div>
            </div>
          ))}
          <div className="text-right text-xl font-bold pt-4 border-t">
            Total: ${total.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
}
