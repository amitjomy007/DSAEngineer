import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Brain,
  Lock,
  Users,
  Star,
  Menu,
  X,
  User,
  Trophy,
} from "lucide-react";

const DSAEngineer = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Event Handlers

  const handleGetStarted = (tier: string) => {
    console.log(`Get Started clicked for ${tier}`);
  };

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Header Component
  const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

    return (
      <header className="fixed top-0 py-3 left-0 right-0 z-50 backdrop-blur-glass bg-glass-bg/80 border-b border-glass-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                DSAEngineer
              </h1>
            </div>

            {/* --- Desktop Navigation with the Gold Button --- */}
            <div className="hidden md:block">
              <button
                onClick={handleEngineerNow}
                // The core container handles the click feedback. This is unchanged.
                className="relative inline-flex items-center justify-center rounded-lg group transition-transform duration-200 ease-in-out active:scale-95"
              >
                {/* Layer 1: The "Flowing" Aura */}
                {/* The blur and inset are slightly reduced to fit the smaller scale. */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400 to-orange-600 rounded-lg blur-lg opacity-60 group-hover:opacity-100 transition duration-1500 animate-slow-flow bg-[length:200%_200%]"></div>

                {/* Layer 2: The Button Body & Text */}
                {/* The padding and text size are scaled down for the header. */}
                <div className="relative flex items-center justify-center w-full px-6 py-2 text-sm font-semibold text-black bg-gradient-to-br from-amber-300 via-yellow-400 to-amber-300 rounded-md overflow-hidden shadow-inner shadow-black/10 transition-transform duration-300 group-hover:scale-105">
                  {/* Layer 3: The Luxurious Metallic Shine */}
                  {/* This effect remains unchanged and works perfectly at a smaller size. */}
                  <div className="absolute top-0 left-[-200%] h-full w-[75%] skew-x-[-25deg] bg-white/30 transition-[left] duration-[1500ms] ease-in-out group-hover:left-[200%]"></div>

                  <span className="relative z-10">Engineer Now</span>
                </div>
              </button>
            </div>

            {/* Mobile Menu Button (Unchanged) */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg bg-glass-bg border border-glass-border text-text-primary hover:bg-glass-hover transition-all duration-300"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu (Unchanged) */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-16 left-0 right-0 bg-glass-bg backdrop-blur-glass border-b border-glass-border">
              <div className="px-6 py-4">
                <button
                  onClick={handleEngineerNow}
                  className="w-full px-6 py-3 rounded-lg bg-gradient-primary text-background font-medium hover:opacity-90 transition-opacity duration-300"
                >
                  Engineer Now
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
    );
  };

  // Hero Section Component
  const Hero = () => (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-slate-900"></div>
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "100px 100px",
        }}
      ></div>

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000"></div>

      <div className="relative z-10 text-center max-w-5xl mx-auto px-6 lg:px-8">
        <div className="animate-fade-in-up">
          <h1 className="sm:pt-20 text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            Engineer Your Way to a{" "}
            <span className="bg-gradient-accent bg-clip-text text-transparent animate-gradient-shift bg-300% bg-size-200">
              Dream Career
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-text-secondary mb-12 max-w-4xl mx-auto leading-relaxed">
            DSAEngineer provides the elite-level resources and AI-powered tools
            used by engineers at{" "}
            <span className="text-primary font-semibold">Google</span>,{" "}
            <span className="text-primary font-semibold">Amazon</span>, and{" "}
            <span className="text-primary font-semibold">Meta</span>. Stop
            grinding, start engineering.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleEngineerNow}
              className="px-8 py-4 bg-gradient-primary text-background font-semibold text-lg rounded-lg shadow-glow-primary hover:opacity-90 transform hover:scale-105 transition-all duration-300"
            >
              Start Engineering
            </button>
            <button className="px-8 py-4 bg-glass-bg backdrop-blur-glass border border-glass-border text-text-primary font-semibold text-lg rounded-lg hover:bg-glass-hover hover:border-primary transition-all duration-300">
              Explore Features
            </button>
          </div>
        </div>
      </div>
    </section>
  );

  // Social Proof Component
  const SocialProof = () => {
    const companies = [
      "Google",
      "Amazon",
      "Meta",
      "Netflix",
      "Apple",
      "Microsoft",
      "NVIDIA",
      "Tesla",
      "Spotify",
      "Uber",
    ];

    return (
      <section className="py-16 border-t border-glass-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-12 text-text-secondary">
            Our Alumni Are Now At
          </h2>

          <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)] ">
            <div className="flex animate-marquee">
              {[...companies, ...companies].map((company, index) => (
                <span
                  key={index}
                  className="flex-shrink-0 mx-8 text-text-primary font-medium text-xl duration-300 hover:scale-110 hover:text-accent-gold "
                >
                  {company}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  };

  // Why DSAEngineer Section
  const WhyDSAEngineer = () => {
    const features = [
      {
        icon: <Brain className="w-8 h-8" />,
        title: "AI-Powered Path",
        description:
          "Our AI analyzes your skills and creates a custom learning path with problems you'll actually face in interviews.",
      },
      {
        icon: <Lock className="w-8 h-8" />,
        title: "Exclusive Problem Bank",
        description:
          "Access a private, updated library of the latest interview and online assessment questions from top companies.",
      },
      {
        icon: <Users className="w-8 h-8" />,
        title: "Alumni Network Access",
        description:
          "Connect directly with senior engineers and alumni who have successfully navigated the interview process.",
      },
    ];

    return (
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              The{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Unfair Advantage
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-glass-bg backdrop-blur-glass border border-glass-border rounded-lg shadow-glass hover:bg-glass-hover hover:border-amber-500 hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="text-amber-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-text-primary">
                  {feature.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Pricing Section
  const Pricing = () => {
    const plans = [
      {
        name: "Starter",
        price: "Free",
        period: "",
        features: [
          "Standard Problem Solving",
          "Code Review",
          "Time & Space Complexity Analysis",
          "Contests",
          "Limited Chatbot Support",
        ],
        buttonText: "Start for Free",
        highlighted: false,
      },
      {
        name: "Professional",
        price: "$49",
        period: "/month",
        features: [
          "AI Comment Classifier",
          "Custom Problem Paths",
          "Spotify Music Player",
          "Better AI Models",
          "Merchandise Giveaway Eligibility",
        ],
        buttonText: "Get Started",
        highlighted: true,
      },
      {
        name: "Elite",
        price: "$299",
        period: "/lifetime",
        features: [
          "Lifetime Access",
          "Top-Tier AI Models",
          "Company-Wise Exclusive Problems",
          "System Design Resources",
          "Chat with Alumni",
        ],
        buttonText: "Go Elite",
        highlighted: false,
      },
    ];

    return (
      <section className="py-24 border-t border-glass-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Choose Your{" "}
              <span className="bg-gradient-secondary bg-clip-text text-transparent">
                Engineering Tier
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`relative p-8 bg-glass-bg backdrop-blur-glass border rounded-lg shadow-glass transition-all duration-300 transform hover:-translate-y-2 ${
                  plan.highlighted
                    ? "border-primary shadow-glow-primary scale-105"
                    : "border-glass-border hover:border-primary hover:shadow-glow-primary"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-amber-400 to-amber-600 px-4 py-2 rounded-full text-black text-sm font-semibold shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-text-primary mb-4">
                    {plan.name}
                  </h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-text-primary">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-text-secondary">{plan.period}</span>
                    )}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-text-secondary">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleGetStarted(plan.name)}
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                    plan.highlighted
                      ? "bg-gradient-primary text-background hover:opacity-90"
                      : "bg-glass-bg border border-glass-border text-text-primary hover:bg-glass-hover hover:border-primary"
                  }`}
                >
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Reviews Section
  const Reviews = () => {
    const testimonials = [
      {
        name: "Alex Chen",
        role: "Software Engineer at Google",
        content:
          "DSAEngineer's AI-powered approach helped me identify my weak areas and practice exactly what I needed for my Google interview.",
        rating: 5,
      },
      {
        name: "Sarah Johnson",
        role: "Senior Developer at Meta",
        content:
          "The exclusive problem bank was a game-changer. I encountered similar problems in my actual Meta onsite interviews.",
        rating: 4,
      },
      {
        name: "Michael Rodriguez",
        role: "Principal Engineer at Amazon",
        content:
          "The alumni network connection was invaluable. Having mentors who went through the same process made all the difference.",
        rating: 4,
      },
      {
        name: "Emily Wang",
        role: "Tech Lead at Netflix",
        content:
          "From struggling with basic algorithms to landing my dream job at Netflix. DSAEngineer made the impossible possible.",
        rating: 5,
      },
      {
        name: "David Park",
        role: "Senior SDE at Microsoft",
        content:
          "The mock interviews with real engineers gave me the confidence I needed. The feedback was incredibly detailed and actionable.",
        rating: 5,
      },
      {
        name: "Lisa Martinez",
        role: "Staff Engineer at Uber",
        content:
          "DSAEngineer's system design resources are unmatched. They prepared me for the most challenging technical discussions.",
        rating: 4,
      },
      {
        name: "James Wilson",
        role: "Tech Lead at Apple",
        content:
          "The personalized learning path adapted to my schedule and learning style. Landed my dream job in just 3 months!",
        rating: 5,
      },
      {
        name: "Rachel Kim",
        role: "Senior Engineer at Spotify",
        content:
          "The company-specific problem sets were incredibly accurate. I saw almost identical questions in my actual interviews.",
        rating: 4,
      },
      {
        name: "Tom Anderson",
        role: "Principal SDE at Airbnb",
        content:
          "The alumni mentorship program connected me with engineers who understood exactly what I was going through.",
        rating: 5,
      },
      {
        name: "Sophie Chang",
        role: "Engineering Manager at Tesla",
        content:
          "DSAEngineer helped me transition from individual contributor to engineering leadership. The career guidance was invaluable.",
        rating: 5,
      },
      {
        name: "Mark Roberts",
        role: "Senior Engineer at Shopify",
        content:
          "The AI-powered code review feature helped me write cleaner, more efficient code. My interview performance improved dramatically.",
        rating: 4,
      },
      {
        name: "Anna Kowalski",
        role: "Tech Lead at Dropbox",
        content:
          "The platform's adaptive difficulty kept me challenged but not overwhelmed. Perfect preparation for senior-level positions.",
        rating: 5,
      },
      {
        name: "Chris Thompson",
        role: "Principal Engineer at LinkedIn",
        content:
          "DSAEngineer's comprehensive approach covered everything from coding to system design to behavioral questions. Complete package!",
        rating: 5,
      },
      {
        name: "Maya Patel",
        role: "Senior SDE at Twitch",
        content:
          "The real-time collaboration features made practicing with peers incredibly valuable. Built lasting professional relationships too!",
        rating: 5,
      },
    ];

    return (
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Trusted by{" "}
              <span className="bg-gradient-accent bg-clip-text text-transparent">
                Top Engineers
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 h-[600px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
            {/* Left Column - Moving Up */}
            <div className="relative">
              <div className="animate-infinite-scroll-up">
                {[...testimonials, ...testimonials]
                  .slice(0, 14)
                  .map((testimonial, index) => (
                    <div
                      key={`up-${index}`}
                      className="p-6 bg-glass-bg backdrop-blur-glass border border-glass-border rounded-lg shadow-glass hover:bg-glass-hover hover:border-primary transition-all duration-300 mb-6"
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 border border-glass-border rounded-full flex items-center justify-center mr-3">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 text-accent-gold fill-current"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-text-secondary mb-4 text-sm leading-relaxed">
                        "{testimonial.content}"
                      </p>
                      <div>
                        <p className="font-semibold text-text-primary text-sm">
                          {testimonial.name}
                        </p>
                        <p className="text-text-muted text-xs">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Right Column - Moving Down */}
            <div className="relative">
              <div className="animate-infinite-scroll-down">
                {[...testimonials, ...testimonials]
                  .slice(7, 21)
                  .map((testimonial, index) => (
                    <div
                      key={`down-${index}`}
                      className="p-6 bg-glass-bg backdrop-blur-glass border border-glass-border rounded-lg shadow-glass hover:bg-glass-hover hover:border-primary transition-all duration-300 mb-6"
                    >
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 border border-glass-border rounded-full flex items-center justify-center mr-3">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 text-accent-gold fill-current"
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-text-secondary mb-4 text-sm leading-relaxed">
                        "{testimonial.content}"
                      </p>
                      <div>
                        <p className="font-semibold text-text-primary text-sm">
                          {testimonial.name}
                        </p>
                        <p className="text-text-muted text-xs">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  // FAQ Section and CTA
  const FAQCTA = () => {
    const faqs = [
      {
        question: "How is DSAEngineer different from other coding platforms?",
        answer:
          "DSAEngineer focuses exclusively on interview preparation for top-tier tech companies. Our AI analyzes your performance and creates personalized learning paths, while our exclusive problem bank contains real questions from recent interviews.",
      },
      {
        question: "What makes the AI-powered approach effective?",
        answer:
          "Our AI doesn't just track your progress—it understands your coding patterns, identifies knowledge gaps, and predicts which types of problems you'll struggle with. This allows for targeted practice that's 10x more efficient than random problem solving.",
      },
      {
        question: "How recent are the problems in your exclusive bank?",
        answer:
          "Our problem bank is updated weekly with new questions from recent interviews at FAANG and other top companies. We have a network of engineers who contribute questions they encountered in their interviews.",
      },
      {
        question: "Can I connect with alumni after getting hired?",
        answer:
          "Absolutely! Our alumni network continues to grow, and members often help each other with career advice, referrals, and guidance even after landing their dream jobs. It's a lifelong community.",
      },
      {
        question:
          "What if I'm a complete beginner to Data Structures and Algorithms?",
        answer:
          "DSAEngineer is designed for all skill levels. Our AI will assess your current knowledge and create a learning path that starts from the fundamentals if needed. Many of our successful alumni started as complete beginners.",
      },
    ];

    return (
      <section className="py-24 border-t border-glass-border">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 pb-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Your Questions,{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Answered
              </span>
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-glass-bg backdrop-blur-glass border border-glass-border rounded-lg shadow-glass overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-glass-hover transition-all duration-300"
                >
                  <span className="font-semibold text-text-primary pr-4">
                    {faq.question}
                  </span>
                  <div className="flex-shrink-0">
                    {openFAQ === index ? (
                      <ChevronDown className="w-5 h-5 text-primary" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-text-muted" />
                    )}
                  </div>
                </button>

                {openFAQ === index && (
                  <div className="px-6 pb-6 animate-accordion-down">
                    <p className="text-text-secondary leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* <div className="border-t border-glass-border mb-24 "></div> */}
        {/* --- CTA Section (Unchanged) --- */}
        <div className="max-w-4xl mx-auto px-6 mb-24 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight text-text-primary">
            Ready to engineer your way to the next{" "}
            <span className="bg-gradient-accent bg-clip-text text-transparent">
              FAANG/Dream company?
            </span>
          </h2>

          <button
            onClick={handleEngineerNow}
            className="btn-premium mt-6 text-xl px-16 py-6"
          >
            <Trophy className="inline-block mr-4 h-7 w-7" />
            Engineer Now
          </button>
        </div>
      </section>
    );
  };

  // Footer
  const handleEngineerNow = () => {
    console.log("Engineer Now button clicked!");
    const VITE_FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;
    window.location.href = VITE_FRONTEND_URL;
  };

  const FooterComponent = () => (
    <section className="py-24 border-t border-glass-border bg-background">
      {/* --- New Enhanced Footer --- */}
      <footer className=" ">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Column 1: Branding and Copyright */}
            <div className="md:col-span-2 lg:col-span-1">
              <h3 className="text-2xl font-bold text-text-primary">
                DSAEngineer
              </h3>
              <p className="mt-4 text-text-secondary">
                Engineer Your Future. The ultimate platform for aspiring
                top-tier software engineers.
              </p>
              <p className="mt-6 text-sm text-text-muted">
                © 2025 DSAEngineer. All rights reserved.
              </p>
            </div>

            {/* Column 2: Platform Links */}
            <div>
              <h4 className="font-semibold text-text-primary tracking-wider uppercase">
                Platform
              </h4>
              <div className="mt-4 space-y-3">
                <a className="block text-text-muted cursor-not-allowed">
                  AI Coach
                </a>
                <a className="block text-text-muted cursor-not-allowed">
                  Problem Bank
                </a>
                <a className="block text-text-muted cursor-not-allowed">
                  Mock Interviews
                </a>
                <a className="block text-text-muted cursor-not-allowed">
                  System Design
                </a>
                <a className="block text-text-muted cursor-not-allowed">
                  Pricing
                </a>
              </div>
            </div>

            {/* Column 3: Resources Links */}
            <div>
              <h4 className="font-semibold text-text-primary tracking-wider uppercase">
                Resources
              </h4>
              <div className="mt-4 space-y-3">
                <a className="block text-text-muted cursor-not-allowed">Blog</a>
                <a className="block text-text-muted cursor-not-allowed">
                  Success Stories
                </a>
                <a className="block text-text-muted cursor-not-allowed">
                  Community
                </a>
                <a className="block text-text-muted cursor-not-allowed">
                  Guides
                </a>
                <a className="block text-text-muted cursor-not-allowed">
                  Events
                </a>
              </div>
            </div>

            {/* Column 4: Company Links */}
            <div>
              <h4 className="font-semibold text-text-primary tracking-wider uppercase">
                Company
              </h4>
              <div className="mt-4 space-y-3">
                <a className="block text-text-muted cursor-not-allowed">
                  About Us
                </a>
                <a className="block text-text-muted cursor-not-allowed">
                  Careers
                </a>
                <a className="block text-text-muted cursor-not-allowed">
                  Contact
                </a>
                <a className="block text-text-muted cursor-not-allowed">
                  Privacy Policy
                </a>
                <a className="block text-text-muted cursor-not-allowed">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );

  return (
    <div className="min-h-screen bg-background text-text-primary relative overflow-hidden">
      {/* Global Grid Background */}
      <div
        className="fixed inset-0 opacity-30 z-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(128,128,128, 0.25) 1px, transparent 1px),
            linear-gradient(90deg, rgba(128,128,128, 0.25) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      ></div>
      {/* Black gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-transparent via-black/20 to-black/40 z-0"></div>

      <div className="relative z-10">
        <Header />
        <Hero />
        <SocialProof />
        <WhyDSAEngineer />
        <Pricing />
        <Reviews />
        <FAQCTA />
        <FooterComponent />
      </div>
    </div>
  );
};

export default DSAEngineer;
