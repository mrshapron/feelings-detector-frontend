import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

/**
 * Navbar component displays the top navigation bar with links and logout functionality.
 * It highlights the active page and provides feedback using toast notifications.
 */
const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();

  /**
   * Checks if the given path matches the current location.
   * @param path - The path to check.
   * @returns True if the path is active.
   */
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  /**
   * Handles user logout by calling signOut, showing a toast, and redirecting.
   */
  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Success",
        description: "You have been logged out",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  /**
   * Shows a toast indicating the Live Dashboard feature is not yet available.
   */
  const handleLiveDashboardClick = () => {
    toast({
      title: "Coming Soon",
      description: "Live Dashboard feature is currently under development",
    });
  };

  return (
    <nav className="w-full px-6 py-4 flex items-center justify-between bg-white border-b border-gray-100 animate-fade-in">
      {/* Logo and app name */}
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 bg-black rounded-full"></div>
        <span className="font-semibold text-lg text-black">EmotionAI Tool</span>
      </div>

      {/* Navigation links and actions */}
      <div className="flex items-center space-x-8">
        {/* Disabled Live Dashboard button with tooltip */}
        <button
          onClick={handleLiveDashboardClick}
          className="text-sm font-medium transition-colors text-gray-400 cursor-not-allowed relative group"
          disabled
        >
          Live Dashboard
          <div className="absolute bottom-[-32px] left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Coming Soon
          </div>
        </button>
        {/* Navigation links */}
        <NavLink href="/sessions" active={isActive('/sessions')}>Sessions</NavLink>
        <NavLink href="/settings" active={isActive('/settings')}>Settings</NavLink>
        {/* Logout button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-600 hover:text-black"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </Button>
      </div>
    </nav>
  );
};

/**
 * NavLink component renders a styled navigation link.
 * @param href - The target path.
 * @param children - The link label.
 * @param active - Whether the link is active.
 */
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  active: boolean;
}

const NavLink = ({ href, children, active }: NavLinkProps) => {
  return (
    <Link
      to={href}
      className={cn(
        "text-sm font-medium transition-colors hover:text-black relative",
        active
          ? "text-black after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-black after:bottom-[-8px] after:left-0"
          : "text-gray-600"
      )}
    >
      {children}
    </Link>
  );
};

export default Navbar;