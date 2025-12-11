// src/components/layout/Footer.jsx
function Footer() {
  return (
    <footer
      style={{
        padding: "1rem 2rem",
        borderTop: "1px solid #e5e5e5",
        fontSize: "0.875rem",
        color: "#555",
        textAlign: "center",
      }}
    >
      © {new Date().getFullYear()} Sistem Putusan Terdistribusi Nasional
    </footer>
  );
}

export default Footer;
