import { useEffect, useState } from 'react';
import SearchBar from '../SearchBar/SearchBar'
import css from "./App.module.css"
import toast, { Toaster } from "react-hot-toast";
import { fetchMovies }  from "../../services/movieService";
import type { Movie } from '../../types/movie';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';
function App() {
const [query, setQuery]=useState("")
  const [page, setPage] = useState(1)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

  const {data, isLoading, isError, isSuccess } = useQuery({
    queryKey:["myQueryKey", query, page],
    queryFn:  () => fetchMovies(query, page),
    enabled: query !== "",
    placeholderData: keepPreviousData
  })
  useEffect(() => {
    if (data?.results.length === 0) {
       toast.error("No movies found for your request.")
    }
    return;
  },[data, isSuccess])

const totalPages = data?.total_pages ?? 0
 
  const handleSubmit = (newQuery: string) => {
    setQuery(newQuery)
    setPage(1)
    setSelectedMovie(null)
  }
 function onSelect(movie: Movie): void {
   setIsModalOpen(true)
   setSelectedMovie(movie)
  }
  function closeModal() {
    setSelectedMovie(null)
    setIsModalOpen(false)
  }
  return (
    <div className={css.app}>
      <SearchBar onSubmit={handleSubmit} />
      <Toaster />
      { isSuccess && data?.results.length > 0 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />)}
      {isLoading && <Loader />}
        {isError && <ErrorMessage/>}
      {data && data.results.length > 0 && <MovieGrid onSelect={onSelect} movies={data?.results} />}
      {isModalOpen && selectedMovie &&  (
        <MovieModal movie={selectedMovie} onClose={closeModal}/>
      )}
      </div>
  )
}

export default App
