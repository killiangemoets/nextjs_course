import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import cls from "classnames";

// import coffeeStoresData from "../../data/coffee-stores.json";

import styles from "../../styles/coffee-store.module.css";
import { fetchCoffeeStores } from "../../lib/coffee-store";

export async function getStaticProps(staticProps) {
  const params = staticProps.params;
  // console.log(" render params", params);
  // console.log("coffeeStoresData", coffeeStoresData);

  const coffeeStoresAPIData = await fetchCoffeeStores();

  const findCoffeeStoryById = coffeeStoresAPIData.find((coffeeStore) => {
    return coffeeStore.id.toString() === params.id; //dynamic id
  });

  return {
    props: {
      // coffeeStore: coffeeStoresData.find((coffeeStore) => {
      //   return coffeeStore.id.toString() === params.id; //dynamic id
      // }),
      coffeeStore: findCoffeeStoryById || {},
    },
  };
}

// getStaticPaths are only for dynamic routes.
// it allows us to define a list of paths to be rendered to html at build time
// getStaticPaths:
// - only run at build time
// - only run on server side
// - won't be included in client side bundle
// - on dev mode, runs on client and server side
export async function getStaticPaths() {
  // const paths = coffeeStoresData.map((coffeeStore) => {
  //   return { params: { id: coffeeStore.id.toString() } };
  // });
  const coffeeStoresAPIData = await fetchCoffeeStores();
  const paths = coffeeStoresAPIData.map((coffeeStore) => {
    return { params: { id: coffeeStore.id.toString() } };
  });
  return {
    // paths: [
    //   { params: { id: "0" } },
    //   { params: { id: "1" } },
    // ],
    paths,
    // fallback: false,
    fallback: true,
  };
}
// We need to add a fallback. It will tell Next.js what to do if it cannnot find a path.
// If fallback: false, when Next.j cannot find the content, it will return a 404 page

const CoffeeStore = (props) => {
  const router = useRouter();
  // console.log("router", router, router.query.id);
  // console.log(props);

  // Without router.isFallback if the id is not in the paths, Next.js won't call the getStaticProps function and props.coffeeStore will be undefined
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const { address, name, imgUrl, neighborhood } = props.coffeeStore;

  const handleUpvoteButton = () => {
    console.log("handle upvote");
  };

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>
      {/* Coffee Store Page {router.query.id} */}
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a>← Back to home</a>
              {/* we use the a anchor just for the browser to recognize that this is a link */}
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={imgUrl}
            width={600}
            height={360}
            className={styles.storeImg}
            alt={name}
          />
        </div>
        <div className={cls("glass", styles.col2)}>
          {address && (
            <div className={styles.iconWrapper}>
              <Image src="/static/icons/place.svg" width="24" height="24" />
              <p className={styles.text}>{address}</p>
            </div>
          )}
          {neighborhood && (
            <div className={styles.iconWrapper}>
              <Image src="/static/icons/nearMe.svg" width="24" height="24" />
              <p>{neighborhood}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/star.svg" width="24" height="24" />
            <p>10</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;

// NEXT_PUBLIC_FOURSQUARE_API_KEY2 = fsq3IV+EwGo72thjf6Ln8SjlR0mz33pt4qrv29pF/SPuADg=
