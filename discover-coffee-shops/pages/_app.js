import "../styles/globals.css";

// it's an entry point in our application
// it provides a wrapper that surrounds all the pages
// it's initialized once it's available throughout our application.
function MyApp({ Component, pageProps }) {
  // return <Component {...pageProps} />;
  return (
    <div>
      <Component {...pageProps} />
      <footer>
        <p>© 2022 - Coffee Discovering</p>
      </footer>
    </div>
  );
}

export default MyApp;
