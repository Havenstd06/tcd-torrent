import React from 'react';
import { render } from 'react-dom';

import Options from './Options';
import './index.css';
import '../../styles/tailwind.css';

render(
  <Options title={'TCD Torrent'} />,
  window.document.querySelector('#app-container')
);

if (module.hot) module.hot.accept();
