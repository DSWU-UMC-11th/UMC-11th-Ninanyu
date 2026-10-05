import type { Movie } from "../../types/movie";
import { MovieCard } from "./movie-card";

interface MovieGridProps {
  movies: Movie[];
}

export function MovieGrid({ movies }: MovieGridProps) {
  return (
    <ul className="grid grid-cols-1 justify-items-center gap-x-5 gap-y-[19px] min-[561px]:grid-cols-[repeat(2,242px)] min-[841px]:grid-cols-[repeat(3,242px)] min-[1101px]:grid-cols-[repeat(5,242px)]">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </ul>
  );
}