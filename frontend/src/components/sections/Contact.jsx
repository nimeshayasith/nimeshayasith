import { motion } from 'framer-motion';
import SectionHeading from '../ui/SectionHeading';
import { useInView } from 'react-intersection-observer';
import { useForm } from 'react-hook-form';
import { Mail, Send, Github, Linkedin, MapPin, Phone, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { PERSONAL, SOCIAL_LINKS } from '../../data/profile';

export default function Contact() {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  /* Static site → no server to POST to. Compose the message in the visitor's
     own mail client, addressed to me, so nothing is lost or silently dropped. */
  const onSubmit = async (data) => {
    const body = `${data.message}

— ${data.name} (${data.email})`;
    const href = `mailto:${PERSONAL.email}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
    toast.success('Opening your email app. Hit send and I will get back to you soon.');
    reset();
  };

  const inputStyle = {
    width: '100%',
    background: 'var(--bg-card)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 12,
    padding: '14px 16px',
    color: 'var(--text-primary)',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    fontFamily: 'Inter, sans-serif',
  };

  return (
    <section id="contact" ref={ref} className="section-padding">
      <div className="section-divider mb-24 -mt-12" />

      {/* Header */}
      <SectionHeading index="08" label="Get In Touch" title={<>Let's <span className="gradient-text">Connect</span></>}
        lead={<>Have a project in mind or want to collaborate? I'd love to hear from you.</>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto">

        {/* ── Contact Info ── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="space-y-5"
        >
          <div className="glass p-7">
            <h3 className="t-h3 mb-1">
              Open to Opportunities
            </h3>
            <p className="t-body mb-7" style={{ fontFamily: 'Inter, sans-serif' }}>
              Looking for DevOps, Cloud and Platform / SRE roles. Say hello, I reply quickly.
            </p>

            {/* Contact items */}
            {[
              {
                icon: Mail,
                label: 'Email',
                value: PERSONAL.email,
                href: `mailto:${PERSONAL.email}`,
                color: '#a8cc00',
              },
              {
                icon: MapPin,
                label: 'Location',
                value: PERSONAL.location,
                color: '#818cf8',
              },
            ].map(({ icon: Icon, label, value, href, color }) => (
              <div key={label} className="flex items-center gap-4 mb-5 last:mb-0">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${color}12`, border: `1px solid ${color}25` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div>
                  <p className="t-small mb-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>{label}</p>
                  {href ? (
                    <a
                      href={href}
                      className="text-white text-sm hover:text-accent-500 transition-colors"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="text-white text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>{value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Social */}
            <div className="flex gap-3 mt-7">
              {[
                { href: SOCIAL_LINKS.github,   icon: Github,   label: 'GitHub' },
                { href: SOCIAL_LINKS.linkedin, icon: Linkedin, label: 'LinkedIn' },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-sm transition-all duration-200"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    fontFamily: 'Inter, sans-serif',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--accent-glow)';
                    e.currentTarget.style.background = 'var(--accent-glow)';
                    e.currentTarget.style.color = 'var(--accent-ink)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.background = 'var(--bg-card)';
                    e.currentTarget.style.color = '';
                  }}
                >
                  <Icon className="w-4 h-4" /> {label}
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Contact Form ── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="glass p-7"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  {...register('name', { required: 'Required' })}
                  placeholder="Your Name"
                  style={inputStyle}
                  onFocus={e => {
                    e.target.style.borderColor = 'var(--accent-ink)';
                    e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'var(--border-subtle)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>{errors.name.message}</p>
                )}
              </div>
              <div>
                <input
                  {...register('email', { required: 'Required' })}
                  type="email"
                  placeholder="Your Email"
                  style={inputStyle}
                  onFocus={e => {
                    e.target.style.borderColor = 'var(--accent-ink)';
                    e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'var(--border-subtle)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <input
                {...register('subject', { required: 'Required' })}
                placeholder="Subject"
                style={inputStyle}
                onFocus={e => {
                  e.target.style.borderColor = 'rgba(206,254,8,0.5)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(206,254,8,0.08)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {errors.subject && (
                <p className="text-red-400 text-xs mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>{errors.subject.message}</p>
              )}
            </div>

            <div>
              <textarea
                {...register('message', { required: 'Required', minLength: { value: 10, message: 'Min 10 characters' } })}
                placeholder="Your message..."
                rows={5}
                style={{ ...inputStyle, resize: 'none' }}
                onFocus={e => {
                  e.target.style.borderColor = 'rgba(206,254,8,0.5)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(206,254,8,0.08)';
                }}
                onBlur={e => {
                  e.target.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {errors.message && (
                <p className="text-red-400 text-xs mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>{errors.message.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full justify-center"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-dark/40 border-t-dark rounded-full animate-spin" />
              ) : (
                <>
                  <span className="btn-icon">
                    <Send className="w-4 h-4" />
                  </span>
                  Send via Email
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
