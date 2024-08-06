document
  .querySelector("#login-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("http://127.0.0.1:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("Login Response:", result);

      if (!response.ok) {
        throw new Error(result.message || "Login failed");
      }

      // Verify that the response contains the tokens
      if (result.data.accessToken && result.data.refreshToken) {
        // Store the tokens in localStorage
        localStorage.setItem("accessToken", result.data.accessToken);
        localStorage.setItem("refreshToken", result.data.refreshToken);
        console.log("Stored access token:", result.data.accessToken);
        console.log("Stored refresh token:", result.data.refreshToken);

        // Redirect to index.html
        window.location.href = "index.html";
      } else {
        throw new Error("Tokens are missing in the response");
      }
    } catch (error) {
      console.error("Error:", error.message);
      alert(error.message || "Login failed. Please try again.");
    }
  });
