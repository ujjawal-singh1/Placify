// About.jsx
import React from 'react';
import { FaRocket, FaUsers, FaChartLine, FaLightbulb, FaLaptopCode, FaGlobe, FaAward, FaHandsHelping } from 'react-icons/fa';
import { motion } from 'framer-motion';

const About = () => {
  const stats = [
    { value: '10000', label: 'Active Learners', description: 'Join a vibrant community of learners actively preparing for careers.' },
    { value: '500', label: 'Courses & Resources', description: 'Access a wide range of courses and resources tailored to your needs.' },
    { value: '98', label: 'Satisfaction Rate', description: 'Our learners love us! We strive to maintain a high satisfaction rate.' },
    { value: '24', label: 'Support Available', description: 'Get help whenever you need it with round-the-clock support.' },
  ];

  const teamMembers = [
    { name: 'Biplab Kumar Mondal', role: 'Project Guide', bio: 'Mentor and Advisor from the IT Department', img: 'https://placehold.co/300x300?text=Biplab+Sir', linkedin: 'https://www.linkedin.com/in/biplab-kumar-mondal' },
    { name: 'Ujjawal Kumar', role: 'Frontend Developer', bio: 'React enthusiast and UI designer', img: '/Ujjawal.jpg', linkedin: 'https://www.linkedin.com/in/ujjawal-kumar-singh' },
    { name: 'Mana Panda', role: 'Backend & DB', bio: 'Handles server logic and data flows', img: 'https://placehold.co/300x300?text=Mana', linkedin: 'https://www.linkedin.com/in/mana-panda' },
    { name: 'Rohit Soni', role: 'API & Testing', bio: 'Responsible for APIs and quality assurance', img: 'https://placehold.co/300x300?text=Rohit', linkedin: 'https://www.linkedin.com/in/rohit-soni' },
    { name: 'Shubham Sharma', role: 'UI & Docs', bio: 'Creates clean UI and manages documentation', img: 'https://placehold.co/300x300?text=Shubham', linkedin: 'https://www.linkedin.com/in/shubham-sharma' },
  ];

  const features = [
    { icon: <FaRocket />, title: 'Innovative Approach', description: 'Combining AI recommendations with curated content to enhance learning efficiency.' },
    { icon: <FaUsers />, title: 'Community Driven', description: 'Engage with peers, receive mentor guidance, and participate in forums for collaborative learning.' },
    { icon: <FaChartLine />, title: 'Proven Results', description: 'Our learners experience a 35% improvement in job placement outcomes.' },
    { icon: <FaLightbulb />, title: 'Continuous Updates', description: 'Stay ahead with weekly content refreshes based on the latest industry trends.' },
    { icon: <FaLaptopCode />, title: 'Hands-on Practice', description: 'Tackle real coding problems and take mock tests to prepare effectively.' },
    { icon: <FaGlobe />, title: 'Global Reach', description: 'Join students from over 20 countries for a global learning experience.' },
    { icon: <FaAward />, title: 'Top Resources', description: 'Access industry-level, company-specific content to prepare for your dream job.' },
    { icon: <FaHandsHelping />, title: 'Mentorship', description: 'Get personalized mentorship from placement achievers who have been in your shoes.' },
  ];

  // Motion variants for scroll animations
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="about-container px-6 py-10 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

      {/* Hero Section */}
      <motion.section className="about-hero text-center mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <h1 className="text-4xl font-bold mb-4">Welcome to Placify</h1>
        <p className="mb-2">Empowering students with smart placement preparation tools and resources.</p>
        <p className="text-blue-600 dark:text-blue-400 font-semibold">Our mission: Bridge the gap between education and employment.</p>
      </motion.section>

      {/* Stats Section */}
      <section className="about-stats grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            className="stat-card bg-white dark:bg-gray-800 p-6 rounded-2xl shadow text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              {stat.value}{stat.label.includes('Rate') ? '%' : stat.label.includes('Support') ? '/7' : '+'}
            </h2>
            <p className="font-semibold mb-2">{stat.label}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{stat.description}</p>
          </motion.div>
        ))}
      </section>

      {/* Features Section */}
      <motion.section className="about-features mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <h2 className="text-3xl font-bold mb-8 text-center">Why Placify?</h2>
        <div className="features-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feat, i) => (
            <motion.div
              key={i}
              className="feature-box bg-white dark:bg-gray-800 p-6 rounded-2xl shadow text-center cursor-pointer"
              whileHover={{ y: -5, scale: 1.03, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
              transition={{ duration: 0.3 }}
            >
              <div className="feature-icon text-3xl mb-4 text-blue-600 dark:text-blue-400">{feat.icon}</div>
              <h3 className="font-semibold mb-2">{feat.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{feat.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section className="about-team mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <h2 className="text-3xl font-bold mb-8 text-center">Meet the Team</h2>
        <div className="team-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {teamMembers.map((member, i) => (
            <motion.div
              key={i}
              className="team-card bg-white dark:bg-gray-800 p-6 rounded-2xl shadow text-center cursor-pointer"
              whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
              transition={{ duration: 0.3 }}
            >
              <img src={member.img} alt={member.name} className="w-24 h-24 rounded-full mx-auto mb-4" />
              <h4 className="font-semibold">{member.name}</h4>
              <p className="role text-blue-600 dark:text-blue-400 mb-2">{member.role}</p>
              <p className="bio text-sm text-gray-500 dark:text-gray-400 mb-2">{member.bio}</p>
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 font-semibold">
                LinkedIn
              </a>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section className="about-cta bg-blue-600 dark:bg-blue-500 text-white p-10 rounded-2xl text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <h2 className="text-3xl font-bold mb-4">Ready to Launch Your Career?</h2>
        <p className="mb-4">Join thousands of students preparing for success with Placify.</p>
        <p className="mb-6 italic">"Placify helped me land my dream job! The resources and support were invaluable." - A Happy Learner</p>
        <button className="px-8 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition">
          Get Started
        </button>
      </motion.section>

    </div>
  );
};

export default About;
