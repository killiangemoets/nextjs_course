import { useRouter } from "next/router";
import Link from "next/link";

const CoffeeStore = () => {
  const router = useRouter();
  console.log("router", router, router.query.id);
  // return <div>Coffee Store Page {router.query.id}</div>;
};

export default CoffeeStore;
