import Image from "next/image";
import Link from "next/link";
import { Movie } from "@/types/movie";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link
      href={`/movie/${movie.id}`}
      className="group relative overflow-hidden rounded-lg bg-gray-900 transition-transform duration-300 hover:scale-105"
    >
      <div className="aspect-[2/3] relative">
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-0 p-4 text-white">
          <h2 className="text-lg font-bold">{movie.title}</h2>
          <p className="text-sm text-gray-300">
            ⭐ {movie.vote_average.toFixed(1)}
          </p>
        </div>
      </div>
    </Link>
  );
}
