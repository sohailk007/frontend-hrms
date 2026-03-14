import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
      <footer className="footer">
        <p>© {new Date().getFullYear()} HRMS Lite — All rights reserved</p>
      </footer>
    </div>
  );
};

export default Layout;