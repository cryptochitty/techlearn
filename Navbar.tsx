
import React from 'react';
import { Navbar as MainNavbar } from './components/Navbar';
import { View } from './types';

interface NavbarProps {
  onNavigate: (view: View, params?: any) => void;
  isLoggedIn: boolean;
  activeView: View;
}

/**
 * DEPRECATED: This root Navbar is maintained for compatibility.
 * Please use components/Navbar.tsx for the latest UI updates.
 */
export const Navbar: React.FC<NavbarProps> = (props) => {
  return <MainNavbar {...props} />;
};
