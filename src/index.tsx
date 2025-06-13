import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import { App } from './app';
import './styles.css';
import { BrowserRouter } from 'react-router-dom';

const domNode = document.getElementById('root') as HTMLDivElement;
const root = createRoot(domNode);

// Динамически определяем basename: для GitHub Pages '/Ya_Practicum_React', для локальной разработки — '/'
const basename =
	process.env.NODE_ENV === 'production' ? '/Ya_Practicum_React' : '/';

root.render(
	<StrictMode>
		<Provider store={store}>
			<BrowserRouter basename={basename}>
				<App />
			</BrowserRouter>
		</Provider>
	</StrictMode>
);
