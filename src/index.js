async function logMovies() {
  const response = await fetch("http://localhost:3000/films");
  const movies = await response.json();
}



