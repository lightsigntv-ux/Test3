import { createRoot } from 'react-dom/client';
import '@fontsource/eb-garamond/latin-400.css';
import '@fontsource/eb-garamond/latin-400-italic.css';
import '@fontsource/eb-garamond/latin-600.css';
import '@fontsource/im-fell-english/latin-400.css';
import '@fontsource/im-fell-english/latin-400-italic.css';
import '@fontsource/caveat/latin-400.css';
import '@fontsource/caveat/latin-600.css';
import './styles.css';
import { App } from './App';
import { Controller } from './controller';
import { content } from '../content';

const ctl = new Controller(content());
(window as any).__serasfall = ctl; // für automatisierte Browser-Tests
createRoot(document.getElementById('root')!).render(<App ctl={ctl} />);
