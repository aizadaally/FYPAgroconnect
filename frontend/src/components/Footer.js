// src/components/Footer.js

import React from 'react';
import { Container } from 'react-bootstrap';

function Footer() {
  return (
    <footer className="bg-success text-white py-4 mt-5">
      <Container>
        <div className="d-flex flex-wrap justify-content-between align-items-center">
          <div className="col-md-4 mb-3 mb-md-0">
            <h5>AgroConnect</h5>
            <p className="mb-0">Connecting farmers with buyers.</p>
          </div>
          <div className="col-md-4 mb-3 mb-md-0">
            <h5>Contact Us</h5>
            <p className="mb-0">Email: info@agroconnect.com</p>
            <p className="mb-0">Phone: +123-456-7890</p>
          </div>
          <div className="col-md-4">
            <h5>Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-white">Home</a></li>
              <li><a href="/about" className="text-white">About</a></li>
              <li><a href="/contact" className="text-white">Contact</a></li>
            </ul>
          </div>
        </div>
        <hr className="my-3" />
        <p className="text-center mb-0">© {new Date().getFullYear()} AgroConnect. All rights reserved.</p>
      </Container>
    </footer>
  );
}

export default Footer;