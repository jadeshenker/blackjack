import React, { Component } from 'react';
import styled from 'styled-components';

class Blackjack extends Component {

  constructor(props) {
    super(props);
    this.state = {
      deckID: "",
      houseHand: [],
      houseScore: 0,
      userHand: [], 
      userScore: 0,
      gameOver: false,
      result: ""
    }
  }

  componentDidMount() {
    this.startGame();
  }

  startGame(){
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
    .then(res => res.json())
    .then(deck => {
      this.setState({
        deckID: deck.deck_id
      });
      //get house hand 
      this.houseDraw()
    })
    .catch(err => console.log(err))
  }

  //draw 2 cards for house 
  houseDraw(){
    fetch(`https://deckofcardsapi.com/api/deck/${this.state.deckID}/draw/?count=2`)
    .then(res => res.json())
    .then(data => {
      let cards = data.cards;
      let houseHand = [...this.state.houseHand, ...cards];
      let houseScore = this.calcScore(houseHand);
      this.setState({houseScore});
      this.setState({houseHand});
    })
    .catch(err => console.log(err))
  }

  //draw 1 card for user 
  hit(){
    fetch(`https://deckofcardsapi.com/api/deck/${this.state.deckID}/draw/?count=1`)
    .then(res => res.json())
    .then(data => {
      let card = data.cards;
      let userHand = [...this.state.userHand, ...card];
      let userScore = this.calcScore(userHand);
      this.setState({userScore});
      this.setState({userHand});
    })
    .catch(err => console.log(err))
  }

  stand() {
    this.checkScore(this.state.userScore);
  }

  //determine score of hand 
  calcScore(hand){
    let score = 0;
    let ace = false;

    for (const card of hand) {
      const value = card.value;
      if (isNaN(value)) {
        if (value==="ACE") {
          ace = true;
        } else {
          score += 10;
        }
      } else {
        score += Number(value);
      }
    }

    if (ace) {
      if (score + 11 > 21) {
        score += 1;
      } else { score += 11; }
    }

    //AUTOMATIC loss if score > 21 
    if (score > 21) {      
      this.setState({gameOver: true})
      this.setState({result: "You Lose 😔"});
    }
    return score;
  }

  checkScore(score) {
    let win = false;

    if (score !== this.state.houseScore) {
      if (score === 21 | score > this.state.houseScore) {
        win = true;
      } else { win = false; }
    } else { win = false; }

    if (win) {
      this.setState({result: "You Win! 🥳"});
    } else {
      this.setState({result: "You Lose 😔"});
    }

    this.setState({gameOver: true})
  }

  //reset the game 
  gameOver() {
    const userHand = [], houseHand = [], userScore = 0, houseScore = 0;

    this.setState({userHand});
    this.setState({houseHand});
    this.setState({userScore});
    this.setState({houseScore});
    this.setState({gameOver: false});

    this.startGame();
  }

  render() {

    const CardWrapper = styled.div`
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;

      img {
        width: 50%;
      }

      span {
        padding: 0.5rem 0.7rem;
        border-radius: 10px;
        border: 2px solid #907AD6;
        box-shadow: 3px 3px 10px #EDD4DA;
        color: #907AD6;
      }

      margin-bottom: 50px;
    `;

    const Button = styled.button`
      font-family: 'Work Sans', sans-serif;
      font-size: 1rem;
      background: #7067CF;
      color: #F6E8EA;
      border: none;
      margin: 0px 10px;
      border-radius: 30px;
      padding: 0.5rem 1rem;
      transition: all 0.2s linear;

      &:hover {
        box-shadow: 3px 3px 10px #EDD4DA;
        background: #907AD6;
      }
    `;

    const Paragraph = styled.p`
      font-size: 1.3rem;
    `;

    const renderCards = (hand) => {
      const cards = hand.map((card, index) => {
        //console.log(card)
        return(<div key={index}><img src={card.image} alt={`${card.value} OF ${card.suit}`}/></div>)
      });
      return cards;
    }

    return(
      <div>
        <CardWrapper> 
          <span>{this.state.houseScore}</span>
          {renderCards(this.state.houseHand)} 
        </CardWrapper>
        
        <CardWrapper> 
          <span>{this.state.userScore}</span>
          {renderCards(this.state.userHand)} 
        </CardWrapper>

        {!this.state.gameOver && 
          <div> <Button onClick={() => this.hit()}>hit</Button>
                <Button onClick={() => this.stand()}>stand</Button>
          </div>
        }

        {this.state.gameOver &&
          <div>
            <Paragraph>{this.state.result}</Paragraph>
            <Button onClick={() => this.gameOver()}>play again!</Button>
          </div>
        }
      </div>
    );
  }
}

export default Blackjack;
