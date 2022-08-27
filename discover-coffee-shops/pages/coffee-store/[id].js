import { useRouter } from "next/router";
import Link from "next/link";

const CoffeeStore = () => {
  const router = useRouter();
  console.log("router", router, router.query.id);
  return (
    <div>
      Coffee Store Page {router.query.id}
      <Link href="/">
        <a>Back to home</a>
        {/* we use the a anchor just for the browser to recognize that this is a link */}
      </Link>
      <Link href="/coffee-store/123">
        <a>Go to Dynamic Page</a>
      </Link>
    </div>
  );
};

export default CoffeeStore;
