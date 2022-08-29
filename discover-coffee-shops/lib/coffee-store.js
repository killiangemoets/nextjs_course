import { createApi } from "unsplash-js";

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const getUrlForCoffeeStore = (latLong, query, limit) => {
  //   return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong[0]}%2C${latLong[1]}&limit=${limit}`;

  //   return `https://api.foursquare.com/v2/venues/search?query=${query}&client_id=${process.env.NEXT_PUBLIC_FOURSQUARE_CLIENT_ID}$client_secret=${process.env.NEXT_PUBLIC_FOURSQUARE_CLIENT_SECRET}&v=20220829&ll=${latLong[0]}%2C${latLong[1]}&limit=${limit}`;

  return `https://api.foursquare.com/v2/venues/search?ll=${latLong.join(
    ","
  )}&client_id=${process.env.NEXT_PUBLIC_FOURSQUARE_CLIENT_ID}&client_secret=${
    process.env.NEXT_PUBLIC_FOURSQUARE_CLIENT_SECRET
  }&v=20220829&limit=${limit}&query=${query}`;
};

const getListOfCoffeeStoresPhotos = async () => {
  const photos = await unsplash.search.getPhotos({
    query: "coffee shop",
    perPage: 40,
  });
  //   console.log(photos);
  const unsplashResults = photos.response.results.map(
    (result) => result.urls["small"]
  );
  //   console.log(unsplashResults[0]);

  return unsplashResults;
};

export const fetchCoffeeStores = async (
  latLong = [43.65, -79.38],
  limit = 6
) => {
  const photos = await getListOfCoffeeStoresPhotos();

  //   const options = {
  //     method: "GET",
  //     // mode: "no-cors",
  //     headers: {
  //       Accept: "application/json",
  //       Authorization: "fsq3KLm4Zw8FmT8RiJS9h7TtqrUYJOQU1XG70OTF6DS37Hk=",
  //       //   "Access-Control-Allow-Origin": "*",
  //     },
  //   };
  //   const response = await fetch(getUrlForCoffeeStore(latLong, "coffee", limit),options);

  const response = await fetch(getUrlForCoffeeStore(latLong, "coffee", limit));

  const data = await response.json();

  console.log("=======DATA======");
  console.log(data);
  console.log("=======DATA======");

  return data?.results
    ? data.results.map((result, i) => {
        return {
          //   ...result,
          id: result.fsq_id,
          name: result.name,
          address: result.location.address,
          neighborhood:
            result.location.neighborhood.length > 0
              ? result.location.neighborhood[0]
              : "",
          imgUrl: photos.length > 0 ? photos[i] : null,
        };
      })
    : [];
};
