import themoviedb from "../lib/themoviedb";
import { useEffect, useState } from "react";
import AppTable from "../components/AppTable";

import StarIcon from "@material-ui/icons/Star";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import Typography from "@material-ui/core/Typography";

function Movies() {
  const [columns, setColumns] = useState();

  const [rows, setRows] = useState();
  const [page, setPage] = useState(0);

  const [sort, setSort] = useState("popularity.desc");

  const imgUrl = themoviedb.common.images_uri;

  const starClick = (id) => {
    let stars = localStorage.getItem("stars");

    if (stars) {
      let newStars = JSON.parse(stars);

      if (!newStars.includes(id)) {
        newStars.push(id);
      } else {
        newStars.splice(newStars.indexOf(id), 1);
      }

      localStorage.setItem("stars", JSON.stringify(newStars));
    } else {
      localStorage.setItem("stars", JSON.stringify([id]));
    }

    getMovies(page + 1);
  };

  const starred = (id) => {
    let stars = localStorage.getItem("stars");

    if (stars && JSON.parse(stars).includes(id)) {
      return true;
    }
    return false;
  };

  const getMovies = (page = 1, sort_by = sort) => {
    themoviedb.discover.getMovies(
      { page, sort_by },
      (data) => {
        var res = JSON.parse(data);
        var movies = res.results;

        setRows(
          movies.map(
            ({ poster_path, title, vote_average, release_date, id }, ind) => {
              return {
                poster_path: poster_path ? (
                  <img
                    height={100}
                    width={100}
                    src={imgUrl + "original" + poster_path}
                  />
                ) : (
                  "Image not found"
                ),
                title: (
                  <a
                    href={"https://www.themoviedb.org/movie/" + id}
                    target="_blank"
                  >
                    {title}
                  </a>
                ),
                vote_average,
                release_date: release_date
                  ? release_date.slice(0, 4)
                  : "Date not found",
                id: <StarIcon onClick={() => starClick(id)} />,
                code: "code" + ind,
                starred: starred(id),
                uid: id,
              };
            }
          )
        );
        setPage(res.page - 1);
      },
      (error) => {
        console.error(error);
      }
    );
  };

  useEffect(() => {
    getMovies();
  }, []);

  useEffect(() => {
    if (rows?.length) {
      setColumns([
        {
          id: "poster_path",
          label: "Image",
          minWidth: 85,
        },
        {
          id: "title",
          label: (
            <i title="Sorts by Popularity">
              {sort === "popularity.desc" ? (
                <ArrowUpwardIcon
                  fontSize="small"
                  onClick={() => setSort("popularity.asc")}
                />
              ) : (
                <ArrowDownwardIcon
                  fontSize="small"
                  onClick={() => setSort("popularity.desc")}
                />
              )}
              Title
            </i>
          ),
          minWidth: 85,
        },
        { id: "vote_average", label: "Current Rating", minWidth: 85 },
        {
          id: "release_date",
          label: "Year",
          minWidth: 85,
        },

        {
          id: "id",
          label: "Star",
          minWidth: 85,
        },
      ]);
    }
  }, [rows, sort]);

  useEffect(() => {
    getMovies(page + 1);
  }, [page]);

  useEffect(() => {
    getMovies(page + 1);
  }, [sort]);

  return (
    <div>
      <Typography variant="h6" color="primary" noWrap>
        TMDB 500 <small>(Sorts by Popularity)</small>
      </Typography>
      {rows && rows.length ? (
        <AppTable
          columns={columns}
          rows={rows}
          page={page}
          setPage={setPage}
          setSort={setSort}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Movies;
