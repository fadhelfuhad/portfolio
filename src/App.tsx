import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ACHIEVEMENTS, EDUCATION, EXPERIENCE, FACTS, NAV, PROFILE, PROJECTS, SKILLS, STATS, STORY } from "./data";
import { Icon } from "./icons";
import { Cursor } from "./cursor";

export default function App() {
  useReveal();
  // The page renders after the browser's own jump to #section, so redo it once mounted.
  useEffect(() => {
    if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
  }, []);
  return (
    <>
      <Background />
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <Achievements />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

/* ---------- shared ---------- */

// Fades things in (rising, coming into focus) the first time they scroll into view.
// Siblings that appear together are staggered so a grid fills in one card at a time.
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    els.forEach((el) => {
      const siblings = el.parentElement ? [...el.parentElement.children].filter((c) => c.classList.contains("reveal")) : [];
      el.style.transitionDelay = `${Math.min(siblings.indexOf(el), 6) * 90}ms`;
    });
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            el.classList.add("in");
            io.unobserve(el);
            // Drop the stagger once it has played, so hover effects respond instantly.
            setTimeout(() => (el.style.transitionDelay = ""), 1500);
          }
        }),
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// Counts up from 0 to a value like "5+" the first time it's on screen.
function Counter({ value }: { value: string }) {
  const [, num, suffix] = value.match(/^(\d+)(.*)$/) ?? [, "", value];
  const target = Number(num);
  const [shown, setShown] = useState(num ? 0 : target);
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !num) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return setShown(target);
    let frame = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / 1600);
        setShown(Math.round(target * (1 - Math.pow(1 - t, 3))));
        if (t < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [num, target]);
  return (
    <strong ref={ref}>
      {num ? shown : ""}
      {suffix}
    </strong>
  );
}

function Section({ id, eyebrow, title, sub, children }: { id: string; eyebrow: string; title: string; sub: string; children: ReactNode }) {
  return (
    <section id={id} className="section">
      <header className="section-head reveal">
        <span className="pill-label">{eyebrow}</span>
        <h2>{title}</h2>
        <p>{sub}</p>
      </header>
      {children}
    </section>
  );
}

const tone = (i: number) => `tone-${i % 3}`;

