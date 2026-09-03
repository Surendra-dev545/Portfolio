import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import {
  FaFacebook, FaTwitter, FaLinkedin, FaArrowRight, FaCode,
  FaLayerGroup, FaRocket, FaSun, FaMoon, FaBars, FaTimes,
  FaReact, FaNodeJs, FaJava, FaHtml5, FaCss3Alt, FaCertificate,
  FaGithub, FaArrowUp, FaEnvelope, FaTimes as FaClose,
  FaPalette, FaMobileAlt, FaServer, FaShieldAlt, FaCheckCircle,
  FaTimesCircle, FaExternalLinkAlt
} from 'react-icons/fa';
import { SiJavascript, SiExpress, SiMui, SiMongodb } from 'react-icons/si';
import emailjs from 'emailjs-com';
import './Portfolio.css';

function Portfolio() {
  const [activeSection, setActiveSection] = useState('home');
  const [isSending, setIsSending] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [countersStarted, setCountersStarted] = useState(false);
  const statsRef = useRef(null);

  // Set dark on first mount explicitly
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Typing animation
  const phrases = useMemo(() => [
    'React Specialist', 'UI/UX Enthusiast', 'MERN Stack Dev', 'Frontend Engineer'
  ], []);

  useEffect(() => {
    let phraseIdx = 0, charIdx = 0, deleting = false;
    const tick = () => {
      const current = phrases[phraseIdx];
      setTypedText(deleting ? current.slice(0, charIdx--) : current.slice(0, charIdx++));
      if (!deleting && charIdx > current.length) { deleting = true; setTimeout(tick, 1200); return; }
      if (deleting && charIdx < 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; }
      setTimeout(tick, deleting ? 50 : 90);
    };
    const t = setTimeout(tick, 500);
    return () => clearTimeout(t);
  }, [phrases]);

  // Scroll-to-top visibility
  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Toast helper
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // Animated counter hook
  const useCounter = (target, started) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
      if (!started) return;
      let start = 0;
      const step = Math.ceil(target / 60);
      const timer = setInterval(() => {
        start += step;
        if (start >= target) { setCount(target); clearInterval(timer); }
        else setCount(start);
      }, 25);
      return () => clearInterval(timer);
    }, [started, target]);
    return count;
  };

  const c1 = useCounter(2, countersStarted);
  const c2 = useCounter(12, countersStarted);

  // Trigger counters when stats come into view
  useEffect(() => {
    if (activeSection !== 'home') return;
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setCountersStarted(true); observer.disconnect(); }
    }, { threshold: 0.5 });
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [activeSection]);

  const stats = useMemo(() => [
    { value: c1, suffix: '+', label: 'Years Experience' },
    { value: c2, suffix: '+', label: 'Projects Delivered' },
    { value: 100, suffix: '%', label: 'Responsive Focus' }
  ], [c1, c2]);

  const skillCards = useMemo(() => [
    { name: 'React.js', icon: <FaReact /> },
    { name: 'JavaScript (ES6+)', icon: <SiJavascript /> },
    { name: 'HTML5', icon: <FaHtml5 /> },
    { name: 'CSS3', icon: <FaCss3Alt /> },
    { name: 'MongoDB', icon: <SiMongodb /> },
    { name: 'Node.js', icon: <FaNodeJs /> },
    { name: 'Express.js', icon: <SiExpress /> },
    { name: 'Material-UI', icon: <SiMui /> },
    { name: 'Core Java', icon: <FaJava /> }
  ], []);

  const certifications = useMemo(() => [
    { title: 'React - The Complete Guide', issuer: 'Udemy', year: '2023' },
    { title: 'Node.js Developer Course', issuer: 'Udemy', year: '2023' },
    { title: 'MongoDB Basics', issuer: 'MongoDB University', year: '2022' }
  ], []);

  const skillLevels = useMemo(() => [
    { name: 'React.js', level: 92 },
    { name: 'JavaScript', level: 88 },
    { name: 'HTML & CSS', level: 95 },
    { name: 'Node.js', level: 75 },
    { name: 'MongoDB', level: 70 },
    { name: 'Material-UI', level: 85 }
  ], []);

  const services = useMemo(() => [
    {
      icon: <FaReact />,
      title: 'React UI Development',
      desc: 'Building responsive, component-driven React applications using hooks, state management, and clean JSX structure.',
      points: ['React.js', 'Hooks & State', 'Component Architecture']
    },
    {
      icon: <FaPalette />,
      title: 'UI Styling & Animations',
      desc: 'Creating polished interfaces using Material-UI and CSS3 with smooth transitions and consistent visual design.',
      points: ['Material-UI', 'CSS3 Animations', 'Clean Layouts']
    },
    {
      icon: <FaMobileAlt />,
      title: 'Responsive Design',
      desc: 'Making sure every layout works well across mobile, tablet, and desktop using flexible CSS and media queries.',
      points: ['Mobile-First', 'Media Queries', 'Cross-Browser']
    },
    {
      icon: <FaServer />,
      title: 'MERN Stack Apps',
      desc: 'Developing full-stack web apps using MongoDB, Express.js, React, and Node.js with REST API integration.',
      points: ['Node.js & Express', 'MongoDB', 'REST APIs']
    },
    {
      icon: <FaShieldAlt />,
      title: 'Auth & Role-Based Access',
      desc: 'Implementing JWT-based login systems and role-based access control for secure multi-user applications.',
      points: ['JWT Authentication', 'Role-Based Access', 'Secure Routes']
    },
    {
      icon: <FaCode />,
      title: 'Web App Maintenance',
      desc: 'Fixing bugs, improving performance, and keeping existing web applications clean and up to date.',
      points: ['Bug Fixing', 'Code Cleanup', 'Performance Tuning']
    }
  ], []);

  const projects = useMemo(() => [
    {
      title: 'Move-N-Earn Parcel Delivery Web App',
      desc: [
        'Full-stack parcel delivery platform using React.js, Node.js, and MongoDB.',
        'Role-based login for enterprises and delivery partners with secure JWT sessions.',
        'Integrated Google Maps API for tracking parcels in real time.'
      ],
      tags: ['React', 'Node.js', 'MongoDB', 'JWT', 'Maps API'],
      details: 'A comprehensive parcel delivery platform built with the MERN stack. Features include real-time GPS tracking via Google Maps API, role-based dashboards for enterprises and delivery partners, JWT-secured sessions, and a fully responsive UI built with React.js and Material-UI.',
      github: 'https://github.com/'
    },
    {
      title: 'Transporter Management Dashboard',
      desc: [
        'Admin dashboard to manage fleets, drivers, and delivery tasks.',
        'Data visualization charts to monitor performance and revenue.',
        'Role-based permissions and secure CRUD APIs.'
      ],
      tags: ['React', 'Material-UI', 'Express', 'Charts'],
      details: 'An enterprise-grade admin dashboard for fleet and transporter management. Includes interactive data visualization charts, driver performance tracking, revenue analytics, and a secure role-based permission system backed by Express.js APIs.',
      github: 'https://github.com/'
    },
    {
      title: 'Personal Portfolio Website',
      desc: [
        'Fully responsive personal site with smooth transitions, reveal animations, and EmailJS integration.',
        'SEO optimized with fast load times and polished visual hierarchy.'
      ],
      tags: ['React', 'CSS3', 'EmailJS', 'Responsive'],
      details: 'A modern portfolio website built with React.js featuring dark/light mode, typing animations, scroll-triggered reveals, floating 3D badges, skill progress bars, and a working contact form powered by EmailJS. Fully responsive across all devices.',
      github: 'https://github.com/'
    }
  ], []);

  const navItems = ['home', 'about', 'experience', 'services', 'projects', 'skills', 'certifications', 'contact'];

  useEffect(() => {
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('show'); }),
      { threshold: 0.12 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [activeSection]);

  const handleNavClick = (section) => {
    setActiveSection(section);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const sendEmail = async (e) => {
    e.preventDefault();
    if (isSending) return;
    setIsSending(true);
    try {
      await emailjs.sendForm('service_bu44sec', 'template_130riru', e.currentTarget, 'irLikR8_bnzCKAr_N');
      showToast('✅ Message sent successfully!', 'success');
      e.currentTarget.reset();
    } catch (error) {
      if (error?.status === 412) showToast('❌ Email service temporarily unavailable.', 'error');
      else showToast('❌ Failed to send message. Please try again.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const activeIndex = navItems.indexOf(activeSection);
  const progressPct = ((activeIndex + 1) / navItems.length) * 100;

  return (
    <div className="portfolio-shell">
      <div className="bg-orb orb-one"></div>
      <div className="bg-orb orb-two"></div>
      <div className="grid-overlay"></div>

      {/* NAV PROGRESS BAR */}
      <div className="nav-progress" style={{ width: `${progressPct}%` }}></div>

      {/* ================= HEADER ================= */}
      <header className="header glass-panel">
        <button className="logo" onClick={() => handleNavClick('home')}>Surendra Mustini</button>

        <div className="header-right">
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)} aria-label="Toggle theme">
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <nav className={`navbar${menuOpen ? ' open' : ''}`}>
          {navItems.map((s) => (
            <button key={s} onClick={() => handleNavClick(s)} className={activeSection === s ? 'active' : ''}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </nav>
      </header>

      {/* ================= HOME ================= */}
      {activeSection === 'home' && (
        <section className="home section show" id="home">
          <div className="home-content">
            <span className="eyebrow"><span className="avail-dot"></span> Available for Work</span>
            <h1>Building immersive digital experiences with modern frontend engineering.</h1>
            <h3><span className="typed-text">{typedText}</span><span className="cursor">|</span></h3>
            <p>I design and build polished web applications with a strong focus on responsive UI, accessibility, secure integrations, and premium user experience.</p>

            <div className="hero-actions">
              <button onClick={() => handleNavClick('contact')} className="btn btn-primary">Hire Me <FaArrowRight /></button>
              <button onClick={() => handleNavClick('projects')} className="btn btn-secondary">View Projects</button>
              <a href="/resume.pdf" download="Surendra-Mustini-Resume.pdf" className="btn btn-primary">Download Resume</a>
            </div>

            <div className="stats-grid" ref={statsRef}>
              {stats.map((item) => (
                <div className="stat-card glass-panel" key={item.label}>
                  <h4>{item.value}{item.suffix}</h4>
                  <p>{item.label}</p>
                </div>
              ))}
            </div>

            <div className="home-sci">
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebook /></a>
              <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaTwitter /></a>
              <a href="https://www.linkedin.com/in/mustini-surendra" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
              <a href="https://github.com/" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FaGithub /></a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card glass-panel floating-card main-portrait">
              <div className="image-ring"></div>
              <img src="mypic3.png" alt="Surendra Mustini" />
            </div>
            <div className="floating-badge glass-panel badge-top"><FaCode /> Clean UI Architecture</div>
            <div className="floating-badge glass-panel badge-middle"><FaLayerGroup /> 3D Inspired Design</div>
            <div className="floating-badge glass-panel badge-bottom"><FaRocket /> Fast & Scalable Delivery</div>
          </div>
        </section>
      )}

      {/* ================= ABOUT ================= */}
      {activeSection === 'about' && (
        <section className="section about show" id="about">
          <div className="section-heading">
            <span className="eyebrow">About Me</span>
            <h2>Designing interfaces that feel futuristic and intuitive.</h2>
          </div>
          <div className="about-container">
            <div className="about-img glass-panel tilt-card">
              <img src="mypic3.png" alt="About Me" />
            </div>
            <div className="about-content glass-panel">
              <p>I specialize in React.js, JavaScript, HTML5, CSS3, and Material-UI. I build clean, modern interfaces with strong component architecture and thoughtful motion.</p>
              <p>My work blends engineering discipline with visual polish — from secure integrations and role-based systems to elegant layouts that elevate product experience.</p>
              <div className="about-badges">
                {['Problem Solver', 'Team Player', 'Fast Learner', 'Detail Oriented'].map((b) => (
                  <span className="about-badge" key={b}>{b}</span>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= EXPERIENCE ================= */}
      {activeSection === 'experience' && (
        <section className="section experience show" id="experience">
          <div className="section-heading">
            <span className="eyebrow">Experience</span>
            <h2>Professional journey focused on scalable frontend delivery.</h2>
          </div>
          <div className="timeline-wrapper">
            <div className="timeline-card glass-panel">
              <div className="timeline-dot"></div>
              <div className="timeline-header">
                <h3>Software Engineer</h3>
                <span className="timeline-badge">Full-Time</span>
              </div>
              <p><strong>Lyros Technologies Pvt Ltd</strong> | Hyderabad, Telangana<br />May 2023 – May 2025</p>
              <ul>
                <li>Developed and maintained scalable web applications using the MERN stack.</li>
                <li>Built responsive UIs with React.js and Material-UI, ensuring performance and accessibility.</li>
                <li>Implemented JWT authentication, role-based access control, and secure API integrations.</li>
                <li>Worked closely with designers, backend developers, and QA teams for end-to-end delivery.</li>
                <li>Optimized codebases, improved SEO, and ensured cross-browser compatibility.</li>
                <li>Provided mentorship to junior developers through code reviews and pair programming.</li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* ================= SERVICES ================= */}
      {activeSection === 'services' && (
        <section className="section services show" id="services">
          <div className="section-heading center">
            <span className="eyebrow">What I Offer</span>
            <h2>Services built around your product goals.</h2>
          </div>
          <div className="services-grid">
            {services.map((svc, i) => (
              <div className="service-card glass-panel" key={svc.title} style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="service-icon">{svc.icon}</div>
                <h3>{svc.title}</h3>
                <p>{svc.desc}</p>
                <ul className="service-points">
                  {svc.points.map((pt) => <li key={pt}><FaCheckCircle className="check-icon" />{pt}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= PROJECTS ================= */}
      {activeSection === 'projects' && (
        <section className="section projects show" id="projects">
          <div className="section-heading">
            <span className="eyebrow">Featured Work</span>
            <h2>Projects crafted with product thinking and modern engineering.</h2>
          </div>
          <div className="project-grid">
            {projects.map((p) => (
              <article className="project-card glass-panel" key={p.title} onClick={() => setSelectedProject(p)}>
                <h3>{p.title}</h3>
                <ul>{p.desc.map((d, i) => <li key={i}>{d}</li>)}</ul>
                <div className="project-tags">{p.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
                <button className="project-view-btn">View Details <FaExternalLinkAlt /></button>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ================= SKILLS ================= */}
      {activeSection === 'skills' && (
        <section className="section skills show" id="skills">
          <div className="section-heading">
            <span className="eyebrow">Core Skills</span>
            <h2>Technology stack for premium frontend products.</h2>
          </div>
          <div className="skills-grid">
            {skillCards.map((skill, i) => (
              <div className="skill-card glass-panel" key={skill.name} style={{ animationDelay: `${i * 0.07}s` }}>
                <span className="skill-icon">{skill.icon}</span>
                {skill.name}
              </div>
            ))}
          </div>
          <div className="skill-bars">
            <h3 className="skill-bars-title">Proficiency</h3>
            {skillLevels.map((s, i) => (
              <div className="skill-bar-row" key={s.name} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="skill-bar-label"><span>{s.name}</span><span>{s.level}%</span></div>
                <div className="skill-bar-track"><div className="skill-bar-fill" style={{ width: `${s.level}%` }}></div></div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= CERTIFICATIONS ================= */}
      {activeSection === 'certifications' && (
        <section className="section certifications show" id="certifications">
          <div className="section-heading">
            <span className="eyebrow">Certifications</span>
            <h2>Continuous learning and professional growth.</h2>
          </div>
          <div className="cert-grid">
            {certifications.map((cert) => (
              <div className="cert-card glass-panel" key={cert.title}>
                <FaCertificate className="cert-icon" />
                <h3>{cert.title}</h3>
                <p>{cert.issuer}</p>
                <span className="cert-year">{cert.year}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================= CONTACT ================= */}
      {activeSection === 'contact' && (
        <section className="section contact show" id="contact">
          <div className="section-heading center">
            <span className="eyebrow">Contact</span>
            <h2>Let's build something exceptional together.</h2>
          </div>
          <div className="contact-layout">
            <div className="contact-info glass-panel">
              <p><strong>📍 Hyderabad, Telangana</strong></p>
              <p><strong>📧 mustinisurendra1995@gmail.com</strong></p>
              <p><strong>📞 +91-7989378813</strong></p>
              <p><strong>🔗 <a href="https://www.linkedin.com/in/mustini-surendra" target="_blank" rel="noopener noreferrer">LinkedIn Profile</a></strong></p>
              <p className="contact-note">Available for frontend engineering, UI modernization, and product-focused web experiences.</p>
            </div>
            <form onSubmit={sendEmail} className="contact-form glass-panel">
              <label htmlFor="name">Name:</label>
              <input id="name" type="text" name="name" placeholder="Your Name" className="contact-input" required />
              <label htmlFor="email">Email:</label>
              <input id="email" type="email" name="email" placeholder="Your Email" className="contact-input" required />
              <label htmlFor="message">Message:</label>
              <textarea id="message" name="message" rows="6" placeholder="Tell me about your project" className="contact-input" required></textarea>
              <button type="submit" className="contact-button" disabled={isSending}>
                {isSending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </section>
      )}

      {/* ================= FOOTER ================= */}
      <footer className="footer glass-panel">
        <div className="footer-inner">
          <button className="logo" onClick={() => handleNavClick('home')}>Surendra Mustini</button>
          <p className="footer-tagline">Frontend Engineer • React Specialist • UI Crafter</p>
          <div className="footer-links">
            {['home', 'about', 'experience', 'services', 'projects', 'skills', 'contact'].map((s) => (
              <button key={s} onClick={() => handleNavClick(s)}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
            ))}
          </div>
          <div className="footer-social">
            <a href="https://www.linkedin.com/in/mustini-surendra" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin /></a>
            <a href="https://github.com/" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FaGithub /></a>
            <a href="mailto:mustinisurendra1995@gmail.com" aria-label="Email"><FaEnvelope /></a>
          </div>
          <p className="footer-copy">© {new Date().getFullYear()} Surendra Mustini. All rights reserved.</p>
        </div>
      </footer>

      {/* SCROLL TO TOP */}
      {showScrollTop && (
        <button className="scroll-top" onClick={scrollToTop} aria-label="Back to top"><FaArrowUp /></button>
      )}

      {/* PROJECT MODAL */}
      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="modal-box glass-panel" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedProject(null)}><FaClose /></button>
            <h2>{selectedProject.title}</h2>
            <p className="modal-details">{selectedProject.details}</p>
            <div className="project-tags" style={{ marginTop: 16 }}>
              {selectedProject.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
            </div>
            <a href={selectedProject.github} target="_blank" rel="noopener noreferrer" className="btn btn-primary modal-btn">
              <FaGithub /> View on GitHub
            </a>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === 'success' ? <FaCheckCircle /> : <FaTimesCircle />}
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)}><FaClose /></button>
        </div>
      )}
    </div>
  );
}

export default Portfolio;
