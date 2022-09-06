import Card from "./card";
import styles from "./section-cards.module.css";

const SectionCards = (props) => {
  const { title, videos = [], size } = props;
  return (
    <section className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.cardWrapper}>
        {videos.map((video, i) => {
          return <Card key={i} imgUrl={video.imgUrl} size={size} id={i} />;
        })}
      </div>
    </section>
  );
};

export default SectionCards;
