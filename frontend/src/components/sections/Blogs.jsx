import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeading from '../ui/SectionHeading';
import ArticleCard from '../ui/ArticleCard';
import LiveBadge from '../ui/LiveBadge';
import { useArticles } from '../../hooks/useFeeds';

/** Overall state of the live sources: any 'live' wins, else still loading, else offline. */
export const overallStatus = (status) => {
  const v = Object.values(status);
  return v.includes('live') ? 'live' : v.includes('loading') ? 'loading' : 'offline';
};

export default function Blogs() {
  const { articles, status } = useArticles();
  const top = articles.slice(0, 3);

  return (
    <section id="blogs" className="section-padding">
      <SectionHeading
        index="06"
        label="Writing"
        title={<>Latest <span className="gradient-text">articles</span></>}
        lead="Notes on cloud, DevOps, Terraform and the engineering problems I run into, from Medium, DEV and AWS Builder Center."
        aside={<LiveBadge status={overallStatus(status)} liveLabel="checked live just now" staticLabel="bundled at last build" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {top.map((article, i) => (
          <motion.div key={article.link} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
            <ArticleCard article={article} />
          </motion.div>
        ))}
      </div>

      <div className="mt-10">
        <Link to="/blogs" className="btn-primary inline-flex" style={{ width: 'fit-content' }}>
          <span className="btn-icon"><ArrowRight className="w-4 h-4" /></span>
          All {articles.length} articles
        </Link>
      </div>
    </section>
  );
}
