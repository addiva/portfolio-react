
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

// Per cambiare l'illustrazione del mockup:
// 1. Importa l'immagine: import myImage from "./assets/my-illustration.png"
// 2. Sostituisci la riga sotto con: const ILLUSTRATION_SRC = myImage
const ILLUSTRATION_SRC = null

const DefaultIllustration = () => (
  <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <circle cx="100" cy="110" r="85" fill="#f5f3ff" />
    <rect x="45" y="145" width="30" height="30" rx="6" fill="#c4b5fd" />
    <rect x="85" y="125" width="30" height="50" rx="6" fill="#a78bfa" />
    <rect x="125" y="105" width="30" height="70" rx="6" fill="#7c3aed" />
    <circle cx="110" cy="90" r="7" fill="#1e1b4b" />
    <path d="M110 97 v12 l-6 8 m6 -8 l6 8" stroke="#1e1b4b" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
)

const SignalIcon = () => (
  <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor" aria-hidden="true">
    <rect x="0" y="7" width="3" height="4" rx="0.5" />
    <rect x="4" y="5" width="3" height="6" rx="0.5" />
    <rect x="8" y="2" width="3" height="9" rx="0.5" />
    <rect x="12" y="0" width="3" height="11" rx="0.5" />
  </svg>
)

const WifiIcon = () => (
  <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" aria-hidden="true">
    <path d="M8 11.5c-.7 0-1.3-.6-1.3-1.3 0-.7.6-1.3 1.3-1.3.7 0 1.3.6 1.3 1.3 0 .7-.6 1.3-1.3 1.3zm3.7-3.4c-1-.9-2.3-1.4-3.7-1.4s-2.7.5-3.7 1.4l-.7-.7C4.7 6.4 6.3 5.7 8 5.7s3.3.7 4.4 1.7l-.7.7zm2.3-2.3C12.4 4.4 10.3 3.6 8 3.6s-4.4.8-6 2.2l-.7-.7C3 3.6 5.4 2.7 8 2.7s5 .9 6.7 2.4l-.7.7z" />
  </svg>
)

const BatteryIcon = () => (
  <svg width="22" height="11" viewBox="0 0 22 11" fill="none" aria-hidden="true">
    <rect x="0.5" y="0.5" width="18" height="10" rx="2.5" stroke="currentColor" strokeOpacity="0.45" />
    <rect x="2" y="2" width="15" height="7" rx="1" fill="currentColor" />
    <rect x="20" y="3.5" width="1.5" height="4" rx="0.5" fill="currentColor" fillOpacity="0.45" />
  </svg>
)

