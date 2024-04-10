document.addEventListener('DOMContentLoaded', () => {
  getAllMovies();
});

let currentMovie = null;
const buyTicket = document.getElementById('buy-ticket');


function getAllMovies() {
  const lists = document.querySelector('ul');
  lists.textContent = "";

  fetch("http://localhost:3000/films")
      .then(response => {
          if (!response.ok) {
              throw new Error('Could not fetch resource');
          }
          return response.json();
      })
      .then(data => {
          // Check if the data is an array of movies
          if (Array.isArray(data)) {
              // Display the details of the first movie by default if available
              if (data.length > 0) {
                  currentMovie = data[0];
                  displayDetails(currentMovie);
              }

              // Update the movie list
              updateMovieList(data);

              // Add a click event listener to the "Buy Ticket" button
              buyTicket.addEventListener('click', () => updateSoldTickets(currentMovie));
          } else {
              lists.innerHTML = "<li>Invalid JSON format. Expected an array of movies.</li>";
          }
      })
      .catch(error => console.error(error));
}

function updateMovieList(moviesData) {
  const lists = document.querySelector('ul');
  lists.innerHTML = "";
  moviesData.forEach(movie => {
      const li = document.createElement('li');
      li.textContent = movie.title;
      li.addEventListener('click', () => displayDetails(movie));
      lists.appendChild(li);
  });
}

function displayDetails(currentMovie) {
  const title = document.getElementById('title');
  title.textContent = currentMovie.title;

  const runtime = document.getElementById('runtime');
  runtime.innerHTML = `<p>Runtime: ${currentMovie.runtime}</p>`;

  const showtime = document.getElementById('showtime');
  showtime.innerHTML = `<p>Showtime: ${currentMovie.showtime}</p>`;

  const poster = document.getElementById('poster');
  poster.src = currentMovie.poster;
  poster.alt = currentMovie.title;

  const description = document.getElementById('film-info');
  description.innerHTML = `<p>${currentMovie.description}</p>`;

  const remaining = document.getElementById('ticket-num');
  remaining.innerHTML = `${currentMovie.capacity - currentMovie.tickets_sold} tickets`;

   // Update the button text based on available tickets
   if (currentMovie.tickets_sold >= currentMovie.capacity) {
    buyTicket.textContent = "Sold Out";
    buyTicket.setAttribute("disabled", "true");
} else {
    buyTicket.textContent = "Buy Ticket";
    buyTicket.removeAttribute("disabled");
}

}

function updateSoldTickets(movieObj) {
  movieObj.tickets_sold += 1;
  const updated_tickets = document.querySelector('#ticket-num');
  updated_tickets.innerHTML = `${movieObj.capacity - movieObj.tickets_sold} tickets`;

  fetch(`http://localhost:3000/films/${movieObj.id}`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(movieObj)
  })
  .then(res => {
      if (!res.ok) {
          throw new Error("Network response was not ok");
      }
      return res.json();
  })
  .then(movie => {
      currentMovie = movie;
      displayDetails(currentMovie);
  })
  .catch(error => console.error(error));
}
