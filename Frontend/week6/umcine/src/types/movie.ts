/** TMDB 목록 및 상세 응답의 공통 필드 */
export interface TmdbMovie {
  id: number;
  title: string;
  original_title: string;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  vote_average: number;
}

/** TMDB 영화 목록 및 검색 결과 */
export interface TmdbMovieListItem extends TmdbMovie {
  genre_ids: number[];
}

/** TMDB 영화 상세 응답 */
export interface TmdbMovieDetail extends TmdbMovie {
  genres: {
    id: number;
    name: string;
  }[];
  runtime: number | null;
  tagline: string | null;
}

/** API 연결 전 화면 구현용 목업 데이터 */
export interface Movie {
  id: number;
  title: string;
  originalTitle: string;
  releaseDate: string;
  posterPath: string;
  backdropPath: string;
  genres: string[];
  runtime: string;
  tagline: string;
  overview: string;
}
