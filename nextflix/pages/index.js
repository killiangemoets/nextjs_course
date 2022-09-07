import Head from "next/head";
import Banner from "../components/banner/banner";
import Navbar from "../components/nav/navbar";
import styles from "../styles/Home.module.css";
import SectionCards from "../components/card/section-cards";
import { getPopularVideos, getVideos } from "../lib/video";

import { magic } from "../lib/magic-client";

// SERVER SIDE RENDERING
// - can only be exported from a page file
// - meant for all routes

// getServersideProps:
// - only runs on server side
// - won't be included in client bundle (bc it's oversight code, it's only going to run on the server)
// - on dev, runs on client and server side

// Page is generated on each request
export async function getServerSideProps() {
  // Fetch data from external API
  const disneyVideos = await getVideos("disney trailer");
  const productivityVideos = await getVideos("productivity");
  const travelVideos = await getVideos("travel");
  const popularVideos = await getPopularVideos();

  // Pass data to the page via props
  return {
    props: { disneyVideos, productivityVideos, travelVideos, popularVideos },
  };
}

export default function Home(props) {
  // const disneyVideos = getVideos();
  const { disneyVideos, productivityVideos, travelVideos, popularVideos } =
    props;

  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <Navbar />
        <Banner
          title="Clifford the red dog"
          subTitle="a very cute dog"
          imgUrl="/static/clifford.jpg"
        />
        <div className={styles.sectionWrapper}>
          <SectionCards title="Disney" videos={disneyVideos} size="large" />
          <SectionCards title="Travel" videos={travelVideos} size="small" />
          <SectionCards
            title="Productivity"
            videos={productivityVideos}
            size="medium"
          />
          <SectionCards title="Popular" videos={popularVideos} size="small" />
        </div>
      </div>
    </div>
  );
}
