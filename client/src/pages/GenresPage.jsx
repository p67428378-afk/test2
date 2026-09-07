import React from "react";
import { useNavigate } from "react-router-dom";
import GenreDirectory from "../components/genres/GenreDirectory";

const GenresPage = ({ setSelectedGenre }) => {
  const navigate = useNavigate();

  const handleSelectGenreAndNavigate = (genreCode) => {
    if (setSelectedGenre) {
      setSelectedGenre(genreCode);
    }
    navigate("/");
  };

  return (
    <GenreDirectory onSelectGenreAndNavigate={handleSelectGenreAndNavigate} />
  );
};

export default GenresPage;
