import { Link } from 'react-router-dom';
import { MessageSquare, Users, BarChart3, Zap, Shield, Globe, ArrowRight, Star } from 'lucide-react';
import { api } from '../utils/api';
import { ROUTES } from '../utils/constants';

const Index = () => {
  const isAuthenticated = api.isAuthenticated();

  const features = [
    {
      icon: MessageSquare,
      title: 'Easy Form Creation',
      description: 'Build beautiful feedback forms in minutes with our intuitive drag-and-drop builder.'
    },
    {
      icon: Users,
      title: 'Collect Responses',
      description: 'Share forms via public URLs and gather feedback from customers effortlessly.'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'View responses in real-time with detailed analytics and export data as CSV.'
    },
    {
      icon: Globe,
      title: 'Public Access',
      description: 'No login required for respondents. Share forms with anyone, anywhere.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is protected with enterprise-grade security and privacy controls.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized for speed and performance. Create and deploy forms in seconds.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Product Manager',
      company: 'TechCorp',
      content: 'FeedbackHub transformed how we collect customer insights. The dashboard is incredibly intuitive.',
      rating: 5
    },
    {
      name: 'Mike Rodriguez',
      role: 'Startup Founder',
      company: 'InnovateLab',
      content: 'Simple, powerful, and exactly what we needed. Our response rates increased by 40%.',
      rating: 5
    },
    {
      name: 'Emily Johnson',
      role: 'Marketing Director',
      company: 'GrowthCo',
      content: 'The best feedback collection tool we\'ve used. Clean interface and robust analytics.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Collect Feedback
              <br />
              <span className="text-white/90">That Matters</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Create beautiful forms, gather valuable insights, and make data-driven decisions with our powerful feedback platform.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-slide-up">
            {isAuthenticated ? (
              <Link to={ROUTES.DASHBOARD} className="btn-accent inline-flex items-center space-x-2 text-lg px-8 py-4">
                <BarChart3 className="h-5 w-5" />
                <span>Go to Dashboard</span>
              </Link>
            ) : (
              <>
                <Link to={ROUTES.REGISTER} className="btn-accent inline-flex items-center space-x-2 text-lg px-8 py-4">
                  <span>Get Started Free</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link to={ROUTES.LOGIN} className="text-white hover:text-white/80 underline underline-offset-4 text-lg transition-colors">
                  Already have an account?
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Everything you need to collect feedback
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you understand your customers better
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="card-elevated text-center group animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Loved by teams worldwide
            </h2>
            <p className="text-xl text-muted-foreground">
              See what our customers are saying about FeedbackHub
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="card-elevated animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold text-sm">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card-elevated bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 animate-bounce-in">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to start collecting feedback?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of businesses using FeedbackHub to improve their products and services.
            </p>
            
            {!isAuthenticated && (
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Link to={ROUTES.REGISTER} className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4">
                  <span>Start Free Today</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <p className="text-sm text-muted-foreground">
                  No credit card required • Free forever plan available
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <MessageSquare className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              FeedbackHub
            </span>
          </div>
          <p className="text-muted-foreground">
            © 2025 FeedbackHub. Built with ❤️ for better customer insights.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;