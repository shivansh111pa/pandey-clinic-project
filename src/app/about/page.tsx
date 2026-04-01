import { Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <>
      <div className="page-hero">
        <h1 className="scroll-animate">About Pandey Care</h1>
        <p className="scroll-animate stagger-1">
          Dedicated to providing compassionate, comprehensive, and patient-centered
          healthcare for you and your family.
        </p>
      </div>

      <div className="about-content">
        <section className="about-section scroll-animate">
          <h2>Our Philosophy</h2>
          <p style={{ fontSize: '1.125rem', color: 'var(--color-neutral-600)', lineHeight: 1.8 }}>
            At Pandey Care, we believe that healthcare is a fundamental right and should be delivered
            with the highest level of empathy, professionalism, and integrity. We strive to create
            a healing environment where patients feel listened to, respected, and empowered to
            take charge of their health.
          </p>
        </section>

        <section className="about-section scroll-animate">
          <h2>Meet Dr. Shivansh A. Pandey</h2>
          <div className="glass-card" style={{ display: 'flex', gap: '2rem', padding: '2rem', marginTop: '1.5rem', alignItems: 'center' }}>
            <div style={{ flex: '0 0 200px', height: '200px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', background: 'var(--color-primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={64} style={{ color: 'var(--color-primary-500)' }} />
            </div>
            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>Dr. Shivansh A. Pandey</h3>
              <p style={{ color: 'var(--color-primary-600)', fontWeight: 600, marginBottom: '1rem' }}>MBBS</p>
              <p style={{ color: 'var(--color-neutral-600)', lineHeight: 1.7 }}>
                Dr. Pandey completed his medical education with distinction and has over a decade of
                experience in the medical field. He is known for his accurate diagnoses, patient
                listening skills, and commitment to delivering the best possible outcomes. His aim
                is to bridge the gap between complex medical science and accessible patient care.
              </p>
            </div>
          </div>
        </section>

        <section className="about-section scroll-animate">
          <h2>Our Clinic at AIIMS Gorakhpur</h2>
          <p style={{ color: 'var(--color-neutral-600)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
            Located conveniently at AIIMS Gorakhpur, our clinic spans state-of-the-art facilities designed
            to provide a comfortable and hygienic environment. We continuously upgrade our medical knowledge
            and infrastructure to ensure you receive care that meets modern global standards.
          </p>
        </section>
      </div>
    </>
  );
}
