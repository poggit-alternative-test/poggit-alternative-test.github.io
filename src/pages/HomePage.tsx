import { Link } from 'react-router-dom';
import { ArrowRight, Package, Shield, Zap } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Card, CardContent, Button } from '@/components/ui';

export function HomePage() {
  const { colors } = useTheme();

  return (
    <div className="page-container" style={{ paddingTop: '48px', paddingBottom: '48px' }}>
      {/* Hero */}
      <section style={{ textAlign: 'center', marginBottom: '64px' }}>
        {/* Logo */}
        <div style={{ marginBottom: '24px' }}>
          <img
            src="/axolotl-logo.svg"
            alt="Axolotl"
            className="hero-logo"
          />
        </div>
        <h1 className="hero-headline" style={{ color: colors.textPrimary, marginBottom: '16px' }}>
          PocketMine-MP Plugins
          <br />
          <span style={{ color: colors.brand }}>Trusted & Verified</span>
        </h1>
        <p
          style={{
            fontSize: 'clamp(14px, 2vw, 17px)',
            color: colors.textSecondary,
            maxWidth: '560px',
            margin: '0 auto 32px',
            lineHeight: 1.65,
          }}
        >
          Discover, browse and download community-built PocketMine-MP plugins.
          Every plugin is validated for safety before being listed.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/search">
            <Button size="lg" rightIcon={<ArrowRight size={16} />}>
              Browse Plugins
            </Button>
          </Link>
          <Link to="/about">
            <Button variant="secondary" size="lg">
              How it works
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          marginBottom: '64px',
        }}
      >
        <Card style={{ backgroundColor: colors.card }}>
          <CardContent>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: colors.brandBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
                color: colors.brand,
              }}
            >
              <Shield size={20} />
            </div>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: colors.textPrimary, marginBottom: '6px' }}>
              Verified Plugins
            </h3>
            <p style={{ fontSize: '13px', color: colors.textSecondary, lineHeight: 1.6 }}>
              Every plugin is verified using cryptographic attestations to ensure it was built from the published source code.
            </p>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: colors.card }}>
          <CardContent>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: colors.brandBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
                color: colors.brand,
              }}
            >
              <Zap size={20} />
            </div>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: colors.textPrimary, marginBottom: '6px' }}>
              CI-Built Binaries
            </h3>
            <p style={{ fontSize: '13px', color: colors.textSecondary, lineHeight: 1.6 }}>
              Plugins are built in isolated GitHub Actions runners, so you can trust the .phar files you download.
            </p>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: colors.card }}>
          <CardContent>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: colors.brandBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
                color: colors.brand,
              }}
            >
              <Package size={20} />
            </div>
            <h3 style={{ fontSize: '15px', fontWeight: 600, color: colors.textPrimary, marginBottom: '6px' }}>
              Open Registry
            </h3>
            <p style={{ fontSize: '13px', color: colors.textSecondary, lineHeight: 1.6 }}>
              The plugin index is stored in a public GitHub repository. Submit your plugin through a GitHub Issue.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section className="cta-section" style={{ backgroundColor: colors.brandBg, textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(18px, 3vw, 22px)', fontWeight: 700, color: colors.textPrimary, marginBottom: '12px' }}>
          Submit your plugin
        </h2>
        <p style={{ fontSize: '14px', color: colors.textSecondary, marginBottom: '24px', maxWidth: '440px', margin: '0 auto 24px' }}>
          Have a PocketMine-MP plugin? Get it listed by opening a validation issue on GitHub.
        </p>
        <a
          href="https://github.com/axolotl-pm/plugin-registry/issues/new?template=plugin-submission.yml"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button rightIcon={<ArrowRight size={14} />}>Open Submission Issue</Button>
        </a>
      </section>
    </div>
  );
}