const Chevron = () => (
  <svg width="8" height="10" viewBox="0 0 8 10" fill="none" aria-hidden="true">
    <path d="M1.5 1l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

function App() {
  const [lights, setLights] = useState([])
  const lastPosition = useRef({ x: 0, y: 0 })
  const [isCaseOpen, setIsCaseOpen] = useState(false)
  const [sbScreen, setSbScreen] = useState(1)
  const [sbTime, setSbTime] = useState("22:06")
  const [sbProgress, setSbProgress] = useState(0)
  const [sbAnalysisDone, setSbAnalysisDone] = useState(false)

  useEffect(() => {
    const tick = () => {
      const d = new Date()
      const h = String(d.getHours()).padStart(2, "0")
      const m = String(d.getMinutes()).padStart(2, "0")
      setSbTime(`${h}:${m}`)
    }
    tick()
    const id = setInterval(tick, 30000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (sbScreen !== 4) return
    setSbProgress(0)
    setSbAnalysisDone(false)
    let p = 0
    const id = setInterval(() => {
      p += Math.random() * 18
      if (p >= 100) {
        p = 100
        setSbAnalysisDone(true)
        clearInterval(id)
      }
      setSbProgress(p)
    }, 380)
    return () => clearInterval(id)
  }, [sbScreen])

  const sbCircumference = 2 * Math.PI * 42
  const sbMatchPct = 70
  const sbRingOffset = sbCircumference - (sbMatchPct / 100) * sbCircumference
  const sbIllustration = ILLUSTRATION_SRC ? (
    <img src={ILLUSTRATION_SRC} alt="" className="sb-bubble-img" />
  ) : (
    <DefaultIllustration />
  )

  useEffect(() => {
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty("--x", `${e.clientX}px`)
      document.documentElement.style.setProperty("--y", `${e.clientY}px`)

      const deltaX = e.clientX - lastPosition.current.x
      const deltaY = e.clientY - lastPosition.current.y
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI)

      lastPosition.current = { x: e.clientX, y: e.clientY }

      setLights((prev) => [
        ...prev.slice(-10),
        {
          x: e.clientX,
          y: e.clientY,
          angle,
          id: `${Date.now()}-${Math.random()}`,
        },
      ])
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <main>
      <div className="cursor-light"></div>

      {lights.map((light) => (
        <span
          key={light.id}
          className="light-trail"
          style={{
            left: light.x,
            top: light.y,
            rotate: `${light.angle}deg`,
          }}
        />
      ))}

      <section className="hero">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <p className="eyebrow">MARIA UTKINA / UX UI DESIGNER</p>

          <motion.h1
            initial={{ opacity: 0, filter: "blur(10px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.8, ease: "easeOut" }}
          >
            I turn
            <br />
            complexity
            <br />
            into clarity.
          </motion.h1>

          <motion.p
            className="hero-text"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 1.1 }}
          >
            I design digital experiences by looking deeply into complex situations,
            finding hidden light, and turning confusion into clear direction.
          </motion.p>

          <motion.a
            href="#journey"
            className="scroll-link"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            Enter the journey
          </motion.a>
        </motion.div>
      </section>

      <section id="journey" className="journey-section">
        <div className="journey-line"></div>

        <motion.div
          className="journey-step step-one"
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <span>01</span>
          <h2>Some paths feel impossible to navigate.</h2>
        </motion.div>

        <motion.div
          className="journey-step step-two"
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <span>02</span>
          <h2>I search for light inside complex systems.</h2>
        </motion.div>

        <motion.div
          className="journey-step step-three"
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <span>03</span>
          <h2>Then I turn that light into structure.</h2>
        </motion.div>
      </section>

      <section className="burn-section">
        <motion.div
          className="burn-reveal"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          viewport={{ once: true }}
        >
          <p className="eyebrow">THE IDEA</p>
          <h2>
            Light does not erase the dark.
            <br />
            It helps us understand it.
          </h2>
          <p>
            My design process is about noticing details, asking deeper questions,
            and creating products that help people move forward.
          </p>
        </motion.div>
      </section>

      <section className="work-section">
        <p className="eyebrow">SELECTED WORK</p>

        <motion.div
          className="work-card"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          viewport={{ once: true }}
        >
          <div className="project-copy">
            <span>01 / CASE STUDY</span>
            <h2>SkillBridge</h2>
            <p>
              A mobile app concept that helps students and professionals find missing
              skills, understand job requirements, and move closer to their next opportunity.
            </p>
            <button onClick={() => setIsCaseOpen(true)}>View Case Study</button>
          </div>

          <motion.div
            className="phone-mockup"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="sb-phone">
              <div className="sb-notch" />
              <div className="sb-status-bar">
                <span className="sb-time">{sbTime}</span>
                <div className="sb-status-icons">
                  <SignalIcon />
                  <WifiIcon />
                  <span className="sb-battery-pct">87%</span>
                  <BatteryIcon />
                </div>
              </div>

              {sbScreen === 1 && (
                <div className="sb-screen">
                  <div className="sb-logo">SkillBridge</div>
                  <div className="sb-screen-body sb-center">
                    <h2 className="sb-title">
                      Find your <span className="sb-purple">skill gaps.</span>
                      <br />
                      Get hired faster.
                    </h2>
                    <p className="sb-subtitle">Understand your skill gaps in seconds.</p>
                    <div className="sb-bubble">{sbIllustration}</div>
                  </div>
                  <button className="sb-btn" onClick={() => setSbScreen(2)} type="button">
                    Get Started
                  </button>
                </div>
              )}

              {sbScreen === 2 && (
                <div className="sb-screen">
                  <div className="sb-logo">SkillBridge</div>
                  <div className="sb-screen-body">
                    <h2 className="sb-welcome">
                      Welcome <span className="sb-purple">back!</span>
                    </h2>
                    <p className="sb-subtitle-sm">Sign in to continue or create an account</p>
                    <div className="sb-input-group">
                      <input type="email" placeholder="Email" />
                    </div>
                    <div className="sb-input-group">
                      <input type="password" placeholder="Password" />
                    </div>
                    <div className="sb-forgot">Forgot password?</div>
                  </div>
                  <button className="sb-btn" onClick={() => setSbScreen(3)} type="button">
                    Continue
                  </button>
                </div>
              )}

              {sbScreen === 3 && (
                <div className="sb-screen">
                  <div className="sb-logo">SkillBridge</div>
                  <div className="sb-screen-body">
                    <h2 className="sb-h2 sb-center-text">Let's analyze your skills</h2>
                    <div className="sb-upload-card">
                      <div className="sb-upload-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path d="M12 16V4M12 4l-5 5M12 4l5 5M5 20h14" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <p className="sb-card-title">Upload CV</p>
                      <p className="sb-card-sub">Upload your file in seconds.</p>
                    </div>
                    <div className="sb-divider"><span>OR</span></div>
                    <div className="sb-paste-card">
                      <p className="sb-card-title">Paste Job Description</p>
                      <p className="sb-card-sub">Paste job requirements</p>
                    </div>
                  </div>
                  <button className="sb-btn" onClick={() => setSbScreen(4)} type="button">
                    Start Analysis
                  </button>
                </div>
              )}

              {sbScreen === 4 && (
                <div className="sb-screen">
                  <div className="sb-logo">SkillBridge</div>
                  <div className="sb-screen-body">
                    <h2 className="sb-h2">Analyzing your skills...</h2>
                    <div className="sb-progress-track">
                      <div className="sb-progress-bar" style={{ width: `${sbProgress}%` }} />
                    </div>
                    <div className="sb-matching-card">
                      <p className="sb-matching-label">Matching your skills..</p>
                      <div className="sb-loader-row">
                        <span className="sb-dot sb-dot-active" />
                        <div className="sb-loader-bar sb-shimmer" />
                      </div>
                      <div className="sb-loader-row">
                        <span className="sb-dot sb-dot-active" />
                        <div className="sb-loader-bar sb-shimmer" style={{ width: "75%" }} />
                      </div>
                      <div className="sb-loader-row sb-faded">
                        <span className="sb-dot" />
                        <div className="sb-loader-bar" style={{ width: "50%" }} />
                      </div>
                    </div>
                  </div>
                  <button
                    className={`sb-btn${!sbAnalysisDone ? " sb-btn-disabled" : ""}`}
                    onClick={() => sbAnalysisDone && setSbScreen(5)}
                    type="button"
                  >
                    Analyze Skills
                  </button>
                </div>
              )}

              {sbScreen === 5 && (
                <div className="sb-screen">
                  <div className="sb-logo">SkillBridge</div>
                  <div className="sb-screen-body sb-center">
                    <h2 className="sb-h2">You're close to your goal</h2>
                    <div className="sb-ring-wrap">
                      <svg width="180" height="180" viewBox="0 0 100 100" className="sb-ring-svg">
                        <circle cx="50" cy="50" r="42" fill="transparent" stroke="#f1f0ff" strokeWidth="8" />
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          fill="transparent"
                          stroke="url(#sbArc)"
                          strokeWidth="8"
                          strokeDasharray={sbCircumference}
                          strokeDashoffset={sbRingOffset}
                          strokeLinecap="round"
                          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }}
                        />
                        <defs>
                          <linearGradient id="sbArc" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="sb-ring-center">
                        <span className="sb-ring-num">70</span>
                        <span className="sb-ring-label">Match</span>
                      </div>
                    </div>
                    <div className="sb-missing">
                      <h3 className="sb-missing-h">Missing Skills:</h3>
                      <ul className="sb-missing-list">
                        <li><span /> React</li>
                        <li><span /> UX Research</li>
                        <li><span /> APIs</li>
                      </ul>
                    </div>
                  </div>
                  <button className="sb-btn" onClick={() => setSbScreen(6)} type="button">
                    View Learning Plan <Chevron />
                  </button>
                </div>
              )}

              {sbScreen === 6 && (
                <div className="sb-screen">
                  <div className="sb-logo">SkillBridge</div>
                  <div className="sb-screen-body">
                    <h2 className="sb-h2">Your Learning Plan</h2>
                    <div className="sb-plan-item sb-plan-done">
                      <div className="sb-check">
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <span>Learn React Basics</span>
                    </div>
                    <div className="sb-plan-item">
                      <div className="sb-checkbox" />
                      <span>Build a Project</span>
                    </div>
                    <div className="sb-plan-item">
                      <div className="sb-checkbox" />
                      <span>Practice APIs</span>
                    </div>
                  </div>
                  <button className="sb-btn" onClick={() => setSbScreen(1)} type="button">
                    Continue <Chevron />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </section>

      <section className="cv-section">
        <motion.div
          className="cv-card"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <p className="eyebrow">ABOUT / CV</p>

          <h2>
            Junior UX/UI Designer looking for internship or junior opportunities.
          </h2>

          <p>
            UX/UI Designer focused on creating clear and user-centered digital experiences.
            Skilled in Figma, wireframing, user flows, prototyping, Webflow and basic
            front-end development.
          </p>

          <div className="cv-grid">
            <div>
              <h3>Design</h3>
              <p>Figma</p>
              <p>Wireframing</p>
              <p>User Flows</p>
              <p>Prototyping</p>
            </div>

            <div>
              <h3>Basic Front-End</h3>
              <p>HTML</p>
              <p>CSS</p>
              <p>JavaScript</p>
              <p>Webflow</p>
            </div>

            <div>
              <h3>Experience</h3>
              <p>Altshuler Shaham</p>
              <p>Meitav</p>
              <p>HaMeshak Boutique</p>
            </div>
          </div>

          <a className="cv-button" href="/Maria_Utkina_CV.pdf" target="_blank">
            Open CV
          </a>
        </motion.div>
      </section>

      <footer>
        <p>Currently looking for junior or internship UX/UI opportunities.</p>
        <div className="footer-links">
          <a href="mailto:mariutkka@gmail.com">mariutkka@gmail.com</a>
          <a href="tel:0558865261">055-8865261</a>
        </div>
      </footer>

      {isCaseOpen && (
        <div className="case-overlay">
          <motion.div
            className="case-modal"
            initial={{ opacity: 0, y: 60, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <button className="close-btn" onClick={() => setIsCaseOpen(false)}>×</button>

            <p className="eyebrow">CASE STUDY / SKILLBRIDGE</p>
            <h2>Helping job seekers understand what is missing.</h2>

            <div className="case-grid">
              <div>
                <h3>Problem</h3>
                <p>
                  Students and junior professionals often feel lost when applying for jobs.
                  They do not always know which skills they are missing.
                </p>
              </div>

              <div>
                <h3>Goal</h3>
                <p>
                  Create a simple mobile experience that turns confusion into a clear learning direction.
                </p>
              </div>

              <div>
                <h3>Process</h3>
                <p>
                  Research, user flow, wireframes, visual design, prototype and high fidelity screens.
                </p>
              </div>

              <div>
                <h3>Solution</h3>
                <p>
                  Users upload a CV or paste a job description, get a match score,
                  see missing skills and follow a learning plan.
                </p>
              </div>
            </div>

            <div className="case-result">
              <h3>Final outcome</h3>
              <p>
                SkillBridge turns a stressful job search into a guided path — showing users
                where they are, what is missing, and what to do next.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  )
}

export default App