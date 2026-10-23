import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { ACHIEVEMENTS, EDUCATION, EXPERIENCE, FACTS, NAV, PROFILE, PROJECTS, SKILLS, STATS, STORY } from "./data";
import { Icon } from "./icons";
import { Cursor } from "./cursor";
import { Space } from "./space";

export default function App() {
  useReveal();
  useDepthParallax();
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

// Eases things into place the first time they scroll into view: up by default, or from
// the side with .from-left / .from-right, or a small pop with .pop. Siblings are staggered
// (a parent's data-step sets the gap), and children wait for the card around them.
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const delays = new Map<Element, number>();
    els.forEach((el) => {
      const parent = el.parentElement;
      const siblings = parent ? [...parent.children].filter((c) => c.classList.contains("reveal")) : [];
      const step = Number(parent?.dataset.step ?? 90);
      const outer = parent?.closest(".reveal");
      const delay = (outer ? (delays.get(outer) ?? 0) + 250 : 0) + Math.min(siblings.indexOf(el), 14) * step;
      delays.set(el, delay);
      el.style.transitionDelay = `${delay}ms`;
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

// How far the page has scrolled through an element, 0 when its top reaches `from` (a
// fraction of the viewport) and 1 when its bottom does. Stored as --p on the element.
function useScrollProgress<T extends HTMLElement>(from = 0.6) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight * from - r.top) / Math.max(1, r.height)));
      el.style.setProperty("--p", p.toFixed(4));
    };
    const onScroll = () => (frame ||= requestAnimationFrame(update));
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [from]);
  return ref;
}

