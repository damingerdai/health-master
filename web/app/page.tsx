import Link from 'next/link';
import { getServerSession } from 'next-auth';
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  HeartPulse,
  LayoutDashboard,
  LineChart,
  Lock,
  Ruler,
  Scale,
  ShieldCheck,
  Sparkles,
  Thermometer,
  Zap
} from 'lucide-react';
import { IconInnerShadowTop } from '@tabler/icons-react';

import { authOptions } from '@/lib/auth-options';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

const previewVitals = [
  {
    title: 'Blood Pressure',
    value: '118/76',
    unit: 'mmHg',
    subtext: 'Pulse: 68 bpm · Optimal',
    badge: 'Normal',
    icon: Activity,
    iconColor: 'text-rose-500',
    badgeClass:
      'border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400'
  },
  {
    title: 'Weight',
    value: '68.4',
    unit: 'kg',
    subtext: '-0.8 kg vs last 30 days',
    badge: 'On Track',
    icon: Scale,
    iconColor: 'text-blue-500',
    badgeClass:
      'border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400'
  },
  {
    title: 'Temperature',
    value: '36.6',
    unit: '°C',
    subtext: 'Stable baseline reading',
    badge: 'Healthy',
    icon: Thermometer,
    iconColor: 'text-orange-500',
    badgeClass:
      'border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-400'
  },
  {
    title: 'Height',
    value: '176',
    unit: 'cm',
    subtext: 'BMI 22.1 · Normal range',
    badge: 'Recorded',
    icon: Ruler,
    iconColor: 'text-emerald-500',
    badgeClass:
      'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
  }
];

const metricFeatures = [
  {
    title: 'Blood Pressure & Pulse',
    description:
      'Log systolic, diastolic, and heart rate readings with timestamps to spot cardiovascular patterns early.',
    icon: HeartPulse,
    accent: 'from-rose-500/15 to-transparent text-rose-500',
    highlights: [
      'Systolic & diastolic tracking (mmHg)',
      'Resting heart rate & pulse logs (bpm)',
      'Historical trend comparison'
    ]
  },
  {
    title: 'Weight Management',
    description:
      'Follow your body weight trajectory over weeks and months without noisy daily fluctuations getting in the way.',
    icon: Scale,
    accent: 'from-blue-500/15 to-transparent text-blue-500',
    highlights: [
      'Precision daily weight records (kg)',
      'Interactive area trend visualization',
      'Fast single-click entry workflow'
    ]
  },
  {
    title: 'Body Temperature',
    description:
      'Keep a reliable log of your baseline body temperature and monitor recovery during illness or fever.',
    icon: Thermometer,
    accent: 'from-orange-500/15 to-transparent text-orange-500',
    highlights: [
      'Accurate Celsius (°C) tracking',
      'Time-series fever & baseline logs',
      'Clear tabular & chart history'
    ]
  },
  {
    title: 'Height & Stature',
    description:
      'Maintain continuous height records over time to support accurate health profiling and growth tracking.',
    icon: Ruler,
    accent: 'from-emerald-500/15 to-transparent text-emerald-500',
    highlights: [
      'Long-term stature records (cm)',
      'Clean chronological history table',
      'Unified profile health summary'
    ]
  }
];

const platformCapabilities = [
  {
    title: 'Interactive Visual Analytics',
    description:
      'Turn raw numbers into clarity. Inspect multi-metric charts and latest vital snapshots from a unified dashboard.',
    icon: LineChart
  },
  {
    title: 'Two-Factor Authentication (2FA)',
    description:
      'Your health data is deeply personal. Protect your account with TOTP authenticator apps and encrypted JWT sessions.',
    icon: ShieldCheck
  },
  {
    title: 'Frictionless Daily Logging',
    description:
      'Designed for speed and consistency so recording your morning or evening vitals takes less than ten seconds.',
    icon: Zap
  }
];

const workflowSteps = [
  {
    step: '01',
    title: 'Create Your Secure Space',
    description:
      'Sign up in seconds and optionally enable TOTP two-factor authentication for extra account protection.'
  },
  {
    step: '02',
    title: 'Log Your Daily Vitals',
    description:
      'Record blood pressure, weight, body temperature, and height from any device with clean, validated forms.'
  },
  {
    step: '03',
    title: 'Understand Long-Term Trends',
    description:
      'Review interactive charts and summary cards on your dashboard to stay proactive about your wellbeing.'
  }
];

