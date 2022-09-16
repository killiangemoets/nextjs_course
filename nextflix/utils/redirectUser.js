import { verifyToken } from "../lib/utils";

// Hook to redirect a user
export const redirectUser = (context) => {
  const token = context.req ? context.req.cookies?.token : null;
  const userId = verifyToken(token);
  //   const userId = null;

  return {
    userId,
    token,
  };
};
