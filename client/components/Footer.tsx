import React from "react";

function Footer() {
  return (
    <footer className="py-12 bg-white">
      <div className="mx-auto px-4 text-center text-black">
        <p>&copy; {new Date().getFullYear()} Talent Quest. All rights reserved to Sirajudeen.</p>
      </div>
    </footer>
  );
}

export default Footer;