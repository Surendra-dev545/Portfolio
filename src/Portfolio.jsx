import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef
} from 'react';

import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaArrowRight,
  FaCode,
  FaLayerGroup,
  FaRocket,
  FaSun,
  FaMoon,
  FaBars,
  FaTimes,
  FaReact,
  FaNodeJs,
  FaJava,
  FaHtml5,
  FaCss3Alt,
  FaCertificate,
  FaGithub,
  FaArrowUp,
  FaEnvelope,
  FaTimes as FaClose,
  FaPalette,
  FaMobileAlt,
  FaServer,
  FaShieldAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaExternalLinkAlt,
  FaRobot,
  FaPaperPlane,
  FaWhatsapp,
  FaGlobe,
  FaBriefcase
} from 'react-icons/fa';

import {
  SiJavascript,
  SiExpress,
  SiMui,
  SiMongodb
} from 'react-icons/si';

import emailjs from '@emailjs/browser';

import './Portfolio.css';


// =========================================================
// CHATBOT EMAILJS CONFIGURATION
// =========================================================

const CHAT_EMAIL_SERVICE_ID = 'service_jjjlpo7';
const CHAT_EMAIL_TEMPLATE_ID = 'template_ivobyap';
const CHAT_EMAIL_PUBLIC_KEY = 'RKqmoYs8ddIMZhR7N';


// =========================================================
// BACKEND CONFIGURATION
// =========================================================

const API_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:5000';


// =========================================================
// CHATBOT SERVICES
// =========================================================

const SERVICES = [
  {
    id: 'website',
    title: 'Website Development',
    icon: <FaGlobe />
  },
  {
    id: 'react',
    title: 'React Development',
    icon: <FaCode />
  },
  {
    id: 'uiux',
    title: 'UI/UX Development',
    icon: <FaPalette />
  },
  {
    id: 'mobile',
    title: 'Mobile App',
    icon: <FaMobileAlt />
  },
  {
    id: 'custom',
    title: 'Custom Project',
    icon: <FaBriefcase />
  }
];


// =========================================================
// CHATBOT
// =========================================================