function Background() {
  return (
    <div className="bg" aria-hidden>
      <i className="glow glow-a" />
      <i className="glow glow-b" />
      <i className="glow glow-c" />
      <i className="grid" />
      {Array.from({ length: 18 }, (_, i) => (
        <i
          key={i}
          className="particle"
          style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%`, animationDelay: `${(i % 6) * 0.9}s`, animationDuration: `${5 + (i % 5)}s` }}
        />
      ))}
    </div>
  );
}

/* ---------- nav ---------- */

function Nav() {
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(scrollY > 20);
      const mid = scrollY + innerHeight * 0.35;
      let current = "home";
      for (const n of NAV) {
        const el = document.getElementById(n.id);
        if (el && el.offsetTop <= mid) current = n.id;
      }
      setActive(current);
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
      <a href="#home" className="logo" onClick={() => setOpen(false)}>
        &lt;Fadhel<span>/</span>&gt;
      </a>
      <div className={`links ${open ? "open" : ""}`}>
        {NAV.map((n) => (
          <a key={n.id} href={`#${n.id}`} className={active === n.id ? "on" : ""} onClick={() => setOpen(false)}>
            {n.label}
          </a>
        ))}
      </div>
      <div className="nav-end">
        <a className="nav-icon" href={PROFILE.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn profile" title="LinkedIn">
          <Icon name="linkedin" size={17} />
        </a>
        <a className="nav-icon" href={PROFILE.github} target="_blank" rel="noreferrer" aria-label="GitHub profile" title="GitHub">
          <Icon name="github" size={17} />
        </a>
        <a className="btn outline hire" href="#contact">
          Hire Me
        </a>
        <button className="menu" onClick={() => setOpen((o) => !o)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>
          <Icon name={open ? "close" : "menu"} size={22} />
        </button>
      </div>
    </nav>
  );
}

/* ---------- sections ---------- */

function Hero() {
  return (
    <section id="home" className="hero">
      <span className="status reveal">
        <i className="live" />
        <Icon name="sparkle" size={14} />
        Available for work
      </span>
      <div className="avatar reveal">
        <img src={PROFILE.photo} alt="Portrait of Muhammed Fadhel Fuhad" width={150} height={150} />
      </div>
      <p className="hello reveal">Hello, I'm</p>
      <h1 className="reveal">{PROFILE.name}</h1>
      <p className="role reveal">
        <span className="grad">{PROFILE.title}</span>
      </p>
      <p className="stack reveal">{PROFILE.stack}</p>
      <p className="intro reveal">{PROFILE.intro}</p>
      <div className="cta reveal">
        <a className="btn primary" href="#contact">
          Get In Touch <Icon name="arrow" size={16} />
        </a>
        <a className="btn ghost" href="#projects">
          View My Work
        </a>
        <a className="btn ghost" href={PROFILE.cv} download>
          <Icon name="download" size={16} /> Download CV
        </a>
      </div>
      <div className="stats">
        {STATS.map((s, i) => (
          <div key={s.label} className={`stat card ${tone(i)} reveal`}>
            <Counter value={s.value} />
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function About() {
  return (
    <Section id="about" eyebrow="About" title="About Me" sub="Frontend developer by trade, IT engineer by background.">
      <div className="about">
        <article className="card tone-0 story reveal">
          <h3>My Story</h3>
          {STORY.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </article>
        <aside className="card tone-2 facts reveal">
          <h4>Quick Facts</h4>
          <ul>
            {FACTS.map((f) => (
              <li key={f.label}>
                <span className="ic">
                  <Icon name={f.icon} size={16} />
                </span>
                <div>
                  <small>{f.label}</small>
                  {"href" in f ? <a href={f.href}>{f.value}</a> : <span>{f.value}</span>}
                </div>
              </li>
            ))}
          </ul>
          <a className="btn primary small" href={PROFILE.cv} download>
            <Icon name="download" size={15} /> Download CV
          </a>
        </aside>
      </div>
    </Section>
  );
}

function Skills() {
  return (
    <Section id="skills" eyebrow="Expertise" title="Skills & Tools" sub="The technologies I use to ship reliable web and mobile products.">
      <div className="grid-3">
        {SKILLS.map((s, i) => (
          <article key={s.title} className={`card ${tone(i)} skill reveal`}>
            <div className="card-title">
              <span className="ic">
                <Icon name={s.icon} />
              </span>
              <h3>{s.title}</h3>
            </div>
            <p>{s.blurb}</p>
            <div className="chips">
              {s.items.map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

function Experience() {
  return (
    <Section id="experience" eyebrow="Career" title="Experience" sub="From IT intern to leading frontend work on production apps.">
      <ol className="timeline">
        {EXPERIENCE.map((e, i) => (
          <li key={e.company} className={i % 2 ? "right" : "left"}>
            <span className="node" aria-hidden />
            <article className={`card ${tone(i)} job reveal`}>
              <div className="card-title">
                <span className="ic">
                  <Icon name="briefcase" size={16} />
                </span>
                <h3>{e.role}</h3>
              </div>
              <p className="meta">
                <b>{e.company}</b> · {e.period}
              </p>
              <p className="place">{e.place}</p>
              <ul>
                {e.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </article>
          </li>
        ))}
      </ol>
    </Section>
  );
}

function Projects() {
  return (
    <Section id="projects" eyebrow="Portfolio" title="Featured Projects" sub="Things I've built, on my own and at work.">
      <div className="grid-2">
        {PROJECTS.map((p, i) => (
          <article key={p.title} className={`card ${tone(i)} project reveal`}>
            <div className="shot">
              {"image" in p ? (
                <img src={p.image} alt={`${p.title} screenshot`} loading="lazy" />
              ) : (
                <ProjectArt kind={p.art} />
              )}
              <span className="kind">{p.kind}</span>
            </div>
            <div className="project-body">
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              <div className="chips">
                {p.tags.map((t) => (
                  <span key={t} className="chip">
                    {t}
                  </span>
                ))}
              </div>
              {"link" in p && (
                <div className="project-links">
                  <a className="btn primary small" href={p.link} target="_blank" rel="noreferrer">
                    Open live site <Icon name="external" size={14} />
                  </a>
                  {p.repo ? (
                    <a className="btn ghost small" href={p.repo} target="_blank" rel="noreferrer">
                      <Icon name="github" size={15} /> View code
                    </a>
                  ) : (
                    <span className="btn ghost small disabled" title="This repository is private">
                      <Icon name="github" size={15} /> Private repo
                    </span>
                  )}
                  <span className="lock">
                    <Icon name="lock" size={13} /> {p.note}
                  </span>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

// Illustrations for work projects that have no public link.
function ProjectArt({ kind }: { kind: "mobile" | "dashboard" }) {
  if (kind === "mobile") {
    return (
      <div className="art art-mobile">
        <div className="device">
          <i className="bar" />
          <i className="row" />
          <i className="row short" />
          <i className="map" />
          <i className="row" />
          <i className="btn-mock" />
        </div>
        <div className="device back">
          <i className="bar" />
          <i className="row" />
          <i className="row short" />
          <i className="row" />
        </div>
      </div>
    );
  }
  return (
    <div className="art art-dash">
      <div className="panel">
        <i className="side" />
        <div className="cards">
          <i />
          <i />
          <i />
        </div>
        <div className="chart">
          {[40, 65, 50, 80, 60, 90, 72].map((h, i) => (
            <i key={i} style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Education() {
  return (
    <Section id="education" eyebrow="Learning" title="Education" sub="Degree and certification.">
      <div className="grid-2 narrow">
        {EDUCATION.map((e, i) => (
          <article key={e.title} className={`card ${tone(i * 2)} edu reveal`}>
            <div className="card-title">
              <span className="ic">
                <Icon name="cap" size={16} />
              </span>
              <div>
                <h3>{e.title}</h3>
                <p className="school">{e.school}</p>
              </div>
            </div>
            <p className="year">{e.period}</p>
            <p>{e.detail}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}

function Achievements() {
  return (
    <Section id="achievements" eyebrow="Highlights" title="Achievements" sub="Recognition and experience beyond the day job.">
      <div className="grid-2 narrow">
        {ACHIEVEMENTS.map((a, i) => (
          <article key={a.title} className={`card ${tone(i)} achievement reveal`}>
            <span className="ic big">
              <Icon name={a.icon} size={20} />
            </span>
            <div>
              <h3>{a.title}</h3>
              <p>{a.detail}</p>
              {a.year && <span className="year">{a.year}</span>}
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

function Contact() {
  const [copied, setCopied] = useState(false);
  const send = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const subject = String(f.get("subject") || "Hello from your portfolio");
    const body = `${f.get("message")}\n\n${f.get("name")}\n${f.get("email")}`;
    location.href = `mailto:${PROFILE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  const copy = async () => {
    await navigator.clipboard.writeText(PROFILE.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <Section id="contact" eyebrow="Contact" title="Get In Touch" sub="Open to frontend roles and collaborations. Available immediately.">
      <div className="contact">
        <aside className="card tone-0 connect reveal">
          <h3>Let's Connect</h3>
          <p>Based in Manama, Bahrain, on a transferable work visa.</p>
          <ul>
            <li>
              <span className="ic">
                <Icon name="mail" size={16} />
              </span>
              <div>
                <small>Email</small>
                <span className="row">
                  <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
                  <button className="copy" onClick={copy} aria-label="Copy email address">
                    <Icon name={copied ? "check" : "copy"} size={14} />
                  </button>
                </span>
              </div>
            </li>
            <li>
              <span className="ic">
                <Icon name="phone" size={16} />
              </span>
              <div>
                <small>Phone</small>
                <a href={PROFILE.phoneHref}>{PROFILE.phone}</a>
              </div>
            </li>
            <li>
              <span className="ic">
                <Icon name="pin" size={16} />
              </span>
              <div>
                <small>Location</small>
                <span>{PROFILE.location}</span>
              </div>
            </li>
          </ul>
          <Socials />
        </aside>
        <form className="card tone-2 form reveal" onSubmit={send}>
          <div className="two">
            <label>
              <span>Name</span>
              <input name="name" placeholder="Your name" required autoComplete="name" />
            </label>
            <label>
              <span>Email</span>
              <input name="email" type="email" placeholder="you@example.com" required autoComplete="email" />
            </label>
          </div>
          <label>
            <span>Subject</span>
            <input name="subject" placeholder="Frontend role at …" />
          </label>
          <label>
            <span>Message</span>
            <textarea name="message" rows={5} placeholder="Tell me about the role or project…" required />
          </label>
          <button className="btn primary wide" type="submit">
            Send Message <Icon name="send" size={16} />
          </button>
          <p className="form-note">Opens your email app with the message filled in.</p>
        </form>
      </div>
    </Section>
  );
}

function Socials() {
  return (
    <div className="socials">
      <a href={PROFILE.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
        <Icon name="linkedin" size={17} />
      </a>
      <a href={PROFILE.github} target="_blank" rel="noreferrer" aria-label="GitHub">
        <Icon name="github" size={17} />
      </a>
      <a href={`mailto:${PROFILE.email}`} aria-label="Email">
        <Icon name="mail" size={17} />
      </a>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div>
        <a href="#home" className="logo">
          &lt;{PROFILE.fullName}
          <span>/</span>&gt;
        </a>
        <p>Senior Frontend Developer · Manama, Bahrain</p>
      </div>
      <Socials />
      <p className="copy-line">© {new Date().getFullYear()} {PROFILE.fullName}</p>
    </footer>
  );
}
