import Card from "./card";
import styles from "./section-cards.module.css";
import Link from "next/link";
import cls from "classnames";

const SectionCards = (props) => {
  const { title, videos = [], size, shouldWrap, shouldScale } = props;
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={cls(styles.cardWrapper, shouldWrap && styles.wrap)}>
        {videos.map((video, i) => {
          return (
            <Link href={`/video/${video.id}`}>
              <a>
                <Card
                  key={i}
                  imgUrl={video.imgUrl}
                  size={size}
                  id={i}
                  shouldScale={shouldScale}
                />
              </a>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default SectionCards;
