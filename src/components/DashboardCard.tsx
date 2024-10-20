// Card.tsx
import React from 'react';
import { motion } from 'framer-motion';
// import { FaMoneyBillWave } from "react-icons/fa";
import { GoArrowUpRight, GoGraph } from "react-icons/go";

interface CardProps {
  title: string;
  amount: string;
  increase: string;
  iconColor: string;
  iconColr_right: string;
  icon: React.ReactNode;
  delay: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const iconAnimation = {
  initial: { scale: 0.7 },
  animate: { scale: 1, transition: { duration: 0.5} },
};

const DashboardCard: React.FC<CardProps> = ({ title, amount, increase, iconColor, iconColr_right, icon, delay }) => {
  return (
    <div className='bg-white shadow-sm rounded-md p-6 pb-4'>
      <motion.div 
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, delay }}
        className='grid grid-cols-[6fr_1fr]'
      >
        <div className='flex flex-col'>
          <div className='flex justify-between'>
            <div className='flex gap-1 font-[500] items-center'>
              <div>
                <motion.div 
                  className={`p-2 ${iconColor} rounded-xl text-2xl text-white`}
                  variants={iconAnimation}
                  initial="initial"
                  animate="animate"
                >
                  {icon}
                </motion.div>
              </div>
              <span className='text-[1.1rem]'>{title}</span>
            </div>
          </div>
          <div className='font-bold text-[1.4rem] mt-2 text-green'>{amount}</div>
          <div className='flex gap-1 items-center mt-4'>
            <div className={`${iconColor} p-[0.1rem] rounded-full text-white`}>
              <GoArrowUpRight />
            </div>
            <span className='text-[1rem]'>{increase}</span>
          </div>
        </div>
        <div>
          <motion.div
            className={`text-[3rem] ${iconColr_right}`}
            variants={iconAnimation}
            initial="initial"
            animate="animate"
          >
            <GoGraph />
          </motion.div>
        </div>
      </motion.div>

    </div>
  );
};

export default DashboardCard;
