import cookie from "cookie";

const MAX_AGE = 7 * 24 * 60 * 60;

// NOTE: the cookie storage model specification states that if both expires and maxAge are set, then maxAge takes precedence, but it is possible not all clients by obey this, so if both are set, they should point to the same date and time.
export const setTokenCookie = (token, res) => {
  const setCookie = cookie.serialize("token", token, {
    maxAge: MAX_AGE,
    expires: new Date(Date.now() + MAX_AGE * 1000),
    secure: process.env.NODE_ENV === "prodcution",
    path: "/",
  });

  //in production, we set the cookie only if we have an https connection

  res.setHeader("Set-Cookie", setCookie);
};

export const removeTokenCookie = (res) => {
  const val = cookie.serialize("token", "", {
    maxAge: -1,
    path: "/",
  });

  res.setHeader("Set-Cookie", val);
};
