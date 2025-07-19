import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, User, LogOut, Plus, BarChart3 } from 'lucide-react';
import { api } from '../utils/api';
import { ROUTES } from '../utils/constants';

const Navbar = () => {
  const navigate = useNavigate();
  const user = api.getCurrentUser();
  const isAuthenticated = api.isAuthenticated();

  const handleLogout = () => {
    api.logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <nav className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link 
            to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.HOME} 
            className="flex items-center space-x-2 group"
          >
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              FeedbackHub
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Authenticated Navigation */}
                <Link
                  to={ROUTES.DASHBOARD}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:block">Dashboard</span>
                </Link>
                
                <Link
                  to={ROUTES.CREATE_FORM}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden sm:block">Create Form</span>
                </Link>

                {/* User Menu */}
                <div className="flex items-center space-x-3 pl-3 border-l border-border">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 rounded-full bg-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-foreground">
                      {user?.name || user?.email}
                    </span>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 px-3 py-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:block">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Unauthenticated Navigation */}
                <Link
                  to={ROUTES.LOGIN}
                  className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  Login
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className="btn-primary"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;