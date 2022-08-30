import "../styles/globals.css";
import StoreProvider from "../store/store-context";

// it's an entry point in our application
// it provides a wrapper that surrounds all the pages
// it's initialized once it's available throughout our application.
function MyApp({ Component, pageProps }) {
  // return <Component {...pageProps} />;
  return (
    <StoreProvider>
      <div>
        <Component {...pageProps} />
        <footer>
          <p>© 2022 - Coffee Discovering</p>
        </footer>
      </div>
    </StoreProvider>
  );
}

export default MyApp;

//_app.js add stuff to the body but can't access the head (or the html document itself)
