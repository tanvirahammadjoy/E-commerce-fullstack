document
  .querySelector("#register-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("Form submission prevented");

    const formData = new FormData(event.target);

    console.log("Form Data:");
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
      if (value instanceof File) {
        console.log(`File ${key}:`, value.name, value.type, value.size);
      }
    }

    try {
      console.log("Starting Axios request...");
      const response = await axios.post(
        "http://127.0.0.1:3000/api/users/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Axios request completed.");
      console.log("Response status:", response.status);
      console.log("Response data:", response.data);

      if (response.status === 201) {
        // Check for the correct success status code
        alert("Registration successful");
        window.location.href = "login.html";
      } else {
        console.error("Unexpected response status:", response.status);
        alert(
          response.data.message || "Registration failed. Please try again."
        );
      }
    } catch (error) {
      if (error.response) {
        console.error("Error details:", error.response.data);
        alert(
          error.response.data.message ||
            "Registration failed. Please try again."
        );
      } else {
        console.error("Error details:", error.message);
        alert("Registration failed. Please try again.");
      }
    }
  });
