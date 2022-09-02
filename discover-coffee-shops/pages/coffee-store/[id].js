import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import cls from "classnames";

import useSWR from "swr";

// import coffeeStoresData from "../../data/coffee-stores.json";

import styles from "../../styles/coffee-store.module.css";
import { fetchCoffeeStores } from "../../lib/coffee-store";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../store/store-context";
import { isEmpty } from "../../utils";

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

const CoffeeStore = (initialProps) => {
  const router = useRouter();
  // console.log("router", router, router.query.id);
  // console.log(initialProps);

  // Without router.isFallback if the id is not in the paths, Next.js won't call the getStaticProps function and initialProps.coffeeStore will be undefined
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const id = router.query.id;

  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);

  // const { address, name, imgUrl, neighborhood } = initialProps.coffeeStore;
  const { address, name, imgUrl, neighborhood } = coffeeStore;

  const [votingCount, setVotingCount] = useState(0);

  const fetcher = (url) => fetch(url).then((res) => res.json());

  //why using SWR? When a user upvote a coffee store, all the other users on the same page will also see the coffe store has been upvoted, i.e when a user (from somewhere) upvote a coffee store, the data are refreshed
  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);
  // console.log("DATA", data);

  useEffect(() => {
    if (data && data.length > 0) {
      // console.log("data from SWR", data);
      setCoffeeStore(data[0]);
      setVotingCount(data[0].voting);
    }
  }, [data]);

  if (error) {
    return <div>Something went wrong retrieving coffee store page</div>;
  }

  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  const handleCreateCoffeeStore = async (coffeeStore) => {
    try {
      const { id, name, neighborhood, address, imgUrl, voting } = coffeeStore;
      const response = await fetch("/api/createCoffeeStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          neighborhood: neighborhood || "",
          address: address || "",
          imgUrl,
          voting: 0,
        }),
      });

      const dbCoffeeStore = await response.json();
      // console.log(dbCoffeeStore);
    } catch (err) {
      console.log("Error creating coffee store", err);
    }
  };

  useEffect(() => {
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const coffeeStoreFromContext = coffeeStores.find((coffeeStore) => {
          return coffeeStore.id.toString() === id; //dynamic id
        });
        if (coffeeStoreFromContext) {
          setCoffeeStore(coffeeStoreFromContext);
          handleCreateCoffeeStore(coffeeStoreFromContext);
        }
      }
    } else {
      //SSG
      handleCreateCoffeeStore(initialProps.coffeeStore);
    }
  }, [id, initialProps, initialProps.coffeeStore]);

  const handleUpvoteButton = async () => {
    setVotingCount((count) => count + 1);
    try {
      const response = await fetch("/api/favouriteCoffeeStoreById", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const dbCoffeeStore = await response.json();
      // console.log(dbCoffeeStore);

      // if (dbCoffeeStore && dbCoffeeStore.length > 0) {
      // setVotingCount((count) => count + 1);
      // }
    } catch (err) {
      console.log("Error upvoting the coffee store", err);
    }
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
              <p className={styles.text}>{neighborhood}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image src="/static/icons/star.svg" width="24" height="24" />
            <p className={styles.text}>{votingCount}</p>
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
