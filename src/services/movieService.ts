import axios from "axios";
import type { Movie } from "../types/movie";

const myToken = import.meta.env.VITE_TMDB_TOKEN;

export interface MovieHTTPResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

export default async function fetchMovies(topic: string, page: number): Promise<MovieHTTPResponse> {
  const response = await axios.get<MovieHTTPResponse>(
    "https://api.themoviedb.org/3/search/movie",
    {
      params: { query: topic, page },
      headers: {
        Authorization: `Bearer ${myToken}`,
      },
    },
  );
  
  console.log(response.data);
  return response.data;
}
