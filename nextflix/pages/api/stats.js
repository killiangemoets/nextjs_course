import jwt from "jsonwebtoken";

export default async function stats(req, res) {
  if (req.method === "POST") {
    console.log({ cookies: req.cookies });

    try {
      const token = req.cookies.token;
      if (!token) {
        // 403 stands for forbidden (i.e. the client doesn't have access rights to the content)
        res.status(403).send({});
      } else {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log({ decoded });
        res.send({ msg: "it works", decoded });
      }
    } catch (error) {
      console.error("Error occurred /stats", error);
      res.status(500).send({ done: false, error: error?.message });
    }
  }
}
