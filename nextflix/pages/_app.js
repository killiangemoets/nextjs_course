import { useRouter } from "next/router";
import { useEffect } from "react";
import { magic } from "../lib/magic-client";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  useEffect(() => {
    const handleIsLoggin = async () => {
      const isLoggedIn = await magic.user.isLoggedIn();
      if (isLoggedIn) {
        router.push("/");
      } else {
        router.push("/login");
      }
    };
    handleIsLoggin();
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
