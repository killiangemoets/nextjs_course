import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { magic } from "../lib/magic-client";
import "../styles/globals.css";

import Loading from "../components/loading/loading";

function MyApp({ Component, pageProps }) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const handleIsLoggin = async () => {
      const isLoggedIn = await magic.user.isLoggedIn();
      if (isLoggedIn) {
        // setIsLoading(false);
        router.push("/");
      } else {
        // setIsLoading(false);
        router.push("/login");
      }
    };
    handleIsLoggin();
  }, []);

  useEffect(() => {
    const handleComplete = () => {
      setIsLoading(false);
    };
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return isLoading ? <Loading /> : <Component {...pageProps} />;

  // return <Component {...pageProps} />;
}

export default MyApp;
