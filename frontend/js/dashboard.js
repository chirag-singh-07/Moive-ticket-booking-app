document.addEventListener("DOMContentLoaded", async () => {
  const userName = document.getElementById("user-name");
  const logoutBtn = document.getElementById("login-btn"); // ✅ Fixed ID reference
  const signUpBtn = document.getElementById("signup-btn");
  const userIcon = document.getElementById("user-icon");

  const token = localStorage.getItem("token");

  if (!token) {
    // ✅ If NOT logged in → Show sign up, hide logout & name
    logoutBtn.style.display = "none";
    userIcon.style.display = "none";
    signUpBtn.style.display = "block";
  } else {
    try {
      const res = await fetch("http://localhost:5000/api/auth/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch user data.");
      }

      localStorage.setItem("userName",data.name);
      localStorage.setItem("userEmail", data.email);

      // ✅ If logged in → Show name, hide sign up button
      userName.textContent = data.name;
      userIcon.style.display = "flex";
      logoutBtn.style.display = "flex";
      signUpBtn.style.display = "none";
    } catch (error) {
      console.error("Dashboard Error:", error);

      if (error.message.includes("Token expired")) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        window.location.href = "login.html";
      } else {
        alert("Something went wrong. Please try again later.");
      }
    }
  }

  // ✅ Logout event handler
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "/frontend/index.html";
  });
});
