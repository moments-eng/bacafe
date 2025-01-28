import { motion } from "framer-motion";
import { hebrewContent } from "@/locales/he";

const { dailyDigest } = hebrewContent;

export function DigestCompletionMessage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <h3 className="text-xl font-bold mb-2">{dailyDigest.completion.title}</h3>
      <p className="text-muted-foreground">{dailyDigest.completion.message}</p>
    </motion.div>
  );
}
