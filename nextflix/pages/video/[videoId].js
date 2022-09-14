import { useRouter } from "next/router";
import Modal from "react-modal";
import styles from "../../styles/Video.module.css";
import Navbar from "../../components/nav/navbar";
import clsx from "classnames";
import { getYoutubeVideoById } from "../../lib/video";

import Like from "../../components/icons/like-icon";
import DisLike from "../../components/icons/dislike-icon";
import { useState } from "react";

Modal.setAppElement("#__next");

export async function getStaticProps(staticProps) {
  // const video = {
  //   title: "Hi cute dog",
  //   publishTime: "1990-01-01",
  //   description: "A big red dog that is super cute, can he get any bigger? ",
  //   channelTitle: "Paramount Pictures",
  //   viewCount: 10000,
  // };

  const videoId = staticProps.params.videoId;

  const videoArr = await getYoutubeVideoById(videoId);
  // const res = await fetch("https://.../posts");
  // const posts = await res.json();

  return {
    props: {
      video: videoArr.length > 0 ? videoArr[0] : {},
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10, // In seconds
  };
}

export async function getStaticPaths() {
  // const res = await fetch("https://.../posts");
  // const posts = await res.json();

  const listOfVideos = ["mYfJxlgR2jw", "4zH5iYM4wJo", "KCPEHsAViiQ"];
  const paths = listOfVideos.map((videoId) => ({
    params: { videoId },
  }));
  // We'll pre-render only these paths at build time.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: "blocking" };
}

const Video = ({ video }) => {
  const router = useRouter();
  //   console.log({ router });

  const {
    title,
    publishTime,
    description,
    channelTitle,
    statistics: { viewCount } = { viewCount: 0 },
  } = video;

  const [toggleLike, setToggleLike] = useState(false);
  const [toggleDisLike, setToggleDisLike] = useState(false);

  const handleToggleLike = () => {
    setToggleLike(!toggleLike);
    setToggleDisLike(toggleLike);
  };
  const handleToggleDisLike = () => {
    setToggleDisLike(!toggleDisLike);
    setToggleLike(toggleDisLike);
  };
  return (
    <div className={styles.container}>
      {/* video page {router.query.videoId} */}
      <Navbar />
      <Modal
        isOpen={true}
        contentLabel="Watch the video"
        onRequestClose={() => router.back()}
        overlayClassName={styles.overlay}
        className={styles.modal}
      >
        <div className={styles.iframeWrapper}>
          <iframe
            id="ytplayer"
            className={styles.videoPlayer}
            type="text/html"
            width="100%"
            height="360"
            src={`https://www.youtube.com/embed/${router.query.videoId}?autoplay=0&origin=http://example.com&controls=0&rel=0`}
            frameborder="0"
          ></iframe>

          <div className={styles.likeDislikeBtnWrapper}>
            <div className={styles.likeBtnWrapper}>
              <button onClick={handleToggleLike}>
                <div className={styles.btnWrapper}>
                  <Like selected={toggleLike} />
                </div>
              </button>
            </div>
            <button onClick={handleToggleDisLike}>
              <div className={styles.btnWrapper}>
                <DisLike selected={toggleDisLike} />
              </div>
            </button>
          </div>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.modalBodyContent}>
            <div className={styles.col1}>
              <p className={styles.publishTime}>{publishTime}</p>
              <p className={styles.title}>{title}</p>
              <p className={styles.description}>{description}</p>
            </div>
            <div className={styles.col2}>
              <p className={clsx(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>Cast: </span>
                <span className={styles.channelTitle}>{channelTitle}</span>
              </p>
              <p className={clsx(styles.subText, styles.subTextWrapper)}>
                <span className={styles.textColor}>View Count: </span>
                <span className={styles.channelTitle}>{viewCount}</span>
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Video;
