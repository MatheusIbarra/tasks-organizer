import { BrowserRouter } from 'react-router-dom';
import Routes from './routes';
import background from './assets/background.png';
import './styles.css'
import AppProvider from './hooks';

function App() {
  return(
    <BrowserRouter>
      <AppProvider>
        <img alt="background" className="background-img" src={background}/>
        <Routes />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
