document.addEventListener("DOMContentLoaded", () => {
  const movieCards = document.querySelectorAll(".movie-card");

  movieCards.forEach((card) => {
    card.addEventListener("click", () => {
        // console.log({ title, year, genre, rating, poster });
        console.log("cards", card);
        
      const title = encodeURIComponent(card.getAttribute("data-title"));
      const year = encodeURIComponent(card.getAttribute("data-year"));
      const genre = encodeURIComponent(card.getAttribute("data-genre"));
      const rating = encodeURIComponent(card.getAttribute("data-rating"));
      const poster = encodeURIComponent(card.getAttribute("data-poster"));

      console.log({ title, year, genre, rating, poster }); // ✅ Debugging step

      if (title && year && genre && rating && poster) {
        window.location.href = `./pages/movie-detail.html?title=${title}&year=${year}&genre=${genre}&rating=${rating}&poster=${poster}`;
      } else {
        console.error("Missing movie details!");
      }
    });
  });
});
