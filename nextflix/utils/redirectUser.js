import { verifyToken } from "../lib/utils";

// Hook to redirect a user
export const redirectUser = async (context) => {
  const token = context.req ? context.req.cookies?.token : null;
  const userId = await verifyToken(token);
  //   const userId = null;

  return {
    userId,
    token,
  };
};
