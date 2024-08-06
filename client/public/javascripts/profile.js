document.addEventListener("DOMContentLoaded", async () => {
  try {
    const profileResponse = await fetch("/api/users/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you store the token in localStorage
      },
    });

    if (!profileResponse.ok) {
      throw new Error("Failed to fetch profile data");
    }

    const profileData = await profileResponse.json();
    document.getElementById("username").textContent = profileData.username;
    document.getElementById("email").textContent = profileData.email;
    document.getElementById("join-date").textContent = new Date(
      profileData.joinDate
    ).toLocaleDateString();

    const orderResponse = await fetch("/api/orders", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you store the token in localStorage
      },
    });

    if (!orderResponse.ok) {
      throw new Error("Failed to fetch order history");
    }

    const orders = await orderResponse.json();
    const orderHistoryBody = document.getElementById("order-history-body");
    orderHistoryBody.innerHTML = "";

    orders.forEach((order) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${order.id}</td>
        <td>${new Date(order.date).toLocaleDateString()}</td>
        <td>${order.status}</td>
        <td>$${order.total.toFixed(2)}</td>
        <td><button onclick="viewOrder(${order.id})">View</button></td>
      `;
      orderHistoryBody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error:", error);
  }
});

function viewOrder(orderId) {
  alert(`View details for order ID: ${orderId}`);
}