function PortfolioChatbot() {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      text:
        "Hi! 👋 I'm Surendra's AI assistant. Welcome to my portfolio! Ask me about my skills, projects, experience, services, or contact details."
    }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailSending, setEmailSending] = useState(false);

  const [emailForm, setEmailForm] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  // Chat body reference for proper scrolling
  const chatBodyRef = useRef(null);

  const inputRef = useRef(null);


  // =======================================================
  // CHAT AUTO SCROLL
  // =======================================================

  useEffect(() => {
    const chatBody = chatBodyRef.current;

    if (!chatBody) return;

    requestAnimationFrame(() => {
      chatBody.scrollTo({
        top: chatBody.scrollHeight,
        behavior: 'smooth'
      });
    });
  }, [messages, isTyping, showEmailForm]);


  // =======================================================
  // FOCUS INPUT WHEN CHAT OPENS
  // =======================================================

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 150);

    return () => clearTimeout(timer);
  }, [isOpen]);


  // =======================================================
  // ADD CHAT MESSAGE
  // =======================================================

  const addMessage = (role, text) => {
    setMessages((previous) => [
      ...previous,
      {
        id: Date.now() + Math.random(),
        role,
        text
      }
    ]);
  };


  // =======================================================
  // ASK AI
  // =======================================================

  const askAI = async (
    message,
    historyOverride = null
  ) => {
    try {
      const history =
        historyOverride ||
        messages
          .filter(
            (item) =>
              item.role === 'user' ||
              item.role === 'assistant'
          )
          .map((item) => ({
            role: item.role,
            content: item.text
          }));

      const response = await fetch(
        `${API_URL}/api/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message,
            history
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'AI request failed'
        );
      }

      return (
        data.reply ||
        'Sorry, I could not generate a response.'
      );
    } catch (error) {
      console.error('Chat AI error:', error);

      return (
        "I'm having trouble connecting to my AI service right now. You can use WhatsApp or the Email Me button to contact Surendra."
      );
    }
  };


  // =======================================================
  // SEND CHAT MESSAGE
  // =======================================================

  const sendMessage = async (
    messageText = input
  ) => {
    const message = messageText.trim();

    if (!message || isTyping) return;

    const history = [
      ...messages
        .filter(
          (item) =>
            item.role === 'user' ||
            item.role === 'assistant'
        )
        .map((item) => ({
          role: item.role,
          content: item.text
        })),
      {
        role: 'user',
        content: message
      }
    ];

    addMessage('user', message);

    setInput('');
    setIsTyping(true);

    const reply = await askAI(
      message,
      history
    );

    addMessage('assistant', reply);

    setIsTyping(false);
  };


  // =======================================================
  // SERVICE BUTTON
  // =======================================================

  const handleService = async (service) => {
    if (isTyping) return;

    const history = [
      ...messages
        .filter(
          (item) =>
            item.role === 'user' ||
            item.role === 'assistant'
        )
        .map((item) => ({
          role: item.role,
          content: item.text
        })),
      {
        role: 'user',
        content: service.title
      }
    ];

    addMessage(
      'user',
      service.title
    );

    setIsTyping(true);

    const reply = await askAI(
      `The visitor selected the service: ${service.title}. Explain this service based on Surendra's portfolio and ask one useful follow-up question.`,
      history
    );

    addMessage(
      'assistant',
      reply
    );

    setIsTyping(false);
  };


  // =======================================================
  // EMAIL VALIDATION
  // =======================================================

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email
    );
  };


  // =======================================================
  // CHATBOT EMAIL - EMAILJS
  // =======================================================

  const sendChatEmail = async (event) => {
    event.preventDefault();

    if (emailSending) return;

    const name = emailForm.name.trim();
    const email = emailForm.email.trim();
    const company = emailForm.company.trim();
    const message = emailForm.message.trim();

    // Validation
    if (
      !name ||
      !email ||
      !company ||
      !message
    ) {
      addMessage(
        'assistant',
        '❌ Please fill in all email fields.'
      );

      return;
    }

    if (!isValidEmail(email)) {
      addMessage(
        'assistant',
        '❌ Please enter a valid email address.'
      );

      return;
    }

    setEmailSending(true);

    try {

      // EmailJS template variables
      const templateParams = {
        subject:
          'New Portfolio Chatbot Message',

        source:
          'Portfolio AI Chatbot',

        title:
          'New Message from Portfolio Chatbot',

        subtitle:
          'Someone contacted you through your portfolio chatbot.',

        name: name,

        email: email,

        company: company,

        message: message
      };


      // DIRECT EMAILJS SEND
      const result = await emailjs.send(
        CHAT_EMAIL_SERVICE_ID,
        CHAT_EMAIL_TEMPLATE_ID,
        templateParams,
        CHAT_EMAIL_PUBLIC_KEY
      );


      console.log(
        'Chatbot EmailJS Success:',
        result
      );


      // Success message
      addMessage(
        'assistant',
        `✅ Your message has been sent successfully!

Thank you, ${name}. Surendra can now review your message and get back to you.`
      );


      // Reset form
      setEmailForm({
        name: '',
        email: '',
        company: '',
        message: ''
      });


      // Close email form
      setShowEmailForm(false);

    } catch (error) {

      console.error(
        'Chatbot EmailJS Error:',
        error
      );


      let errorMessage =
        '❌ I could not send the email right now. Please try again.';


      if (error?.status === 400) {
        errorMessage =
          '❌ EmailJS rejected the request. Please check your EmailJS template variables.';
      }

      if (error?.status === 401) {
        errorMessage =
          '❌ EmailJS authentication failed. Please check your Public Key.';
      }

      if (error?.status === 404) {
        errorMessage =
          '❌ EmailJS service or template was not found. Please check the Service ID and Template ID.';
      }


      addMessage(
        'assistant',
        errorMessage
      );

    } finally {

      setEmailSending(false);

    }
  };


  // =======================================================
  // WHATSAPP
  // =======================================================

  const openWhatsApp = () => {

    const message =
      "Hi Surendra! I visited your portfolio and I'd like to discuss a project with you.";

    window.open(
      `https://wa.me/917989378813?text=${encodeURIComponent(
        message
      )}`,
      '_blank',
      'noopener,noreferrer'
    );
  };


  // =======================================================
  // OPEN EMAIL FORM
  // =======================================================

  const openEmailForm = () => {

    setShowEmailForm(true);

    addMessage(
      'assistant',
      'Sure! 📧 Please fill in the form below. I will send your message directly to Surendra.'
    );
  };


  // =======================================================
  // ENTER KEY
  // =======================================================

  const handleKeyDown = (event) => {

    if (
      event.key === 'Enter' &&
      !event.shiftKey
    ) {

      event.preventDefault();

      sendMessage();

    }
  };


  // =======================================================
  // CHATBOT UI
  // =======================================================

  return (
    <>
      {/* ===================================================
          CHAT LAUNCHER
      =================================================== */}

      {!isOpen && (
        <button
          type="button"
          className="portfolio-chat-launcher"
          onClick={() => setIsOpen(true)}
          aria-label="Open AI chatbot"
        >
          <FaRobot />

          <span className="chat-help-text">
            Help
          </span>

          <span className="chat-launcher-pulse"></span>
        </button>
      )}


      {/* ===================================================
          CHAT WINDOW
      =================================================== */}

      {isOpen && (
        <div className="portfolio-chat-window">

          {/* =================================================
              HEADER
          ================================================= */}

          <div className="portfolio-chat-header">

            <div className="portfolio-chat-header-info">

              <div className="portfolio-chat-avatar">
                <FaRobot />

                <span className="portfolio-chat-online"></span>
              </div>

              <div>

                <h3>
                  Surendra's AI Assistant
                </h3>

                <p>
                  <span></span>
                  Online
                </p>

              </div>

            </div>


            <button
              type="button"
              className="portfolio-chat-close"
              onClick={() => setIsOpen(false)}
              aria-label="Close chatbot"
            >
              <FaTimes />
            </button>

          </div>


          {/* =================================================
              SCROLLABLE CHAT BODY
          ================================================= */}

          <div
            className="portfolio-chat-body"
            ref={chatBodyRef}
          >

            <div className="portfolio-chat-welcome">

              <span>👋</span>

              <div>

                <strong>
                  Welcome!
                </strong>

                <p>
                  Ask me anything about
                  Surendra's services,
                  projects or skills.
                </p>

              </div>

            </div>


            {/* =================================================
                CHAT MESSAGES
            ================================================= */}

            {messages.map((message) => (

              <div
                key={message.id}
                className={`portfolio-chat-message ${
                  message.role === 'user'
                    ? 'user'
                    : 'bot'
                }`}
              >

                <div className="portfolio-chat-message-bubble">
                  {message.text}
                </div>

              </div>

            ))}


            {/* =================================================
                SERVICES
            ================================================= */}

            {messages.length === 1 && (

              <div className="portfolio-chat-services">

                <p>
                  What are you looking for?
                </p>


                {SERVICES.map((service) => (

                  <button
                    type="button"
                    key={service.id}
                    onClick={() =>
                      handleService(service)
                    }
                    className="portfolio-chat-service"
                    disabled={isTyping}
                  >

                    <span className="portfolio-chat-service-icon">
                      {service.icon}
                    </span>

                    <span>
                      {service.title}
                    </span>

                    <FaArrowRight />

                  </button>

                ))}

              </div>

            )}


            {/* =================================================
                TYPING INDICATOR
            ================================================= */}

            {isTyping && (

              <div className="portfolio-chat-message bot">

                <div className="portfolio-chat-message-bubble typing">

                  <span></span>
                  <span></span>
                  <span></span>

                </div>

              </div>

            )}

          </div>


          {/* =================================================
              EMAIL FORM
          ================================================= */}

          {showEmailForm && (

            <div className="chat-email-form-container">

              <div className="chat-email-form-header">

                <div>

                  <h3>
                    Send Email to Surendra
                  </h3>

                  <p>
                    Fill in your details and message.
                  </p>

                </div>


                <button
                  type="button"
                  className="chat-email-form-close"
                  onClick={() =>
                    setShowEmailForm(false)
                  }
                  disabled={emailSending}
                  aria-label="Close email form"
                >
                  <FaTimes />
                </button>

              </div>


              <form
                className="chat-email-form"
                onSubmit={sendChatEmail}
              >

                <label htmlFor="chat-name">
                  Name
                </label>

                <input
                  id="chat-name"
                  type="text"
                  value={emailForm.name}
                  onChange={(e) =>
                    setEmailForm((previous) => ({
                      ...previous,
                      name: e.target.value
                    }))
                  }
                  placeholder="John"
                  required
                  disabled={emailSending}
                />


                <label htmlFor="chat-email">
                  Email
                </label>

                <input
                  id="chat-email"
                  type="email"
                  value={emailForm.email}
                  onChange={(e) =>
                    setEmailForm((previous) => ({
                      ...previous,
                      email: e.target.value
                    }))
                  }
                  placeholder="john@gmail.com"
                  required
                  disabled={emailSending}
                />


                <label htmlFor="chat-company">
                  Company Name
                </label>

                <input
                  id="chat-company"
                  type="text"
                  value={emailForm.company}
                  onChange={(e) =>
                    setEmailForm((previous) => ({
                      ...previous,
                      company: e.target.value
                    }))
                  }
                  placeholder="ABC Technologies"
                  required
                  disabled={emailSending}
                />


                <label htmlFor="chat-message">
                  Message
                </label>

                <textarea
                  id="chat-message"
                  rows="4"
                  value={emailForm.message}
                  onChange={(e) =>
                    setEmailForm((previous) => ({
                      ...previous,
                      message: e.target.value
                    }))
                  }
                  placeholder="I want to discuss a React project."
                  required
                  disabled={emailSending}
                ></textarea>


                <button
                  type="submit"
                  className="chat-email-send-button"
                  disabled={emailSending}
                >

                  {emailSending ? (
                    'Sending...'
                  ) : (
                    <>
                      <FaEnvelope />
                      Send Email
                    </>
                  )}

                </button>

              </form>

            </div>

          )}


          {/* =================================================
              CHAT FOOTER
          ================================================= */}

          <div className="portfolio-chat-footer">

            <div className="portfolio-chat-quick-actions">

              <button
                type="button"
                onClick={() =>
                  sendMessage(
                    'What services do you provide?'
                  )
                }
                disabled={isTyping}
              >
                Services
              </button>


              <button
                type="button"
                onClick={() =>
                  sendMessage(
                    'Tell me about your projects.'
                  )
                }
                disabled={isTyping}
              >
                Projects
              </button>


              <button
                type="button"
                onClick={() =>
                  sendMessage(
                    'Tell me about your skills.'
                  )
                }
                disabled={isTyping}
              >
                Skills
              </button>


              <button
                type="button"
                onClick={openEmailForm}
                disabled={emailSending}
              >
                Email Me
              </button>

            </div>


            <div className="portfolio-chat-input-row">

              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) =>
                  setInput(e.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                rows="1"
                disabled={isTyping}
              ></textarea>


              <button
                type="button"
                className="portfolio-chat-send"
                onClick={() =>
                  sendMessage()
                }
                disabled={
                  !input.trim() ||
                  isTyping
                }
                aria-label="Send message"
              >
                <FaPaperPlane />
              </button>

            </div>


            <button
              type="button"
              className="portfolio-chat-whatsapp"
              onClick={openWhatsApp}
            >
              <FaWhatsapp />

              Continue on WhatsApp

            </button>

          </div>

        </div>
      )}

    </>
  );
}


