import type { BlogRow } from '@/lib/2027/blog';

export default function News({ posts, total }: { posts: BlogRow[]; total: number }) {
  return (
    <section className="news" id="news" aria-labelledby="news-title">
      <div className="news__head">
        <h2 id="news-title" className="news__title">
          <span className="mask" data-reveal="rise">
            <span>
              Blog<sup>{total}</sup>
            </span>
          </span>
        </h2>
        <p className="news__intro" data-reveal="fade">
          Design strategies that work for enterprise companies, written by Daksh.
        </p>
      </div>
      <ul className="news__list">
        {posts.map((n) => (
          <li key={n.slug} className="news__row">
            {/* A row, not a link: the articles are still on the old design. */}
            <div className="news__link is-static">
              <span className="news__type">{n.kind}</span>
              <span className="news__name">{n.title}</span>
              <span className="news__meta">{n.date}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
