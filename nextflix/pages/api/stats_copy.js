import jwt from "jsonwebtoken";
import {
  findVideoIdByUser,
  insertStats,
  updateStats,
} from "../../lib/db/hasura";

export default async function stats(req, res) {
  if (req.method === "POST") {
    // console.log({ cookies: req.cookies });

    try {
      const token = req.cookies.token;
      if (!token) {
        // 403 stands for forbidden (i.e. the client doesn't have access rights to the content)
        res.status(403).send({});
      } else {
        const { videoId, favourited, watched = true } = req.body;

        if (videoId) {
          const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
          const userId = decodedToken.issuer;

          const findVideo = await findVideoIdByUser(token, userId, videoId);

          const doesStatsExist = findVideo?.length > 0;

          // console.log({ doesStatsExist });
          if (doesStatsExist) {
            // update it
            const response = await updateStats(token, {
              favourited,
              userId,
              watched,
              videoId,
            });

            res.send({ data: response });
          } else {
            // add it
            const response = await insertStats(token, {
              favourited,
              userId,
              watched,
              videoId,
            });
            res.send({ data: response });
          }
        }
      }
    } catch (error) {
      console.error("Error occurred /stats", error);
      res.status(500).send({ done: false, error: error?.message });
    }
  } else {
    // console.log({ cookies: req.cookies });

    try {
      const token = req.cookies.token;
      if (!token) {
        // 403 stands for forbidden (i.e. the client doesn't have access rights to the content)
        res.status(403).send({});
      } else {
        const { videoId } = req.body;

        if (videoId) {
          const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
          const userId = decodedToken.issuer;

          const findVideo = await findVideoIdByUser(token, userId, videoId);

          const doesStatsExist = findVideo?.length > 0;

          // console.log({ doesStatsExist });
          if (doesStatsExist) {
            res.send(findVideo);
          } else {
            res.status(404).send({ user: null, msg: "Video not found" });
          }
        }
      }
    } catch (error) {
      console.error("Error occurred /stats", error);
      res.status(500).send({ done: false, error: error?.message });
    }
  }
}
