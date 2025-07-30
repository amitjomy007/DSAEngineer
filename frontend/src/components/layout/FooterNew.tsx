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


export default FooterComponent;