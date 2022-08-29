import Head from "next/head";
import Image from "next/image";
// Next.js will download the images as you scroll down

import Banner from "../components/banner";
import Card from "../components/card";
import styles from "../styles/Home.module.css";

// import coffeeStoresData from "../data/coffee-stores.json";

////// We use STATIC GENERATION (SSG) (with external data) //////
// We will pre-render this content usigin static generation. To do that, we will download this content in advance and we will store it a CDN.
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

  const options = {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: process.env.FOURSQUARE_API_KEY,
    },
  };

  const response = await fetch(
    "https://api.foursquare.com/v3/places/search?query=coffee&ll=43.65%2C-79.38&limit=6",
    options
  );
  const data = await response.json();
  console.log("======= DATA ======");
  console.log(data);
  console.log("======= END ======");

  return {
    props: {
      // coffeeStores: coffeeStoresData,
      coffeeStores: data?.results || [],
    }, // will be passed to the page component as props
  };
}
// => So we are writing client side and server side code in the same page file.

// it's the default route bc the file is called index
export default function Home(props) {
  // console.log("styles for Home", styles);
  // console.log(props);

  const handleOnBannerBtnClick = () => {
    console.log("click");
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        {/* <meta name="description" content="Generated by create next app" /> */}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText="View stores nearby"
          handleOnClick={handleOnBannerBtnClick}
        />
        <div className={styles.heroImage}>
          <Image src="/static/hero-image.png" width={700} height={400} />
        </div>
        {props.coffeeStores.length > 0 && (
          <>
            <h2 className={styles.heading2}>Toronto stores</h2>
            <div className={styles.cardLayout}>
              {props.coffeeStores.map((coffeeStore) => {
                return (
                  <Card
                    key={coffeeStore.fsq_id}
                    name={coffeeStore.name}
                    imgUrl={
                      coffeeStore.imgUrl ||
                      "https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"
                    }
                    href={`/coffee-store/${coffeeStore.fsq_id}`}
                    className={styles.card}
                  />
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

// In a React app, Javascript is responsible for rendering all the content => so pre-render on an empty page => bad for SEO
// in a Next.js app, the server is responsible for rendering a pre-rendered content => better for SEO
