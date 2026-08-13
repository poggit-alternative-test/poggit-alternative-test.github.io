import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, Button } from '@/components/ui';
import { Github, FileText, Shield, Zap, Heart } from 'lucide-react';

export function AboutPage() {
  const { colors } = useTheme();

  return (
    <div className="page-container" style={{ paddingTop: '32px' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <h1
          style={{
            fontSize: '32px',
            fontWeight: 800,
            color: colors.textPrimary,
            letterSpacing: '-0.5px',
            marginBottom: '8px',
          }}
        >
          About Axolotl
        </h1>
        <p style={{ fontSize: '15px', color: colors.textSecondary, marginBottom: '40px', lineHeight: 1.7 }}>
          The Axolotl Plugin Registry is a community-driven directory for PocketMine-MP plugins,
          built entirely on free GitHub features — no paid services, no backend servers.
        </p>

        {/* How it works */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: colors.textPrimary, marginBottom: '20px' }}>
            How it works
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              {
                icon: <FileText size={18} />,
                title: 'Submit via GitHub Issue',
                desc: 'Open a submission issue on our registry repository with your plugin details and GitHub release URL.',
              },
              {
                icon: <Shield size={18} />,
                title: 'Automated Validation',
                desc: 'Our CI workflow verifies your plugin.yml, checks for a valid release, and validates the phar attestation.',
              },
              {
                icon: <Zap size={18} />,
                title: 'Listed in the Index',
                desc: 'Once approved, your plugin appears in the registry index and on this website automatically.',
              },
            ].map((step, i) => (
              <Card key={i} style={{ backgroundColor: colors.card }}>
                <CardContent>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: colors.brandBg,
                        color: colors.brand,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {step.icon}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '14px', fontWeight: 600, color: colors.textPrimary, marginBottom: '4px' }}>
                        {step.title}
                      </h3>
                      <p style={{ fontSize: '13px', color: colors.textSecondary, lineHeight: 1.6 }}>
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Verification tiers */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: colors.textPrimary, marginBottom: '20px' }}>
            Build tiers
          </h2>
          <div style={{ display: 'grid', gap: '12px' }}>
            {[
              { tier: 'Verified build', badge: 'verified', desc: 'Built with pmmp-plugin-actions. Source + binary verified via cryptographic attestation.' },
              { tier: 'Built via CI', badge: 'built', desc: 'Has a release .phar with attestation from CI workflow, but not pmmp-plugin-actions.' },
              { tier: 'Unverified', badge: 'unverified', desc: 'Release exists but could not be verified. Download at your own risk.' },
            ].map(item => (
              <Card key={item.tier} style={{ backgroundColor: colors.card }}>
                <CardContent>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: colors.textPrimary }}>
                      {item.tier}
                    </span>
                    <span style={{ fontSize: '11px', color: colors.textMuted }}>— {item.badge}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: colors.textSecondary }}>{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Open source */}
        <section
          style={{
            backgroundColor: colors.card,
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
            border: `1px solid ${colors.border}`,
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: colors.brandBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              color: colors.brand,
            }}
          >
            <Heart size={24} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: colors.textPrimary, marginBottom: '12px' }}>
            Open Source
          </h2>
          <p style={{ fontSize: '14px', color: colors.textSecondary, marginBottom: '24px', lineHeight: 1.65 }}>
            Both this website and the registry infrastructure are open source.
            Contributions are welcome!
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://github.com/axolotl-pm/poggit-alternative-test.github.io" target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" leftIcon={<Github size={14} />}>Website Source</Button>
            </a>
            <a href="https://github.com/axolotl-pm/plugin-registry" target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" leftIcon={<Github size={14} />}>Registry Source</Button>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
