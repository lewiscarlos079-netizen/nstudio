import { Layout } from '@/components/layout/Layout';
import { ClubSubscription } from '@/components/subscription/ClubSubscription';
import { motion } from 'framer-motion';

export default function Subscription() {
  return (
    <Layout>
      <div className="min-h-[calc(100vh-4rem)] p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          <ClubSubscription />
        </motion.div>
      </div>
    </Layout>
  );
}
