import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import Fib from './Fib'
import OtherPage from './OtherPage'

function App() {
  return (
    <Router>

      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <Link to="/">Главная</Link>
          <Link to="/otherpage">Другая страница</Link>
          {/*
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
           <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a> */}
        </header>
        <div>
          <Route exact path="/" conponent={Fib} />
          <Route path="/otherpage" conponent={OtherPage}/>
        </div>
      </div>
    </Router>
  );
}

export default App;
