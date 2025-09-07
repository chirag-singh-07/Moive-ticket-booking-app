document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);

  const title = params.get("title");
  const year = params.get("year");
  const genre = params.get("genre");
  const rating = params.get("rating");
  const poster = params.get("poster");
  const website = params.get("website") || "https://www.cineflix.com";
  const description =
    params.get("description") ||
    "An action-packed movie that will keep you on the edge of your seat!";

  if (title && year && genre && rating && poster) {
    document.getElementById("movie-title").textContent =
      decodeURIComponent(title);
    document.getElementById("movie-year").textContent =
      decodeURIComponent(year);
    document.getElementById("movie-genre").textContent =
      decodeURIComponent(genre);
    document.getElementById("movie-rating").textContent =
      decodeURIComponent(rating);
    document.getElementById("movie-poster").src = decodeURIComponent(poster);
  }

  // ✅ Add seats layout
  const seatsContainer = document.getElementById("seats");
  const rows = 6;
  const cols = 8;
  let seatNumber = 1;
  const occupiedPercentage = 0.1 + Math.random() * 0.8; // 10% to 90 % booked

  for (let i = 0; i < rows * cols; i++) {
    const seat = document.createElement("div");
    seat.classList.add("seat");
    seat.textContent = seatNumber;

    // ✅ Example: Mark 20% seats as occupied
    if (Math.random() < occupiedPercentage) {
      seat.classList.add("occupied");
    }

    seat.addEventListener("click", () => {
      if (!seat.classList.contains("occupied")) {
        seat.classList.toggle("selected");
      }
    });

    seatsContainer.appendChild(seat);
    seatNumber++;
  }

  // ✅ Get user details from localStorage
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName") || "Guest";
  const userEmail = localStorage.getItem("userEmail") || "Not Available";

  // ✅ Booking Logic
  // document.getElementById("book-ticket-btn").addEventListener("click", () => {
  //   if (!token) {
  //     alert("You need to log in to book tickets!");
  //     window.location.href = "/frontend/pages/login.html";
  //     return;
  //   }

  //   const selectedSeats = document.querySelectorAll(".seat.selected");

  //   if (selectedSeats.length === 0) {
  //     alert("Please select at least one seat!");
  //     return;
  //   }

  //   const seatNumbers = [...selectedSeats].map((seat) => seat.textContent);

  //   const bookingTime = new Date().toLocaleString("en-IN", {
  //     weekday: "long",
  //     year: "numeric",
  //     month: "long",
  //     day: "numeric",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     second: "2-digit",
  //   });

  //   // ✅ Format ticket details
  //   const ticketDetails = `
  // Ticket Details:
  // ------------------------------------
  // Movie: ${title}
  // Year: ${year}
  // Genre: ${genre}
  // Rating: ${rating}
  // Website: ${website}
  // Description: ${description}

  // User: ${userName}
  // Email: ${userEmail}

  // Seats: ${seatNumbers.join(", ")}
  // Booking Time: ${bookingTime}

  // Thank you for booking with CineFlix!
  // ------------------------------------
  // `;

  //   // ✅ Save to localStorage
  //   localStorage.setItem("bookingHistory", JSON.stringify(ticketDetails));

  //   // ✅ Alert confirmation
  //   alert("Your Tickets are Booked!");

  //   // ✅ Download PDF ticket
  //   downloadTicketPDF(
  //     title,
  //     year,
  //     genre,
  //     rating,
  //     website,
  //     description,
  //     userName,
  //     userEmail,
  //     seatNumbers,
  //     bookingTime
  //   );

  //   // ✅ Clear selected seats
  //   selectedSeats.forEach((seat) => seat.classList.remove("selected"));
  // });// ✅ Booking Logic
  document.getElementById("book-ticket-btn").addEventListener("click", () => {
    if (!token) {
      alert("You need to log in to book tickets!");
      window.location.href = "/frontend/pages/login.html";
      return;
    }

    const selectedSeats = document.querySelectorAll(".seat.selected");
    if (selectedSeats.length === 0) {
      alert("Please select at least one seat!");
      return;
    }

    const seatNumbers = [...selectedSeats].map((seat) => seat.textContent);

    // ✅ Show Ticket Summary in Modal
    const ticketSummary = `
    <p><strong>Movie:</strong> ${title}</p>
    <p><strong>Year:</strong> ${year}</p>
    <p><strong>Genre:</strong> ${genre}</p>
    <p><strong>Seats:</strong> ${seatNumbers.join(", ")}</p>
    <p><strong>User:</strong> ${userName} (${userEmail})</p>
  `;
    document.getElementById("ticket-summary").innerHTML = ticketSummary;

    // Show modal
    document.getElementById("payment-modal").classList.remove("hidden");

    // ✅ Handle Cancel
    document.getElementById("cancel-payment").addEventListener("click", () => {
      document.getElementById("payment-modal").classList.add("hidden");
    });

    // ✅ Handle Payment Submit
    document.getElementById("payment-form").onsubmit = function (e) {
      e.preventDefault();

      const cardNumber = document.getElementById("card-number").value;
      const expiryDate = document.getElementById("expiry-date").value;
      const cardName = document.getElementById("card-name").value;

      const bookingTime = new Date().toLocaleString("en-IN");

      // ✅ Save booking history
      const ticketDetails = {
        title,
        year,
        genre,
        rating,
        website,
        description,
        userName,
        userEmail,
        seats: seatNumbers,
        bookingTime,
        payment: { cardName, last4: cardNumber.slice(-4), expiry: expiryDate },
      };
      localStorage.setItem("bookingHistory", JSON.stringify(ticketDetails));

      alert("Payment Successful! Your Tickets are Booked 🎉");
      document.getElementById("payment-modal").classList.add("hidden");

      // ✅ Generate PDF with payment info
      downloadTicketPDF(ticketDetails);

      // Clear selected seats
      selectedSeats.forEach((seat) => seat.classList.remove("selected"));
    };
  });

  // ✅ Updated PDF function
  function downloadTicketPDF(details) {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    pdf.setFontSize(22);
    pdf.text("CineFlix Ticket", 10, 20);

    pdf.setFontSize(14);
    pdf.text(`Movie: ${details.title}`, 10, 40);
    pdf.text(`Year: ${details.year}`, 10, 50);
    pdf.text(`Genre: ${details.genre}`, 10, 60);
    pdf.text(`Rating: ${details.rating}`, 10, 70);
    pdf.text(`Website: ${details.website}`, 10, 80);

    pdf.text(`User: ${details.userName}`, 10, 100);
    pdf.text(`Email: ${details.userEmail}`, 10, 110);

    pdf.text(`Seats: ${details.seats.join(", ")}`, 10, 130);
    pdf.text(`Booking Time: ${details.bookingTime}`, 10, 140);

    pdf.text("Payment Info:", 10, 160);
    pdf.text(`Name on Card: ${details.payment.cardName}`, 10, 170);
    pdf.text(`Card (Last 4): **** **** **** ${details.payment.last4}`, 10, 180);
    // pdf.text(`Expiry: ${details.payment.expiry}`, 10, 190);

    pdf.save(`CineFlix_Ticket_${details.title}.pdf`);
  }

  // ✅ Download Ticket as PDF (without poster and emojis)
  // function downloadTicketPDF(
  //   title,
  //   year,
  //   genre,
  //   rating,
  //   website,
  //   description,
  //   userName,
  //   userEmail,
  //   seatNumbers,
  //   bookingTime
  // ) {
  //   const { jsPDF } = window.jspdf;
  //   const pdf = new jsPDF();

  //   // ✅ Title
  //   pdf.setFontSize(22);
  //   pdf.text("CineFlix Ticket", 10, 20);

  //   // ✅ Movie Details
  //   pdf.setFontSize(14);
  //   pdf.text(`Movie: ${title}`, 10, 30);
  //   pdf.text(`Year: ${year}`, 10, 40);
  //   pdf.text(`Genre: ${genre}`, 10, 50);
  //   pdf.text(`Rating: ${rating}`, 10, 60);
  //   pdf.text(`Website: ${website}`, 10, 70);
  //   pdf.text(`Description: ${description}`, 10, 80);

  //   // ✅ User Info
  //   pdf.text(`User: ${userName}`, 10, 100);
  //   pdf.text(`Email: ${userEmail}`, 10, 110);

  //   // ✅ Seat and Booking Time
  //   pdf.text(`Seats: ${seatNumbers.join(", ")}`, 10, 130);
  //   pdf.text(`Booking Time: ${bookingTime}`, 10, 140);

  //   // ✅ Save the PDF
  //   pdf.save(`CineFlix_Ticket_${title}.pdf`);
  // }
});
