import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import { App } from './app';
import './styles.css';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter

const domNode = document.getElementById('root') as HTMLDivElement;
const root = createRoot(domNode);

root.render(
	<StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				{' '}
				{/* Оберни App в BrowserRouter */}
				<App />
			</BrowserRouter>
		</Provider>
	</StrictMode>
);