export default async function HomePage() {
  const session = await getServerSession(authOptions).catch(() => null);
  const isAuthenticated =
    Boolean(session?.accessToken) && !session?.needTwoFactor;

  return (
    <div className="bg-background text-foreground flex min-h-svh flex-col selection:bg-primary selection:text-primary-foreground">
      {/* Top Navbar */}
      <header className="border-border/60 bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-semibold tracking-tight transition-opacity hover:opacity-90"
          >
            <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg shadow-xs">
              <IconInnerShadowTop className="size-5" />
            </div>
            <span className="text-base sm:text-lg">Health Master</span>
          </Link>

          <nav className="text-muted-foreground hidden items-center gap-6 text-sm font-medium md:flex">
            <a
              href="#metrics"
              className="hover:text-foreground transition-colors"
            >
              Vitals
            </a>
            <a
              href="#features"
              className="hover:text-foreground transition-colors"
            >
              Capabilities
            </a>
            <a
              href="#workflow"
              className="hover:text-foreground transition-colors"
            >
              How It Works
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className={cn(buttonVariants({ size: 'default' }), 'gap-1.5')}
              >
                <LayoutDashboard className="size-4" />
                <span>Go to Dashboard</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className={cn(
                    buttonVariants({ variant: 'ghost', size: 'default' })
                  )}
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className={cn(buttonVariants({ size: 'default' }), 'gap-1.5')}
                >
                  <span>Get Started</span>
                  <ArrowRight className="size-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-14 pb-20 md:pt-22 md:pb-28">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl"
          >
            <div className="from-rose-500/15 via-blue-500/15 to-emerald-500/15 mx-auto aspect-[1155/678] w-[72rem] bg-gradient-to-tr opacity-70" />
          </div>

          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
              <Badge
                variant="outline"
                className="bg-muted/60 mb-6 gap-1.5 rounded-full px-3.5 py-1 text-xs font-medium backdrop-blur-xs"
              >
                <Sparkles className="size-3.5 text-rose-500" />
                <span>Personal Health Intelligence Platform</span>
              </Badge>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Master Your Vitals.{' '}
                <span className="from-foreground via-foreground/85 to-muted-foreground bg-gradient-to-r bg-clip-text text-transparent">
                  Understand Your Health.
                </span>
              </h1>

              <p className="text-muted-foreground mt-6 max-w-2xl text-base leading-relaxed sm:text-lg">
                Track blood pressure, weight, body temperature, and height in
                one private, streamlined workspace. Visualize long-term trends
                and keep your personal health records protected with 2FA.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                {isAuthenticated ? (
                  <Link
                    href="/dashboard"
                    className={cn(
                      buttonVariants({ size: 'lg' }),
                      'h-11 px-6 text-sm font-semibold shadow-sm'
                    )}
                  >
                    <LayoutDashboard className="mr-1.5 size-4" />
                    Open Your Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/sign-up"
                      className={cn(
                        buttonVariants({ size: 'lg' }),
                        'h-11 px-6 text-sm font-semibold shadow-sm'
                      )}
                    >
                      Start Tracking Free
                      <ArrowRight className="ml-1.5 size-4" />
                    </Link>
                    <Link
                      href="/sign-in"
                      className={cn(
                        buttonVariants({ variant: 'outline', size: 'lg' }),
                        'h-11 px-6 text-sm font-medium'
                      )}
                    >
                      Sign In to Account
                    </Link>
                  </>
                )}
              </div>

              <div className="text-muted-foreground mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-emerald-500" />4 Core
                  Vital Trackers
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                  Interactive Trend Charts
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Lock className="size-3.5 text-emerald-500" />
                  TOTP 2FA Security
                </span>
              </div>
            </div>

            {/* Interactive-Style Dashboard Preview */}
            <div className="mt-14 md:mt-16">
              <div className="border-border/80 bg-card/60 relative mx-auto rounded-2xl border p-3 shadow-xl backdrop-blur-sm sm:p-5">
                <div className="border-border/60 mb-4 flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-2">
                    <span className="size-2.5 rounded-full bg-rose-500/80" />
                    <span className="size-2.5 rounded-full bg-amber-500/80" />
                    <span className="size-2.5 rounded-full bg-emerald-500/80" />
                    <span className="text-muted-foreground ml-2 font-mono text-xs">
                      health-master / dashboard
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-[11px]">
                    Live Overview Preview
                  </Badge>
                </div>

                {/* 4 Vital Summary Cards */}
                <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
                  {previewVitals.map(vital => (
                    <Card
                      key={vital.title}
                      className="from-primary/5 to-card bg-gradient-to-t py-4 shadow-xs"
                    >
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 pb-2">
                        <CardTitle className="text-xs font-medium">
                          {vital.title}
                        </CardTitle>
                        <div className="border-border/80 bg-background/80 flex size-7 items-center justify-center rounded-md border">
                          <vital.icon
                            className={cn('size-4', vital.iconColor)}
                          />
                        </div>
                      </CardHeader>
                      <CardContent className="px-4">
                        <div className="flex items-baseline justify-between gap-2">
                          <div className="text-2xl font-bold tracking-tight">
                            {vital.value}
                            <span className="text-muted-foreground ml-1 text-xs font-normal">
                              {vital.unit}
                            </span>
                          </div>
                          <span
                            className={cn(
                              'inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-medium',
                              vital.badgeClass
                            )}
                          >
                            {vital.badge}
                          </span>
                        </div>
                        <p className="text-muted-foreground mt-1.5 text-xs">
                          {vital.subtext}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Visual Trend Mockup */}
                <div className="border-border/70 bg-background/60 mt-4 rounded-xl border p-4 sm:p-5">
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                    <div>
                      <h2 className="text-sm font-semibold">
                        Blood Pressure & Weight Trend Analysis
                      </h2>
                      <p className="text-muted-foreground text-xs">
                        30-day continuous vital sign progression
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-rose-500" />
                        Systolic (mmHg)
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-blue-500" />
                        Diastolic (mmHg)
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 h-36 w-full overflow-hidden">
                    <svg
                      viewBox="0 0 800 140"
                      className="h-full w-full overflow-visible"
                      preserveAspectRatio="none"
                      aria-hidden="true"
                    >
                      <defs>
                        <linearGradient
                          id="systolicFill"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="rgb(244 63 94)"
                            stopOpacity="0.28"
                          />
                          <stop
                            offset="100%"
                            stopColor="rgb(244 63 94)"
                            stopOpacity="0.0"
                          />
                        </linearGradient>
                        <linearGradient
                          id="diastolicFill"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="rgb(59 130 246)"
                            stopOpacity="0.24"
                          />
                          <stop
                            offset="100%"
                            stopColor="rgb(59 130 246)"
                            stopOpacity="0.0"
                          />
                        </linearGradient>
                      </defs>

                      {/* Grid lines */}
                      <line
                        x1="0"
                        y1="25"
                        x2="800"
                        y2="25"
                        stroke="currentColor"
                        strokeOpacity="0.07"
                        strokeDasharray="4 4"
                      />
                      <line
                        x1="0"
                        y1="70"
                        x2="800"
                        y2="70"
                        stroke="currentColor"
                        strokeOpacity="0.07"
                        strokeDasharray="4 4"
                      />
                      <line
                        x1="0"
                        y1="115"
                        x2="800"
                        y2="115"
                        stroke="currentColor"
                        strokeOpacity="0.07"
                        strokeDasharray="4 4"
                      />

                      {/* Systolic curve */}
                      <path
                        d="M0,48 C80,42 140,55 220,44 C300,33 360,50 440,38 C520,28 600,42 680,35 C740,30 775,34 800,32 L800,140 L0,140 Z"
                        fill="url(#systolicFill)"
                      />
                      <path
                        d="M0,48 C80,42 140,55 220,44 C300,33 360,50 440,38 C520,28 600,42 680,35 C740,30 775,34 800,32"
                        fill="none"
                        stroke="rgb(244 63 94)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />

                      {/* Diastolic curve */}
                      <path
                        d="M0,92 C80,88 140,96 220,90 C300,84 360,94 440,86 C520,80 600,88 680,83 C740,80 775,82 800,80 L800,140 L0,140 Z"
                        fill="url(#diastolicFill)"
                      />
                      <path
                        d="M0,92 C80,88 140,96 220,90 C300,84 360,94 440,86 C520,80 600,88 680,83 C740,80 775,82 800,80"
                        fill="none"
                        stroke="rgb(59 130 246)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Health Metrics Section */}
        <section
          id="metrics"
          className="border-border/60 bg-muted/30 scroll-mt-16 border-y py-20 md:py-24"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="outline" className="mb-3">
                Core Health Modules
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Every Essential Vital Sign in One Place
              </h2>
              <p className="text-muted-foreground mt-3 text-base">
                Purpose-built trackers for the metrics that matter most to your
                daily wellness and clinical checkups.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {metricFeatures.map(feature => (
                <Card
                  key={feature.title}
                  className="border-border/80 relative overflow-hidden transition-shadow hover:shadow-md"
                >
                  <div
                    className={cn(
                      'pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b',
                      feature.accent
                    )}
                  />
                  <CardHeader className="relative">
                    <div className="mb-2 flex items-center gap-3">
                      <div className="border-border bg-background flex size-10 items-center justify-center rounded-xl border shadow-2xs">
                        <feature.icon
                          className={cn(
                            'size-5',
                            feature.accent.split(' ').pop()
                          )}
                        />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                    <CardDescription className="text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    <ul className="space-y-2 text-sm">
                      {feature.highlights.map(item => (
                        <li
                          key={item}
                          className="text-muted-foreground flex items-center gap-2"
                        >
                          <CheckCircle2 className="text-primary size-4 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Platform Capabilities Section */}
        <section id="features" className="scroll-mt-16 py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="outline" className="mb-3">
                Built for Reliability
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Clarity, Speed, and Privacy by Default
              </h2>
              <p className="text-muted-foreground mt-3 text-base">
                Health Master combines a fast Next.js interface with a hardened
                Go API backend to keep your records responsive and secure.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {platformCapabilities.map(item => (
                <Card key={item.title} className="border-border/80">
                  <CardHeader>
                    <div className="bg-primary/10 text-primary mb-3 flex size-10 items-center justify-center rounded-xl">
                      <item.icon className="size-5" />
                    </div>
                    <CardTitle className="text-base">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section
          id="workflow"
          className="border-border/60 bg-muted/20 scroll-mt-16 border-t py-20 md:py-24"
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="outline" className="mb-3">
                Simple Workflow
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Start Building Better Health Habits Today
              </h2>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {workflowSteps.map(step => (
                <div
                  key={step.step}
                  className="border-border/80 bg-card relative flex flex-col justify-between rounded-xl border p-6 shadow-2xs"
                >
                  <div>
                    <span className="text-muted-foreground/50 font-mono text-3xl font-bold">
                      {step.step}
                    </span>
                    <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
                    <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Call To Action */}
            <div className="border-border bg-card mt-16 rounded-2xl border p-8 text-center shadow-sm sm:p-12">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Ready to take control of your health metrics?
              </h2>
              <p className="text-muted-foreground mx-auto mt-3 max-w-xl text-sm sm:text-base">
                Join Health Master and start logging your blood pressure,
                weight, temperature, and height in a clean, distraction-free
                dashboard.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                {isAuthenticated ? (
                  <Link
                    href="/dashboard"
                    className={cn(
                      buttonVariants({ size: 'lg' }),
                      'h-11 px-6 text-sm font-semibold'
                    )}
                  >
                    <LayoutDashboard className="mr-1.5 size-4" />
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/sign-up"
                      className={cn(
                        buttonVariants({ size: 'lg' }),
                        'h-11 px-6 text-sm font-semibold'
                      )}
                    >
                      Create Free Account
                      <ArrowRight className="ml-1.5 size-4" />
                    </Link>
                    <Link
                      href="/sign-in"
                      className={cn(
                        buttonVariants({ variant: 'outline', size: 'lg' }),
                        'h-11 px-6 text-sm font-medium'
                      )}
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-border/60 border-t py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-xs sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 font-medium">
            <IconInnerShadowTop className="size-4" />
            <span>Health Master</span>
          </div>
          <div className="text-muted-foreground flex items-center gap-6">
            <Link
              href="/dashboard"
              className="hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/sign-in"
              className="hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="hover:text-foreground transition-colors"
            >
              Sign Up
            </Link>
          </div>
          <p className="text-muted-foreground">
            © {new Date().getFullYear()} Health Master. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
