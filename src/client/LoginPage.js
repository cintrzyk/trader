import React from 'react';

const LoginPage = () => (
  <html lang="en">
    <head>
      <title>Sign in</title>
      <link href="https://fonts.googleapis.com/css?family=Oswald:200,400,500" rel="stylesheet" />
    </head>
    <body style={{ background: '#17181c' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        height: '100vh',
      }}>
        <a
          href="/connect/google"
          style={{
            display: 'flex',
            margin: '0 auto',
            background: '#e94336',
            padding: '20px 25px',
            borderRadius: '4px',
            color: '#fff',
            textDecoration: 'none',
            textTransform: 'uppercase',
            fontFamily: 'Oswald,sans-serif',
            alignItems: 'center',
            letterSpacing: '2px',
          }}>
          <i className="fa fa-google" style={{ marginRight: '25px' }} /> Sign in with Google
        </a>
      </div>
      <script src="https://use.fontawesome.com/2e54a8e14f.js" />
    </body>
  </html>
);

export default LoginPage;
