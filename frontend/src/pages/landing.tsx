import { useState, useEffect } from 'react';
import { 
  Brain, 
  Lock, 
  Users, 
  Star, 
  ChevronDown, 
  ChevronUp, 
//   Play,
//   Code,
// //   Zap,
  Trophy,
//   Shield,
  Rocket
} from 'lucide-react';

const DSAEngineerLanding = () => {
  // Centralized Event Handlers
  const handleEngineerNowClick = () => {
    console.log('Engineer Now clicked');
    // Future: Handle sign-up flow
  };

  const handleStartFreeClick = () => {
    console.log('Start for Free clicked');
    // Future: Handle free tier sign-up
  };

  const handleGetStartedClick = () => {
    console.log('Get Started clicked');
    // Future: Handle professional tier sign-up
  };

  const handleGoEliteClick = () => {
    console.log('Go Elite clicked');
    // Future: Handle elite tier sign-up
  };

  // Header Component
  const Header = () => {
    return (
      <header className="sticky top-0 z-50 w-full">
        <nav className="glass-card m-4 px-6 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="text-2xl font-bold text-gradient">
              DSAEngineer
            </div>
            <button 
              onClick={handleEngineerNowClick}
              className="btn-glow"
            >
              Engineer Now
            </button>
          </div>
        </nav>
      </header>
    );
  };

  // Hero Section
  const Hero = () => {
    useEffect(() => {
      const elements = document.querySelectorAll('.animate-fade-up');
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-fade-up');
            }
          });
        },
        { threshold: 0.1 }
      );

      elements.forEach((el) => observer.observe(el));
      return () => observer.disconnect();
    }, []);

    return (
      <section className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
        {/* Background Effect */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="text-center space-y-8 max-w-4xl mx-auto relative z-10">
          <h1 className="text-6xl md:text-8xl font-bold text-premium leading-tight animate-fade-up">
            Engineer Your Way to a{' '}
            <span className="text-gradient">Dream Career</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-secondary max-w-3xl mx-auto leading-relaxed animate-fade-up-delay-1">
            DSAEngineer provides the elite-level resources and AI-powered tools used by engineers at 
            Google, Amazon, and Meta. Stop grinding, start engineering.
          </p>

          <div className="pt-8 animate-fade-up-delay-2">
            <button 
              onClick={handleEngineerNowClick}
              className="btn-premium"
            >
              <Rocket className="inline-block mr-3 h-6 w-6" />
              Start Engineering
            </button>
          </div>
        </div>
      </section>
    );
  };

  // Social Proof Component
  const SocialProof = () => {
    const companies = [
      'Google', 'Amazon', 'Meta', 'Netflix', 'Apple', 'Microsoft', 'NVIDIA', 
      'Tesla', 'Uber', 'Airbnb', 'Spotify', 'Adobe'
    ];

    return (
      <section className="py-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-premium mb-16">
            Our Alumni Are Now At
          </h2>
          
          <div className="relative">
            <div className="flex animate-marquee space-x-16">
              {[...companies, ...companies].map((company, index) => (
                <div 
                  key={index}
                  className="flex-shrink-0 text-2xl md:text-3xl font-semibold text-muted hover:text-premium transition-colors duration-300"
                >
                  {company}
                </div>
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
        icon: <Brain className="h-8 w-8" />,
        title: "AI-Powered Path",
        description: "Our AI analyzes your skills and creates a custom learning path with problems you'll actually face in interviews."
      },
      {
        icon: <Lock className="h-8 w-8" />,
        title: "Exclusive Problem Bank",
        description: "Access a private, updated library of the latest interview and online assessment questions from top companies."
      },
      {
        icon: <Users className="h-8 w-8" />,
        title: "Alumni Network Access",
        description: "Connect directly with senior engineers and alumni who have successfully navigated the interview process."
      }
    ];

    return (
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-premium mb-4">
            The Unfair Advantage
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {features.map((feature, index) => (
              <div key={index} className="glass-card p-8 group">
                <div className="text-gradient mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-premium mb-4">
                  {feature.title}
                </h3>
                <p className="text-secondary leading-relaxed">
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
        type: "Free",
        features: [
          "Standard Problem Solving",
          "Code Review",
          "Time & Space Complexity Analysis",
          "Contests",
          "Limited Chatbot Support"
        ],
        buttonText: "Start for Free",
        buttonAction: handleStartFreeClick,
        popular: false
      },
      {
        name: "Professional",
        type: "12 Months",
        features: [
          "AI Comment Classifier",
          "Custom Problem Paths",
          "Spotify Music Player",
          "Better AI Models",
          "Merchandise Giveaway Eligibility"
        ],
        buttonText: "Get Started",
        buttonAction: handleGetStartedClick,
        popular: true
      },
      {
        name: "Elite",
        type: "Lifetime",
        features: [
          "Lifetime Access",
          "Top-Tier AI Models",
          "Company-Wise Exclusive Problems from Latest OAs",
          "System Design Resources",
          "Chat with Alumni"
        ],
        buttonText: "Go Elite",
        buttonAction: handleGoEliteClick,
        popular: false
      }
    ];

    return (
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-premium mb-16">
            Choose Your Engineering Tier
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div 
                key={index} 
                className={`glass-card p-8 relative ${
                  plan.popular 
                    ? 'scale-105 border-cyan-500/50 shadow-2xl shadow-cyan-500/20' 
                    : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-premium mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-secondary">
                    {plan.type}
                  </p>
                </div>
                
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <div className="text-cyan-400 mr-3 mt-1">
                        <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
                      </div>
                      <span className="text-secondary text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <button 
                  onClick={plan.buttonAction}
                  className={`w-full ${plan.popular ? 'btn-premium' : 'btn-glow'} text-center`}
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

  // Testimonials Section
  const Testimonials = () => {
    const testimonials = [
      {
        name: "Alex Chen",
        quote: "DSAEngineer's AI-powered approach helped me land a senior role at Google. The personalized learning path was exactly what I needed.",
        rating: 5,
        company: "Google"
      },
      {
        name: "Sarah Rodriguez",
        quote: "The exclusive problem bank had questions I actually faced in my Meta interview. The alumni network was invaluable for preparation.",
        rating: 5,
        company: "Meta"
      },
      {
        name: "Michael Park",
        quote: "From struggling with medium problems to solving hard ones effortlessly. DSAEngineer transformed my technical interview skills.",
        rating: 5,
        company: "Amazon"
      },
      {
        name: "Emily Zhang",
        quote: "The system design resources and mentorship helped me transition from a mid-level to senior engineer at Netflix.",
        rating: 5,
        company: "Netflix"
      }
    ];

    return (
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-premium mb-16">
            Trusted by Top Engineers
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="glass-card p-6">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-secondary mb-6 text-sm leading-relaxed">
                  "{testimonial.quote}"
                </p>
                
                <div>
                  <div className="font-semibold text-premium">
                    {testimonial.name}
                  </div>
                  <div className="text-muted text-sm">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // FAQ Section
  const FAQ = () => {
    const [openItems, setOpenItems] = useState<Record<number, boolean>>({});

    const toggleItem = (index: number) => {
      setOpenItems(prev => ({
        ...prev,
        [index]: !prev[index]
      }));
    };

    const faqs = [
      {
        question: "How is DSAEngineer different from other coding platforms?",
        answer: "DSAEngineer uses advanced AI to create personalized learning paths and provides exclusive access to real interview questions from top companies. Our alumni network offers direct mentorship from engineers at FAANG companies."
      },
      {
        question: "What makes the problem bank 'exclusive'?",
        answer: "Our problem bank contains real questions from recent online assessments and interviews at top tech companies, updated regularly by our alumni network. These aren't available on public platforms."
      },
      {
        question: "How does the AI-powered learning path work?",
        answer: "Our AI analyzes your coding patterns, strengths, and weaknesses to create a customized curriculum. It adapts in real-time based on your progress and focuses on areas that need improvement."
      },
      {
        question: "Can I get mentorship from actual engineers at top companies?",
        answer: "Yes, Elite tier members get direct access to our alumni network of engineers at Google, Amazon, Meta, and other top companies for mentorship and interview preparation."
      },
      {
        question: "What's included in the system design resources?",
        answer: "Our system design section includes real case studies from top companies, scalable architecture patterns, and practice sessions with experienced engineers who have designed systems at scale."
      }
    ];

    return (
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-premium mb-16">
            Your Questions, Answered
          </h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="glass-card overflow-hidden">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors duration-200"
                >
                  <span className="font-semibold text-premium pr-4">
                    {faq.question}
                  </span>
                  {openItems[index] ? (
                    <ChevronUp className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                  )}
                </button>
                
                {openItems[index] && (
                  <div className="px-6 pb-6">
                    <p className="text-secondary leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  // Final CTA Section
  const FinalCTA = () => {
    return (
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-premium mb-8">
            Ready to engineer your way to the next{' '}
            <span className="text-gradient">FAANG/Dream company?</span>
          </h2>
          
          <div className="pt-8">
            <button 
              onClick={handleEngineerNowClick}
              className="btn-premium text-xl px-16 py-6"
            >
              <Trophy className="inline-block mr-4 h-7 w-7" />
              Engineer Now
            </button>
          </div>
        </div>
      </section>
    );
  };

  // Footer
  const Footer = () => {
    return (
      <footer className="py-8 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted text-sm">
            © 2024 DSAEngineer. All rights reserved. 
            <span className="mx-4">|</span>
            <a href="#" className="hover:text-premium transition-colors">Privacy</a>
            <span className="mx-4">|</span>
            <a href="#" className="hover:text-premium transition-colors">Terms</a>
            <span className="mx-4">|</span>
            <a href="#" className="hover:text-premium transition-colors">Contact</a>
          </p>
        </div>
      </footer>
    );
  };

  // Main Component Return
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <SocialProof />
      <WhyDSAEngineer />
      <Pricing />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default DSAEngineerLanding;