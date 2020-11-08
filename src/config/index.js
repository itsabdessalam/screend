const config = {
  BASE_API_URL: process.env.VUE_APP_BASE_API_URL,
  BASE_IMAGE_URL: "https://image.tmdb.org/t/p",
  DEFAULT_API_LOCALE: "en-US",
  MAX_REQUESTS_NUMBER: 15,
  MIN_MOVIE_YEAR: 1888,
  SORT_BY_FILTERS: {
    POPULARITY: [
      {
        value: "popularity.desc",
        label: "Most popular"
      },
      {
        value: "popularity.asc",
        label: "Least popular"
      }
    ],
    PRIMARY_RELEASE_DATE: [
      {
        value: "primary_release_date.desc",
        label: "Most recent"
      },
      {
        value: "primary_release_date.asc",
        label: "Oldest"
      }
    ],
    VOTE_AVERAGE: [
      {
        value: "vote_average.desc",
        label: "Highest rate"
      },
      {
        value: "vote_average.asc",
        label: "Lowest rate"
      }
    ],
    VOTE_COUNT: [
      {
        value: "vote_count.desc",
        label: "Most ratings"
      },
      {
        value: "vote_count.asc",
        label: "Least ratings"
      }
    ]
  },
  MOVIES_SECTIONS: [
    {
      title: "Latest",
      filters: [{ name: "sortBy", value: "primary_release_date.desc" }]
    },
    {
      title: "Trending now",
      filters: [{ name: "sortBy", value: "popularity.desc" }]
    },
    {
      title: "Most watched",
      filters: [{ name: "sortBy", value: "vote_count.desc" }]
    },
    {
      title: "Upcoming",
      filters: [
        { name: "sortBy", value: "primary_release_date.asc" },
        { name: "includeUpcoming", value: true },
        { name: "upcomingOnly", value: true }
      ]
    }
  ],
  GO_BACK_ROUTES: {
    HOME: {
      name: "home",
      path: "/"
    },
    MOVIES: {
      name: "movies",
      path: "/movies"
    },
    WATCHLIST: {
      name: "watchlist",
      path: "/watchlist"
    }
  }
};

/**
 * We need both versions for different calls:
 * V4 for the auth of the user because account requests require a account_id that we can only have with V4
 * V3 for the rest (watchlists, movies...)
 */
config.BASE_API_URL_V3 = `${config.BASE_API_URL}/3`;
config.BASE_API_URL_V4 = `${config.BASE_API_URL}/4`;

config.IMAGES_SIZES = {
  backdrop: "w342",
  poster: "w342",
  profile: "w185",
  default: "orignal"
};

config.DEFAULT_SORT_BY_FILTER = config.SORT_BY_FILTERS.POPULARITY[0];

config.DEFAULT_FILTERS = {
  includeUpcoming: false,
  upcomingOnly: false,
  selectedGenres: [],
  selectedYear: null,
  sortBy: config.DEFAULT_SORT_BY_FILTER
};

module.exports = config;
