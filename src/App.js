import React from 'react';
import Blackjack from './components/Blackjack';
import { GlobalStyles } from './global';
const App = () => {
    return(
        <div>
            <GlobalStyles />
            <h1>Let's play Blackjack!</h1>
            <Blackjack />
        </div> 
    );
}

export default App;