import Head from "next/head";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
// Next.js will download the images as you scroll down

import Banner from "../components/banner";
import Card from "../components/card";
import useTrackLocation from "../hooks/use-track-location";
import { fetchCoffeeStores } from "../lib/coffee-store";
import styles from "../styles/Home.module.css";
import { ACTION_TYPES, StoreContext } from "../store/store-context";

// import coffeeStoresData from "../data/coffee-stores.json";

////// We use STATIC GENERATION (SSG) (with external data) //////
// We will pre-render this content using static generation. To do that, we will download this content in advance and we will store it a CDN.
// Storing in a CDN is taking care of by Next.js, but we need to implement a function that would allow us to store the coffee shops on the CDN
// => So when someone come to the app and try to access these coffee shops, they are going to get the cached version,i.e. the pre-rendered version and Next.js is not going to redownload this data

// If you export a function called getStaticProps (Static Site Generation) from a page, Next.js will pre-render this page at build time using the props returned by getStaticProps.
// getStaticProps:
// - only run at build time
// - only run on server side
// - won't be included in client side bundle
// - on dev mode, runs on client and server side
export async function getStaticProps(context) {
  // console.log("hi from getStaticProps"); // will be seen on the terminal bc it's on the server side

  // BIG NOTE: You should not fetch an API route from "getStaticProps". Instead, you can write the server-side code directly in "getStaticProps'".
  const coffeeStores = await fetchCoffeeStores();

  // console.log(coffeeStores);

  return {
    props: {
      // coffeeStores: coffeeStoresData,
      coffeeStores,
    }, // will be passed to the page component as props
  };
}
// => So we are writing client side and server side code in the same page file.

// it's the default route bc the file is called index
export default function Home(props) {
  // console.log("styles for Home", styles);
  // console.log(props);

  const { handleTrackLocation, locationErrorMsg, isFindingLocation } =
    useTrackLocation();

  // const [coffeeStoresNearMe, setCoffeeStoresNearMe] = useState("");
  const [coffeeStoresError, setCoffeeStoresError] = useState(null);

  const { dispatch, state } = useContext(StoreContext);
  const { coffeeStores: coffeeStoresNearMe, latLong } = state;

  // console.log({ latLong, locationErrorMsg });

  const handleOnBannerBtnClick = () => {
    handleTrackLocation();
  };

  useEffect(() => {
    ////// We use CLIENT SIDE RENDERING (CSR) to render the stores near me //////
    // For that, we have built a brand new API, a serverless funcion called as getCoffeeStoresByLocation
    async function setCoffeeStoreByLocation() {
      if (latLong.length) {
        try {
          // const fetchedCoffeeStores = await fetchCoffeeStores(latLong, 30);
          // We now fetch our backend route that we created
          const response = await fetch(
            `/api/getCoffeeStoresByLocation?latLong=${latLong}&limit=30`
          );

          const fetchedCoffeeStores = await response.json();

          // console.log({ fetchedCoffeeStores });

          // setCoffeeStoresNearMe(fetchedCoffeeStores);
          //set coffee stores
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: { coffeeStores: fetchedCoffeeStores },
          });
          setCoffeeStoresError("");
        } catch (err) {
          //set error
          console.log(err);
          setCoffeeStoresError(err.message);
        }
      }
    }
    setCoffeeStoreByLocation();
  }, [latLong]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        {/* <meta name="description" content="Generated by create next app" /> */}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? "Locating..." : "View stores nearby"}
          handleOnClick={handleOnBannerBtnClick}
        />
        {locationErrorMsg.length > 0 && (
          <p>Something went wrong: {locationErrorMsg}</p>
        )}
        {coffeeStoresError && <p>Something went wrong: {coffeeStoresError}</p>}
        <div className={styles.heroImage}>
          <Image src="/static/hero-image.png" width={700} height={400} />
        </div>

        {coffeeStoresNearMe.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Stores near me</h2>
            <div className={styles.cardLayout}>
              {coffeeStoresNearMe.map((coffeeStore) => {
                return (
                  <Card
                    key={coffeeStore.id}
                    name={coffeeStore.name}
                    imgUrl={
                      coffeeStore.imgUrl ||
                      "https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"
                    }
                    href={`/coffee-store/${coffeeStore.id}`}
                    className={styles.card}
                  />
                );
              })}
            </div>
          </div>
        )}

        {props.coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Toronto stores</h2>
            <div className={styles.cardLayout}>
              {props.coffeeStores.map((coffeeStore) => {
                return (
                  <Card
                    key={coffeeStore.id}
                    name={coffeeStore.name}
                    imgUrl={
                      coffeeStore.imgUrl ||
                      "https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"
                    }
                    href={`/coffee-store/${coffeeStore.id}`}
                    className={styles.card}
                  />
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// In a React app, Javascript is responsible for rendering all the content => so pre-render on an empty page => bad for SEO
// in a Next.js app, the server is responsible for rendering a pre-rendered content => better for SEO
