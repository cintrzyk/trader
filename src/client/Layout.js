import React from 'react';
import PropTypes from 'prop-types';

const Layout = props => (
  <html lang="en">
    <head>
      <title>{props.title}</title>
      <link href="https://fonts.googleapis.com/css?family=Oswald:200,400,500" rel="stylesheet" />
      <link rel="stylesheet" type="text/css" href={`${props.assetsDomain}/assets/styles-bundle.css`} />
    </head>
    <body>
      <div id="react-app" className="app" dangerouslySetInnerHTML={{ __html: props.children }} />
      <script src={`${props.assetsDomain}/assets/app.js`} />
      <script src="https://use.fontawesome.com/2e54a8e14f.js" />
    </body>
  </html>
);

Layout.propTypes = {
  assetsDomain: PropTypes.string.isRequired,
  children: PropTypes.node,
  title: PropTypes.string.isRequired,
};

export default Layout;
