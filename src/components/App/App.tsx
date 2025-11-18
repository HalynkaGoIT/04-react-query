import { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";

import type { Movie } from "../../types/movie";

import fetchMovies from "../../services/movieService";
import ReactPaginate from "react-paginate";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

import css from "./App.module.css";

export default function App() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectMovie, setSelectedMovie] = useState<Movie | null>(null);
  
  const { data, isSuccess, isLoading, isError } = useQery({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query !== '',
    placeHolderData: keepPreviousData,
  });

  useEffect(() => {
    if (data?.results.length === 0) {
      toast.error("No movies found for your request.");
    }
  }, [data]);

const totalPages = data?.total_pages ?? 0;

const openModal = (movie: Movie) => {
  setSelectedMovie(movie);
}

const closeModal = () => {
  setSelectedMovie(null);
}

  const handleSearch = async (newQuery: string) => {
  setQuery(newQuery);
  setPage(1);
};

return (
  <div className={css.app}>
    <SearchBar onSubmit={handleSearch} />
    {isSuccess && totalPages > 1 && (
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
      />
    )}
    <Toaster />
    {isLoading && <Loader />}
    {isError && <ErrorMessage />}
    {data && <MovieGrid
      onSelect={openModal}
      movies={data.results} />}
    {selectedMovie && (
      <MovieModal
        movie={selectedMovie}
        onClose={closeModal} />
    )}
        </div>
)
}
