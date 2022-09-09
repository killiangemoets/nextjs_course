import Card from "./card";
import styles from "./section-cards.module.css";
import Link from "next/link";

const SectionCards = (props) => {
  const { title, videos = [], size } = props;
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.cardWrapper}>
        {videos.map((video, i) => {
          return (
            <Link href={`/video/${video.id}`}>
              <a>
                <Card key={i} imgUrl={video.imgUrl} size={size} id={i} />
              </a>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default SectionCards;
