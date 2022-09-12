import { magicAdmin } from "../../lib/magic";
import jwt from "jsonwebtoken";

export default async function login(req, res) {
  if (req.method === "POST") {
    try {
      //get the token
      const auth = req.headers?.authorization;
      const didToken = auth ? auth.substr(7) : "";
      console.log({ didToken });

      //invoke magics
      const metadata = await magicAdmin.users.getMetadataByToken(didToken);
      console.log({ metadata });

      // create jwt
      const token = jwt.sign(
        {
          ...metadata,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
          "https://hasura.io/jwt/claims": {
            "x-hasura-allowed-roles": ["user", "admin"],
            "x-hasura-default-role": "user",
            "x-hasura-user-id": `${metadata.issuer}`,
          },
        },
        "thisisasecreeeeeeeet11263163366137Bssddfger1344234"
      );
      console.log({ token });

      res.send({ done: true });
    } catch (error) {
      console.log("something went wrong logging in", error);
      res.status(500).send({ done: false });
    }
  } else {
    res.send({ done: false });
  }
}
