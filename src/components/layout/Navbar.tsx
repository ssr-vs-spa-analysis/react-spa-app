import { Link, NavLink } from "react-router-dom";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm ${isActive ? "text-blue-600 font-semibold" : "text-slate-700"}`;

export const Navbar = () => (
  <header className="border-b border-slate-200 bg-white">
    <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
      <Link to="/" className="text-lg font-bold text-slate-900">
        eProdavnica
      </Link>
      <nav className="flex gap-4" aria-label="Glavna navigacija">
        <NavLink to="/" className={navClass}>
          Početna
        </NavLink>
        <NavLink to="/search" className={navClass}>
          Proizvodi
        </NavLink>
      </nav>
    </div>
  </header>
);
