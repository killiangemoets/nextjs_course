import { Magic } from "magic-sdk";

// We get an error, "window is not defined", bc this code is going to run on the server side and on the client side. However, there is no window on the server side. So when window is undefined we dont wanna do anything, but if it is defined, then we wan to return the Magic instance
const createMagic = () => {
  return (
    typeof window !== "undefined" &&
    new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLISHABLE_API_KEY)
  );
};

export const magic = createMagic();
