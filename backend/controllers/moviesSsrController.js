const renderMoviesSSR = async (req, res) => {
  try {
    const response = await fetch("http://localhost:5000/api/tmdb/movie/popular");
    const data = await response.json();

    res.render("movies-ssr", {
      movies: data.results,
      title: "Popular Movies"
    });

  } catch (error) {
    res.render("movies-ssr", {
      movies: [],
      title: "Error",
      error: "Failed to fetch movies"
    });
  }
};

module.exports = { renderMoviesSSR };