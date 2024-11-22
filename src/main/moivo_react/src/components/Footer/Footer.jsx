import React from 'react';
import styles from '../../assets/css/footer.module.css';

const Footer = () => {
     return (
          <div>
               <footer className={styles.mainFooter}>
                    <div className={styles.container}>
                         <div className={styles.footerGridContainer}>
                              <div className={styles.footerSection}>
                                   <section className={styles.navLogo}>
                                        Moivo
                                   </section>
                                   <p>
                                        Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                                   </p>
                              </div>
                              <div className={styles.footerSection}>
                                   <h2>PRIVACY & TERMS</h2>
                                   <ul className={styles.linkList}>
                                        <li className={styles.linkItem}>
                                             <a href="#" className={styles.linkAnchor}>Privacy & Security</a>
                                        </li>
                                        <li className={styles.linkItem}>
                                             <a href="#" className={styles.linkAnchor}>Terms and Conditions</a>
                                        </li>
                                        <li className={styles.linkItem}>
                                             <a href="#" className={styles.linkAnchor}>Policy</a>
                                        </li>
                                   </ul>
                              </div>
                              <div className={styles.footerSection}>
                                   <h2>GET NOTIFIED</h2>
                                   <form>
                                        <input type="email" className={styles.emailInput} placeholder="Email" />
                                        <button type="submit" className={styles.submitBtn}>Submit</button>
                                   </form>
                              </div>
                              <div className={styles.footerSection}>
                                   <h2>SITE LINKS</h2>
                                   <ul className={styles.linkList}>
                                        <li className={styles.linkItem}>
                                             <a href="#" className={styles.linkAnchor}>About us</a>
                                        </li>
                                        <li className={styles.linkItem}>
                                             <a href="#" className={styles.linkAnchor}>Help & Support</a>
                                        </li>
                                        <li className={styles.linkItem}>
                                             <a href="#" className={styles.linkAnchor}>Career</a>
                                        </li>
                                        <li className={styles.linkItem}>
                                             <a href="#" className={styles.linkAnchor}>Refund Policy</a>
                                        </li>
                                   </ul>
                              </div>
                         </div>
                    </div>
               </footer>
          </div>
     );
};

export default Footer;