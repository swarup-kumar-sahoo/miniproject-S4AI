import { Link } from 'react-router-dom'
import styles from './homepage.module.css'

const Homepage = () => {
  return (
    <div className={styles.homepage}>
      <img src="/orbital.png" alt="Orbital background" className={styles.orbital} />
      <div className={styles.left}>
        <h1>S4 AI</h1>
        <h2>Welcome to the Future of AI Conversations!</h2>
        <h3>Start chatting with S4 AI – your smart, interactive assistant for everyday needs.</h3>
        <Link to="/dashboard" className={styles.ctaButton}>Get Started</Link>
      </div>
      <div className={styles.right}>
        <div className={styles.imgContainer}>
          <div className={styles.bgContainer}>
            <div className={styles.bg}> </div>
          </div>
          <img src="/bot.png" alt="AI Bot" className={styles.bot} />
        </div>
      </div>
      <div className={styles.terms}>
        <img src="/logo.png" alt="S4 AI Logo" />
        <div className={styles.links}>
          <Link to="/">Terms of Service</Link>
          <span>|</span>
          <Link to="/">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
};

export default Homepage;