// Depth parallax: elements marked data-depth sit further back while they are low on the
// screen (smaller, softer, dimmer, lower) and come forward to full size at the centre,
// easing back a little as they leave. A higher data-depth sits deeper and travels more.
// Elements marked data-layer drift at that fraction of the scroll, like a far backdrop.
// Elements marked data-fade come out of the dark as they enter from below and sink back into
// it as they leave at the top, both ways as you scroll.
// Uses the separate scale/translate properties so it stacks with reveal and hover transforms.
function useDepthParallax() {
  useEffect(() => {
    const cards = [...document.querySelectorAll<HTMLElement>("[data-depth]")];
    const layers = [...document.querySelectorAll<HTMLElement>("[data-layer]")];
    const fades = [...document.querySelectorAll<HTMLElement>("[data-fade]")];
    const docTop = (el: HTMLElement) => {
      let y = 0;
      for (let n: HTMLElement | null = el; n; n = n.offsetParent as HTMLElement | null) y += n.offsetTop;
      return y;
    };
    let frame = 0;
    const update = () => {
      frame = 0;
      const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
      const vh = innerHeight;
      for (const el of cards) {
        const mid = docTop(el) - scrollY + el.offsetHeight / 2;
        if (still || mid < -vh || mid > vh * 2) {
          if (still) el.style.scale = el.style.translate = el.style.filter = "";
          continue;
        }
        const t = Math.max(-1, Math.min(1, (mid - vh / 2) / (vh / 2 + el.offsetHeight / 2)));
        const d = (t > 0 ? t : -t * 0.5) * Number(el.dataset.depth);
        el.style.scale = String(1 - 0.16 * d);
        el.style.translate = `0 ${(t * 70 * Number(el.dataset.depth)).toFixed(1)}px`;
        el.style.filter = `blur(${(d * 3).toFixed(2)}px) brightness(${(1 - d * 0.4).toFixed(3)})`;
      }
      for (const el of fades) {
        if (still) {
          el.style.filter = "";
          continue;
        }
        const top = docTop(el) - scrollY;
        const bottom = top + el.offsetHeight;
        const fadeIn = Math.max(0, Math.min(1, (vh - top) / (vh * 0.35)));
        const fadeOut = Math.max(0, Math.min(1, (bottom - 90) / (vh * 0.35)));
        el.style.filter = `brightness(${(0.2 + 0.8 * Math.min(fadeIn, fadeOut)).toFixed(3)})`;
      }
      for (const el of layers) {
        const sec = el.parentElement!;
        const r = sec.getBoundingClientRect();
        el.style.translate = still ? "" : `-50% ${((r.top + r.height / 2 - vh / 2) * -Number(el.dataset.layer)).toFixed(1)}px`;
      }
    };
    const onScroll = () => (frame ||= requestAnimationFrame(update));
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
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

function Section({ id, eyebrow, title, sub, backdrop, children }: { id: string; eyebrow: string; title: string; sub: string; backdrop?: string; children: ReactNode }) {
  return (
    <section id={id} className={`section ${backdrop ? "has-backdrop" : ""}`}>
      {backdrop && (
        <span className="backdrop-word" data-layer="0.25" aria-hidden>
          {backdrop}
        </span>
      )}
      <header className="section-head reveal">
        <span className="pill-label">{eyebrow}</span>
        <h2>{title}</h2>
        <p>{sub}</p>
      </header>
      {children}
    </section>
  );
}

// A section that pins in place while vertical scrolling slides its cards sideways, on phones
// too. On screens too short to fit it, or with reduced motion, it becomes a swipeable row instead.
function Reel({ id, eyebrow, title, sub, children }: { id: string; eyebrow: string; title: string; sub: string; children: ReactNode }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const s = section.current, t = track.current;
    if (!s || !t) return;
    let distance = 0, frame = 0;
    let on = false;
    // The card in focus is full size; the others shrink and dim the further they are from it.
    // The focus point travels from the first card (start) to the last card (end), unless
    // given (the screen's centre on phones).
    const focus = (p: number, shift: number, centre?: number) => {
      const cards = [...t.children] as HTMLElement[];
      if (!cards.length || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const first = cards[0], last = cards[cards.length - 1];
      const pad = parseFloat(getComputedStyle(t).paddingLeft);
      const start = pad + first.offsetWidth / 2;
      const end = t.clientWidth - pad - last.offsetWidth / 2;
      const at = centre ?? start + (end - start) * p;
      for (const c of cards) {
        const x = c.offsetLeft - t.offsetLeft + c.offsetWidth / 2 - shift;
        const d = Math.min(1, Math.abs(x - at) / (c.offsetWidth + 24));
        c.style.scale = String(1 - 0.14 * d);
        c.style.filter = d > 0.01 ? `brightness(${(1 - 0.35 * d).toFixed(3)})` : "";
      }
    };
    const update = () => {
      frame = 0;
      if (!on) {
        // Swipe row: the bar follows the row's own sideways scroll.
        const room = t.scrollWidth - t.clientWidth;
        const p = room > 0 ? t.scrollLeft / room : 0;
        s.style.setProperty("--p", p.toFixed(4));
        focus(p, t.scrollLeft);
        return;
      }
      const p = Math.min(1, Math.max(0, -s.getBoundingClientRect().top / Math.max(1, distance)));
      s.style.setProperty("--p", p.toFixed(4));
      const cards = [...t.children] as HTMLElement[];
      if (cards.length > 1 && cards[0].offsetWidth > t.clientWidth * 0.6) {
        // One card fills a phone screen, so step from card to card: each one rests in the
        // centre for a while before the next slides in.
        const centred = (c: HTMLElement) => Math.min(distance, Math.max(0, c.offsetLeft - t.offsetLeft + c.offsetWidth / 2 - t.clientWidth / 2));
        const x = p * (cards.length - 1);
        const i = Math.min(cards.length - 2, Math.floor(x));
        const f = Math.min(1, Math.max(0, (x - i - 0.2) / 0.6));
        const shift = centred(cards[i]) + (centred(cards[i + 1]) - centred(cards[i])) * f * f * (3 - 2 * f);
        t.style.transform = `translate3d(${-shift}px, 0, 0)`;
        focus(p, shift, t.clientWidth / 2);
        return;
      }
      t.style.transform = `translate3d(${-p * distance}px, 0, 0)`;
      focus(p, p * distance);
    };
    const measure = () => {
      // Pin only when the section fits the screen height once pinned. On phones, cards that
      // are a little too tall are shrunk to fit rather than giving up on pinning.
      on = !matchMedia("(prefers-reduced-motion: reduce)").matches;
      s.classList.toggle("pinned", on);
      t.style.scale = t.style.marginBottom = "";
      const pin = s.firstElementChild as HTMLElement;
      // Measure top-aligned: centred content that overflows upwards isn't counted.
      pin.style.justifyContent = "flex-start";
      const over = pin.scrollHeight - pin.clientHeight;
      pin.style.justifyContent = "";
      if (on && over > 1) {
        const fit = (t.offsetHeight - over - 16) / t.offsetHeight;
        if (innerWidth < 900 && fit >= 0.6) {
          t.style.scale = fit.toFixed(4);
          t.style.marginBottom = `${-(1 - fit) * t.offsetHeight}px`;
        } else {
          on = false;
          s.classList.remove("pinned");
        }
      }
      if (!on) {
        s.style.height = "";
        t.style.transform = "";
        update();
        return;
      }
      // Measure to the last card plus the track's end padding; scrollWidth can drop that padding.
      const last = t.lastElementChild as HTMLElement | null;
      const end = last ? last.offsetLeft + last.offsetWidth + parseFloat(getComputedStyle(t).paddingRight) : 0;
      distance = Math.max(0, end - t.clientWidth);
      s.style.height = `${innerHeight + distance}px`;
      update();
    };
    const onScroll = () => (frame ||= requestAnimationFrame(update));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(t);
    addEventListener("scroll", onScroll, { passive: true });
    t.addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      t.removeEventListener("scroll", onScroll);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", measure);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section id={id} ref={section} className="reel">
      <div className="reel-pin">
        <header className="section-head reveal">
          <span className="pill-label">{eyebrow}</span>
          <h2>{title}</h2>
          <p>{sub}</p>
        </header>
        <div ref={track} className="reel-track">
          {children}
        </div>
        <i className="reel-progress" aria-hidden>
          <b />
        </i>
      </div>
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
      <Space />
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
        <article className="card tone-0 story" data-fade data-step="140">
          <h3 className="reveal from-left">My Story</h3>
          {STORY.map((p, i) => (
            <p key={i} className="reveal from-left">
              {p}
            </p>
          ))}
        </article>
        <aside className="card tone-2 facts" data-fade>
          <h4>Quick Facts</h4>
          <ul data-step="80">
            {FACTS.map((f) => (
              <li key={f.label} className="reveal from-right">
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
    <Reel id="skills" eyebrow="Expertise" title="Skills & Tools" sub="The technologies I use to ship reliable web and mobile products.">
        {SKILLS.map((s, i) => (
          <article key={s.title} className={`card ${tone(i)} skill reveal`}>
            <div className="card-title">
              <span className="ic">
                <Icon name={s.icon} />
              </span>
              <h3>{s.title}</h3>
            </div>
            <p>{s.blurb}</p>
            <div className="chips" data-step="45">
              {s.items.map((t) => (
                <span key={t} className="chip reveal pop">
                  {t}
                </span>
              ))}
            </div>
          </article>
        ))}
    </Reel>
  );
}

function Experience() {
  const line = useScrollProgress<HTMLOListElement>(0.55);
  return (
    <Section id="experience" eyebrow="Career" title="Experience" sub="Leading frontend work on production web and mobile apps.">
      <ol ref={line} className="timeline">
        <i className="timeline-fill" aria-hidden />
        {EXPERIENCE.map((e, i) => (
          <li key={e.company} className={i % 2 ? "right" : "left"}>
            <span className="node" aria-hidden />
            <article className={`card ${tone(i)} job reveal ${i % 2 ? "from-right" : "from-left"}`}>
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
              <ul data-step="110">
                {e.points.map((p) => (
                  <li key={p} className={`reveal ${i % 2 ? "from-right" : "from-left"}`}>
                    {p}
                  </li>
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
    <Reel id="projects" eyebrow="Portfolio" title="Featured Projects" sub="Things I've built, on my own and at work.">
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
    </Reel>
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
    <Section id="education" eyebrow="Learning" title="Education" sub="Degree and certification." backdrop="Learning">
      <div className="grid-2 narrow">
        {EDUCATION.map((e, i) => (
          <article key={e.title} className={`card ${tone(i * 2)} edu reveal`} data-depth={i % 2 ? 1.5 : 1}>
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
    <Section id="achievements" eyebrow="Highlights" title="Achievements" sub="Recognition and experience beyond the day job." backdrop="Highlights">
      <div className="grid-2 narrow">
        {ACHIEVEMENTS.map((a, i) => (
          <article key={a.title} className={`card ${tone(i)} achievement reveal`} data-depth={i % 2 ? 1.5 : 1}>
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
