import { motion } from "framer-motion";

type ExperienceCardProps = {
  company: string;
  role: string;
  period: string;
  logo: string;
  description: string;
};

const ExperienceCard = ({ company, role, period, logo, description }: ExperienceCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md flex gap-4 items-center"
    >
      <img src={logo} alt={company} className="w-14 h-14 object-contain" />
      <div>
        <h3 className="text-lg font-semibold">{role}</h3>
        <p className="text-sm">{company} • {period}</p>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    </motion.div>
  );
};

export default ExperienceCard;