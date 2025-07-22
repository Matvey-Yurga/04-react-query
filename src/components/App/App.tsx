import { useState } from 'react';
import SearchBar from '../SearchBar/SearchBar'
import css from "./App.module.css"
import toast, { Toaster } from "react-hot-toast";
import { fetchMovies }  from "../../services/movieService";
import type { Movie } from '../../types/movie';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
function App() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [error, setError] = useState(false)
  const [isLoader, setIsLoader] = useState(false)
  const [currentMovie,setcurrentMovie] = useState<Movie | null>(null)
  const handleSubmit = (query: string) => {
    setMovies([])
    setIsLoader(true)
    setError(false)
    fetchMovies(query).then(data => {
      if (!data.length) {
        toast.error("No movies found for your request.")
      }
      setMovies(data)
    }).catch(() => {
      setError(true)
    }).finally(() => {
      setIsLoader(false)
    });

  };
  function onSelect(movie: Movie): void {
   setcurrentMovie(movie)
  }
  function closeModal() {
    setcurrentMovie(null)
  }
  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSubmit} />
      <Toaster/>
        {isLoader && <Loader />}
        {error && <ErrorMessage/>}
      {movies.length > 0 && <MovieGrid movies={movies} onSelect={onSelect} />}
      {currentMovie && (
        <MovieModal movie={currentMovie} onClose={closeModal}/>
      )}
      </div>
  )
}

export default App
