import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";

import coffeeStoresData from "../../data/coffee-stores.json";

export function getStaticProps(staticProps) {
  const params = staticProps.params;
  // console.log(" render params", params);
  // console.log("coffeeStoresData", coffeeStoresData);
  return {
    props: {
      coffeeStore: coffeeStoresData.find((coffeeStore) => {
        return coffeeStore.id.toString() === params.id; //dynamic id
      }),
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
export function getStaticPaths() {
  const paths = coffeeStoresData.map((coffeeStore) => {
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

  const { address, name, neighbourhood } = props.coffeeStore;

  return (
    <div>
      <Head>
        <title>{name}</title>
      </Head>
      {/* Coffee Store Page {router.query.id} */}
      <Link href="/">
        <a>Back to home</a>
        {/* we use the a anchor just for the browser to recognize that this is a link */}
      </Link>
      <p>{address}</p>
      <p>{name}</p>
      <p>{neighbourhood}</p>
    </div>
  );
};

export default CoffeeStore;
