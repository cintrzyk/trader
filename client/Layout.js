import React from 'react';

const Layout = props => (
  <html lang="en">
    <head>
      <title>{props.title}</title>
      <link rel="stylesheet" type="text/css" href="http://localhost:3001/app.css" />
    </head>
    <body>
      <div id="react-app" dangerouslySetInnerHTML={{ __html: props.children }} />
      <script src="http://localhost:3001/app.js" />
    </body>
  </html>
);

export default Layout;