// =========================================================
// MAIN PORTFOLIO
// =========================================================

function Portfolio() {

  const [activeSection, setActiveSection] =
    useState('home');

  const [isSending, setIsSending] =
    useState(false);

  const [darkMode, setDarkMode] =
    useState(true);

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [typedText, setTypedText] =
    useState('');

  const [showScrollTop, setShowScrollTop] =
    useState(false);

  const [toast, setToast] =
    useState(null);

  const [selectedProject, setSelectedProject] =
    useState(null);

  const [countersStarted, setCountersStarted] =
    useState(false);

  const statsRef =
    useRef(null);


  // =======================================================
  // DARK MODE
  // =======================================================

  useEffect(() => {

    document.documentElement.setAttribute(
      'data-theme',
      'dark'
    );

  }, []);


  useEffect(() => {

    document.documentElement.setAttribute(
      'data-theme',
      darkMode ? 'dark' : 'light'
    );

  }, [darkMode]);


  // =======================================================
  // TYPING ANIMATION
  // =======================================================

  const phrases = useMemo(
    () => [
      'React Specialist',
      'UI/UX Enthusiast',
      'MERN Stack Dev',
      'Frontend Engineer'
    ],
    []
  );


  useEffect(() => {

    let phraseIdx = 0;
    let charIdx = 0;
    let deleting = false;

    const tick = () => {

      const current =
        phrases[phraseIdx];

      setTypedText(
        deleting
          ? current.slice(0, charIdx--)
          : current.slice(0, charIdx++)
      );


      if (
        !deleting &&
        charIdx > current.length
      ) {

        deleting = true;

        setTimeout(
          tick,
          1200
        );

        return;
      }


      if (
        deleting &&
        charIdx < 0
      ) {

        deleting = false;

        phraseIdx =
          (phraseIdx + 1) %
          phrases.length;

      }


      setTimeout(
        tick,
        deleting ? 50 : 90
      );

    };


    const timer =
      setTimeout(tick, 500);


    return () =>
      clearTimeout(timer);

  }, [phrases]);


  // =======================================================
  // SCROLL TO TOP VISIBILITY
  // =======================================================

  useEffect(() => {

    const onScroll = () =>
      setShowScrollTop(
        window.scrollY > 300
      );


    window.addEventListener(
      'scroll',
      onScroll
    );


    return () =>
      window.removeEventListener(
        'scroll',
        onScroll
      );

  }, []);


  // =======================================================
  // TOAST
  // =======================================================

  const showToast = useCallback(
    (
      message,
      type = 'success'
    ) => {

      setToast({
        message,
        type
      });

      setTimeout(
        () => setToast(null),
        4000
      );

    },
    []
  );


  // =======================================================
  // COUNTER
  // =======================================================

  const useCounter = (
    target,
    started
  ) => {

    const [count, setCount] =
      useState(0);


    useEffect(() => {

      if (!started) return;

      let start = 0;

      const step =
        Math.ceil(
          target / 60
        );


      const timer =
        setInterval(() => {

          start += step;


          if (
            start >= target
          ) {

            setCount(target);

            clearInterval(timer);

          } else {

            setCount(start);

          }

        }, 25);


      return () =>
        clearInterval(timer);

    }, [
      started,
      target
    ]);


    return count;
  };


  const c1 =
    useCounter(
      2,
      countersStarted
    );

  const c2 =
    useCounter(
      12,
      countersStarted
    );


  // =======================================================
  // COUNTER OBSERVER
  // =======================================================

  useEffect(() => {

    if (
      activeSection !== 'home'
    ) {
      return;
    }


    const observer =
      new IntersectionObserver(
        ([entry]) => {

          if (
            entry.isIntersecting
          ) {

            setCountersStarted(
              true
            );

            observer.disconnect();

          }

        },
        {
          threshold: 0.5
        }
      );


    if (
      statsRef.current
    ) {

      observer.observe(
        statsRef.current
      );

    }


    return () =>
      observer.disconnect();

  }, [activeSection]);


  // =======================================================
  // STATS
  // =======================================================

  const stats = useMemo(
    () => [
      {
        value: c1,
        suffix: '+',
        label: 'Years Experience'
      },
      {
        value: c2,
        suffix: '+',
        label: 'Projects Delivered'
      },
      {
        value: 100,
        suffix: '%',
        label: 'Responsive Focus'
      }
    ],
    [c1, c2]
  );


  // =======================================================
  // SKILLS
  // =======================================================

  const skillCards = useMemo(
    () => [
      {
        name: 'React.js',
        icon: <FaReact />
      },
      {
        name: 'JavaScript (ES6+)',
        icon: <SiJavascript />
      },
      {
        name: 'HTML5',
        icon: <FaHtml5 />
      },
      {
        name: 'CSS3',
        icon: <FaCss3Alt />
      },
      {
        name: 'MongoDB',
        icon: <SiMongodb />
      },
      {
        name: 'Node.js',
        icon: <FaNodeJs />
      },
      {
        name: 'Express.js',
        icon: <SiExpress />
      },
      {
        name: 'Material-UI',
        icon: <SiMui />
      },
      {
        name: 'Core Java',
        icon: <FaJava />
      }
    ],
    []
  );


  // =======================================================
  // CERTIFICATIONS
  // =======================================================

  const certifications = useMemo(
    () => [
      {
        title:
          'React - The Complete Guide',
        issuer: 'Udemy',
        year: '2023'
      },
      {
        title:
          'Node.js Developer Course',
        issuer: 'Udemy',
        year: '2023'
      },
      {
        title:
          'MongoDB Basics',
        issuer:
          'MongoDB University',
        year: '2022'
      }
    ],
    []
  );


  // =======================================================
  // SKILL LEVELS
  // =======================================================

  const skillLevels = useMemo(
    () => [
      {
        name: 'React.js',
        level: 92
      },
      {
        name: 'JavaScript',
        level: 88
      },
      {
        name: 'HTML & CSS',
        level: 95
      },
      {
        name: 'Node.js',
        level: 75
      },
      {
        name: 'MongoDB',
        level: 70
      },
      {
        name: 'Material-UI',
        level: 85
      }
    ],
    []
  );


  // =======================================================
  // SERVICES
  // =======================================================

  const services = useMemo(
    () => [
      {
        icon: <FaReact />,
        title:
          'React UI Development',
        desc:
          'Building responsive, component-driven React applications using hooks, state management, and clean JSX structure.',
        points: [
          'React.js',
          'Hooks & State',
          'Component Architecture'
        ]
      },
      {
        icon: <FaPalette />,
        title:
          'UI Styling & Animations',
        desc:
          'Creating polished interfaces using Material-UI and CSS3 with smooth transitions and consistent visual design.',
        points: [
          'Material-UI',
          'CSS3 Animations',
          'Clean Layouts'
        ]
      },
      {
        icon: <FaMobileAlt />,
        title:
          'Responsive Design',
        desc:
          'Making sure every layout works well across mobile, tablet, and desktop using flexible CSS and media queries.',
        points: [
          'Mobile-First',
          'Media Queries',
          'Cross-Browser'
        ]
      },
      {
        icon: <FaServer />,
        title:
          'MERN Stack Apps',
        desc:
          'Developing full-stack web apps using MongoDB, Express.js, React, and Node.js with REST API integration.',
        points: [
          'Node.js & Express',
          'MongoDB',
          'REST APIs'
        ]
      },
      {
        icon: <FaShieldAlt />,
        title:
          'Auth & Role-Based Access',
        desc:
          'Implementing JWT-based login systems and role-based access control for secure multi-user applications.',
        points: [
          'JWT Authentication',
          'Role-Based Access',
          'Secure Routes'
        ]
      },
      {
        icon: <FaCode />,
        title:
          'Web App Maintenance',
        desc:
          'Fixing bugs, improving performance, and keeping existing web applications clean and up to date.',
        points: [
          'Bug Fixing',
          'Code Cleanup',
          'Performance Tuning'
        ]
      }
    ],
    []
  );


  // =======================================================
  // PROJECTS
  // =======================================================

  const projects = useMemo(
    () => [
      {
        title:
          'Move-N-Earn Parcel Delivery Web App',

        desc: [
          'Full-stack parcel delivery platform using React.js, Node.js, and MongoDB.',
          'Role-based login for enterprises and delivery partners with secure JWT sessions.',
          'Integrated Google Maps API for tracking parcels in real time.'
        ],

        tags: [
          'React',
          'Node.js',
          'MongoDB',
          'JWT',
          'Maps API'
        ],

        details:
          'A comprehensive parcel delivery platform built with the MERN stack. Features include real-time GPS tracking via Google Maps API, role-based dashboards for enterprises and delivery partners, JWT-secured sessions, and a fully responsive UI built with React.js and Material-UI.',

        github:
          'https://github.com/'
      },

      {
        title:
          'Transporter Management Dashboard',

        desc: [
          'Admin dashboard to manage fleets, drivers, and delivery tasks.',
          'Data visualization charts to monitor performance and revenue.',
          'Role-based permissions and secure CRUD APIs.'
        ],

        tags: [
          'React',
          'Material-UI',
          'Express',
          'Charts'
        ],

        details:
          'An enterprise-grade admin dashboard for fleet and transporter management. Includes interactive data visualization charts, driver performance tracking, revenue analytics, and a secure role-based permission system backed by Express.js APIs.',

        github:
          'https://github.com/'
      },

      {
        title:
          'Personal Portfolio Website',

        desc: [
          'Fully responsive personal site with smooth transitions, reveal animations, and EmailJS integration.',
          'SEO optimized with fast load times and polished visual hierarchy.'
        ],

        tags: [
          'React',
          'CSS3',
          'EmailJS',
          'Responsive'
        ],

        details:
          'A modern portfolio website built with React.js featuring dark/light mode, typing animations, scroll-triggered reveals, floating 3D badges, skill progress bars, and a working contact form powered by EmailJS. Fully responsive across all devices.',

        github:
          'https://github.com/'
      }
    ],
    []
  );


  // =======================================================
  // NAVIGATION
  // =======================================================

  const navItems = [
    'home',
    'about',
    'experience',
    'services',
    'projects',
    'skills',
    'certifications',
    'contact'
  ];


  // =======================================================
  // SECTION OBSERVER
  // =======================================================

  useEffect(() => {

    const sections =
      document.querySelectorAll(
        '.section'
      );


    const observer =
      new IntersectionObserver(
        (entries) => {

          entries.forEach(
            (entry) => {

              if (
                entry.isIntersecting
              ) {

                entry.target.classList.add(
                  'show'
                );

              }

            }
          );

        },
        {
          threshold: 0.12
        }
      );


    sections.forEach(
      (section) =>
        observer.observe(section)
    );


    return () =>
      observer.disconnect();

  }, [activeSection]);


  // =======================================================
  // NAVIGATION CLICK
  // =======================================================

  const handleNavClick = (
    section
  ) => {

    setActiveSection(section);

    setMenuOpen(false);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };


  // =======================================================
  // SCROLL TOP
  // =======================================================

  const scrollToTop =
    useCallback(() => {

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

    }, []);


  // =======================================================
  // NORMAL CONTACT FORM
  // =======================================================

  const sendEmail = async (e) => {

    e.preventDefault();

    if (isSending) return;


    const form =
      e.currentTarget;

    const formData =
      new FormData(form);


    const name =
      String(
        formData.get('name') || ''
      ).trim();

    const email =
      String(
        formData.get('email') || ''
      ).trim();

    const message =
      String(
        formData.get('message') || ''
      ).trim();


    setIsSending(true);


    try {

      const response =
        await fetch(
          `${API_URL}/api/send-email`,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json'
            },

            body: JSON.stringify({
              name,
              email,
              company:
                'Portfolio Contact Form',
              message
            })
          }
        );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.message ||
          'Failed to send email'
        );

      }


      showToast(
        '✅ Message sent successfully!',
        'success'
      );


      form.reset();

    } catch (error) {

      console.error(
        'Contact form error:',
        error
      );


      showToast(
        '❌ Failed to send message. Please make sure the backend is running.',
        'error'
      );

    } finally {

      setIsSending(false);

    }
  };


  // =======================================================
  // NAV PROGRESS
  // =======================================================

  const activeIndex =
    navItems.indexOf(
      activeSection
    );

  const progressPct =
    ((activeIndex + 1) /
      navItems.length) *
    100;


  // =======================================================
  // PORTFOLIO UI
  // =======================================================

  return (

    <div className="portfolio-shell">

      <div className="bg-orb orb-one"></div>
      <div className="bg-orb orb-two"></div>
      <div className="grid-overlay"></div>


      {/* NAV PROGRESS */}

      <div
        className="nav-progress"
        style={{
          width: `${progressPct}%`
        }}
      ></div>


      {/* ===================================================
          HEADER
      =================================================== */}

      <header className="header glass-panel">

        <button
          className="logo"
          onClick={() =>
            handleNavClick('home')
          }
        >
          Surendra Mustini
        </button>


        <div className="header-right">

          <button
            className="theme-toggle"
            onClick={() =>
              setDarkMode(!darkMode)
            }
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <FaSun />
            ) : (
              <FaMoon />
            )}
          </button>


          <button
            className="hamburger"
            onClick={() =>
              setMenuOpen(!menuOpen)
            }
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <FaTimes />
            ) : (
              <FaBars />
            )}
          </button>

        </div>


        <nav
          className={`navbar${
            menuOpen ? ' open' : ''
          }`}
        >

          {navItems.map(
            (section) => (

              <button
                key={section}
                onClick={() =>
                  handleNavClick(section)
                }
                className={
                  activeSection === section
                    ? 'active'
                    : ''
                }
              >
                {section
                  .charAt(0)
                  .toUpperCase() +
                  section.slice(1)}
              </button>

            )
          )}

        </nav>

      </header>


      {/* ===================================================
          HOME
      =================================================== */}

      {activeSection === 'home' && (

        <section
          className="home section show"
          id="home"
        >

          <div className="home-content">

            <span className="eyebrow">

              <span className="avail-dot"></span>

              Available for Work

            </span>


            <h1>
              Building immersive digital
              experiences with modern
              frontend engineering.
            </h1>


            <h3>

              <span className="typed-text">
                {typedText}
              </span>

              <span className="cursor">
                |
              </span>

            </h3>


            <p>
              I design and build polished
              web applications with a strong
              focus on responsive UI,
              accessibility, secure
              integrations, and premium
              user experience.
            </p>


            <div className="hero-actions">

              <button
                onClick={() =>
                  handleNavClick('contact')
                }
                className="btn btn-primary"
              >
                Hire Me
                <FaArrowRight />
              </button>


              <button
                onClick={() =>
                  handleNavClick('projects')
                }
                className="btn btn-secondary"
              >
                View Projects
              </button>


              <a
                href="/resume.pdf"
                download="Surendra-Mustini-Resume.pdf"
                className="btn btn-primary"
              >
                Download Resume
              </a>

            </div>


            <div
              className="stats-grid"
              ref={statsRef}
            >

              {stats.map(
                (item) => (

                  <div
                    className="stat-card glass-panel"
                    key={item.label}
                  >

                    <h4>
                      {item.value}
                      {item.suffix}
                    </h4>

                    <p>
                      {item.label}
                    </p>

                  </div>

                )
              )}

            </div>


            <div className="home-sci">

              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FaFacebook />
              </a>


              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>


              <a
                href="https://www.linkedin.com/in/mustini-surendra"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>


              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <FaGithub />
              </a>

            </div>

          </div>


          <div className="hero-visual">

            <div className="hero-card glass-panel floating-card main-portrait">

              <div className="image-ring"></div>

              <img
                src="mypic3.png"
                alt="Surendra Mustini"
              />

            </div>


            <div className="floating-badge glass-panel badge-top">
              <FaCode />
              Clean UI Architecture
            </div>


            <div className="floating-badge glass-panel badge-middle">
              <FaLayerGroup />
              3D Inspired Design
            </div>


            <div className="floating-badge glass-panel badge-bottom">
              <FaRocket />
              Fast & Scalable Delivery
            </div>

          </div>

        </section>

      )}


      {/* ===================================================
          ABOUT
      =================================================== */}

      {activeSection === 'about' && (

        <section
          className="section about show"
          id="about"
        >

          <div className="section-heading">

            <span className="eyebrow">
              About Me
            </span>

            <h2>
              Designing interfaces that
              feel futuristic and intuitive.
            </h2>

          </div>


          <div className="about-container">

            <div className="about-img glass-panel tilt-card">

              <img
                src="mypic3.png"
                alt="About Me"
              />

            </div>


            <div className="about-content glass-panel">

              <p>
                I specialize in React.js,
                JavaScript, HTML5, CSS3,
                and Material-UI. I build
                clean, modern interfaces
                with strong component
                architecture and thoughtful
                motion.
              </p>


              <p>
                My work blends engineering
                discipline with visual polish
                — from secure integrations
                and role-based systems to
                elegant layouts that elevate
                product experience.
              </p>


              <div className="about-badges">

                {[
                  'Problem Solver',
                  'Team Player',
                  'Fast Learner',
                  'Detail Oriented'
                ].map(
                  (badge) => (

                    <span
                      className="about-badge"
                      key={badge}
                    >
                      {badge}
                    </span>

                  )
                )}

              </div>

            </div>

          </div>

        </section>

      )}


      {/* ===================================================
          EXPERIENCE
      =================================================== */}

      {activeSection === 'experience' && (

        <section
          className="section experience show"
          id="experience"
        >

          <div className="section-heading">

            <span className="eyebrow">
              Experience
            </span>

            <h2>
              Professional journey focused
              on scalable frontend delivery.
            </h2>

          </div>


          <div className="timeline-wrapper">

            <div className="timeline-card glass-panel">

              <div className="timeline-dot"></div>


              <div className="timeline-header">

                <h3>
                  Software Engineer
                </h3>

                <span className="timeline-badge">
                  Full-Time
                </span>

              </div>


              <p>
                <strong>
                  Lyros Technologies Pvt Ltd
                </strong>
                {' '}| Hyderabad, Telangana
                <br />
                May 2023 – May 2025
              </p>


              <ul>

                <li>
                  Developed and maintained
                  scalable web applications
                  using the MERN stack.
                </li>

                <li>
                  Built responsive UIs with
                  React.js and Material-UI,
                  ensuring performance and
                  accessibility.
                </li>

                <li>
                  Implemented JWT
                  authentication,
                  role-based access control,
                  and secure API integrations.
                </li>

                <li>
                  Worked closely with
                  designers, backend developers,
                  and QA teams for end-to-end
                  delivery.
                </li>

                <li>
                  Optimized codebases,
                  improved SEO, and ensured
                  cross-browser compatibility.
                </li>

                <li>
                  Provided mentorship to
                  junior developers through
                  code reviews and pair
                  programming.
                </li>

              </ul>

            </div>

          </div>

        </section>

      )}


      {/* ===================================================
          SERVICES
      =================================================== */}

      {activeSection === 'services' && (

        <section
          className="section services show"
          id="services"
        >

          <div className="section-heading center">

            <span className="eyebrow">
              What I Offer
            </span>

            <h2>
              Services built around your
              product goals.
            </h2>

          </div>


          <div className="services-grid">

            {services.map(
              (service, index) => (

                <div
                  className="service-card glass-panel"
                  key={service.title}
                  style={{
                    animationDelay:
                      `${index * 0.08}s`
                  }}
                >

                  <div className="service-icon">
                    {service.icon}
                  </div>


                  <h3>
                    {service.title}
                  </h3>


                  <p>
                    {service.desc}
                  </p>


                  <ul className="service-points">

                    {service.points.map(
                      (point) => (

                        <li key={point}>

                          <FaCheckCircle className="check-icon" />

                          {point}

                        </li>

                      )
                    )}

                  </ul>

                </div>

              )
            )}

          </div>

        </section>

      )}


      {/* ===================================================
          PROJECTS
      =================================================== */}

      {activeSection === 'projects' && (

        <section
          className="section projects show"
          id="projects"
        >

          <div className="section-heading">

            <span className="eyebrow">
              Featured Work
            </span>

            <h2>
              Projects crafted with product
              thinking and modern engineering.
            </h2>

          </div>


          <div className="project-grid">

            {projects.map(
              (project) => (

                <article
                  className="project-card glass-panel"
                  key={project.title}
                  onClick={() =>
                    setSelectedProject(project)
                  }
                >

                  <h3>
                    {project.title}
                  </h3>


                  <ul>

                    {project.desc.map(
                      (description, index) => (

                        <li key={index}>
                          {description}
                        </li>

                      )
                    )}

                  </ul>


                  <div className="project-tags">

                    {project.tags.map(
                      (tag) => (

                        <span
                          className="tag"
                          key={tag}
                        >
                          {tag}
                        </span>

                      )
                    )}

                  </div>


                  <button className="project-view-btn">
                    View Details
                    <FaExternalLinkAlt />
                  </button>

                </article>

              )
            )}

          </div>

        </section>

      )}


      {/* ===================================================
          SKILLS
      =================================================== */}

      {activeSection === 'skills' && (

        <section
          className="section skills show"
          id="skills"
        >

          <div className="section-heading">

            <span className="eyebrow">
              Core Skills
            </span>

            <h2>
              Technology stack for premium
              frontend products.
            </h2>

          </div>


          <div className="skills-grid">

            {skillCards.map(
              (skill, index) => (

                <div
                  className="skill-card glass-panel"
                  key={skill.name}
                  style={{
                    animationDelay:
                      `${index * 0.07}s`
                  }}
                >

                  <span className="skill-icon">
                    {skill.icon}
                  </span>

                  {skill.name}

                </div>

              )
            )}

          </div>


          <div className="skill-bars">

            <h3 className="skill-bars-title">
              Proficiency
            </h3>


            {skillLevels.map(
              (skill, index) => (

                <div
                  className="skill-bar-row"
                  key={skill.name}
                  style={{
                    animationDelay:
                      `${index * 0.1}s`
                  }}
                >

                  <div className="skill-bar-label">

                    <span>
                      {skill.name}
                    </span>

                    <span>
                      {skill.level}%
                    </span>

                  </div>


                  <div className="skill-bar-track">

                    <div
                      className="skill-bar-fill"
                      style={{
                        width:
                          `${skill.level}%`
                      }}
                    ></div>

                  </div>

                </div>

              )
            )}

          </div>

        </section>

      )}


      {/* ===================================================
          CERTIFICATIONS
      =================================================== */}

      {activeSection === 'certifications' && (

        <section
          className="section certifications show"
          id="certifications"
        >

          <div className="section-heading">

            <span className="eyebrow">
              Certifications
            </span>

            <h2>
              Continuous learning and
              professional growth.
            </h2>

          </div>


          <div className="cert-grid">

            {certifications.map(
              (certificate) => (

                <div
                  className="cert-card glass-panel"
                  key={certificate.title}
                >

                  <FaCertificate className="cert-icon" />

                  <h3>
                    {certificate.title}
                  </h3>

                  <p>
                    {certificate.issuer}
                  </p>

                  <span className="cert-year">
                    {certificate.year}
                  </span>

                </div>

              )
            )}

          </div>

        </section>

      )}


      {/* ===================================================
          CONTACT
      =================================================== */}

      {activeSection === 'contact' && (

        <section
          className="section contact show"
          id="contact"
        >

          <div className="section-heading center">

            <span className="eyebrow">
              Contact
            </span>

            <h2>
              Let's build something
              exceptional together.
            </h2>

          </div>


          <div className="contact-layout">

            <div className="contact-info glass-panel">

              <p>
                <strong>
                  📍 Hyderabad, Telangana
                </strong>
              </p>

              <p>
                <strong>
                  📧 mustinisurendra@gmail.com
                </strong>
              </p>

              <p>
                <strong>
                  📞 +91-7989378813
                </strong>
              </p>

              <p>

                <strong>
                  🔗{' '}

                  <a
                    href="https://www.linkedin.com/in/mustini-surendra"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn Profile
                  </a>

                </strong>

              </p>


              <p className="contact-note">
                Available for frontend
                engineering, UI modernization,
                and product-focused web
                experiences.
              </p>

            </div>


            <form
              onSubmit={sendEmail}
              className="contact-form glass-panel"
            >

              <label htmlFor="name">
                Name:
              </label>

              <input
                id="name"
                type="text"
                name="name"
                placeholder="Your Name"
                className="contact-input"
                required
              />


              <label htmlFor="email">
                Email:
              </label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="Your Email"
                className="contact-input"
                required
              />


              <label htmlFor="message">
                Message:
              </label>

              <textarea
                id="message"
                name="message"
                rows="6"
                placeholder="Tell me about your project"
                className="contact-input"
                required
              ></textarea>


              <button
                type="submit"
                className="contact-button"
                disabled={isSending}
              >
                {isSending
                  ? 'Sending...'
                  : 'Send Message'}
              </button>

            </form>

          </div>

        </section>

      )}


      {/* ===================================================
          FOOTER
      =================================================== */}

      <footer className="footer glass-panel">

        <div className="footer-inner">

          <button
            className="logo"
            onClick={() =>
              handleNavClick('home')
            }
          >
            Surendra Mustini
          </button>


          <p className="footer-tagline">
            Frontend Engineer • React
            Specialist • UI Crafter
          </p>


          <div className="footer-links">

            {[
              'home',
              'about',
              'experience',
              'services',
              'projects',
              'skills',
              'contact'
            ].map(
              (section) => (

                <button
                  key={section}
                  onClick={() =>
                    handleNavClick(section)
                  }
                >
                  {section
                    .charAt(0)
                    .toUpperCase() +
                    section.slice(1)}
                </button>

              )
            )}

          </div>


          <div className="footer-social">

            <a
              href="https://www.linkedin.com/in/mustini-surendra"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedin />
            </a>


            <a
              href="https://github.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <FaGithub />
            </a>


            <a
              href="mailto:mustinisurendra1995@gmail.com"
              aria-label="Email"
            >
              <FaEnvelope />
            </a>

          </div>


          <p className="footer-copy">
            © {new Date().getFullYear()}
            {' '}Surendra Mustini.
            All rights reserved.
          </p>

        </div>

      </footer>


      {/* ===================================================
          SCROLL TO TOP
      =================================================== */}

      {showScrollTop && (

        <button
          className="scroll-top"
          onClick={scrollToTop}
          aria-label="Back to top"
        >
          <FaArrowUp />
        </button>

      )}


      {/* ===================================================
          PROJECT MODAL
      =================================================== */}

      {selectedProject && (

        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedProject(null)
          }
        >

          <div
            className="modal-box glass-panel"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            <button
              className="modal-close"
              onClick={() =>
                setSelectedProject(null)
              }
            >
              <FaClose />
            </button>


            <h2>
              {selectedProject.title}
            </h2>


            <p className="modal-details">
              {selectedProject.details}
            </p>


            <div
              className="project-tags"
              style={{
                marginTop: 16
              }}
            >

              {selectedProject.tags.map(
                (tag) => (

                  <span
                    className="tag"
                    key={tag}
                  >
                    {tag}
                  </span>

                )
              )}

            </div>


            <a
              href={selectedProject.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary modal-btn"
            >
              <FaGithub />
              View on GitHub
            </a>

          </div>

        </div>

      )}


      {/* ===================================================
          CHATBOT
      =================================================== */}

      <PortfolioChatbot />


      {/* ===================================================
          TOAST
      =================================================== */}

      {toast && (

        <div
          className={`toast toast-${toast.type}`}
        >

          {toast.type === 'success' ? (
            <FaCheckCircle />
          ) : (
            <FaTimesCircle />
          )}


          <span>
            {toast.message}
          </span>


          <button
            onClick={() =>
              setToast(null)
            }
          >
            <FaClose />
          </button>

        </div>

      )}

    </div>
  );
}


export default Portfolio;