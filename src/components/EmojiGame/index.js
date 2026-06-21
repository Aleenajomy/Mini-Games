import React from 'react'
import {Link} from 'react-router-dom'
import Modal from 'react-modal'
import {CgClose} from 'react-icons/cg'
import {BiArrowBack} from 'react-icons/bi'
import './emoji.css'

import emojisList from '../../data/emojisList'

if (document.getElementById('root')) {
  Modal.setAppElement('#root')
}

const rulesText = [
  'User should be able to see the list of Emojis',
  'When the user clicks any one of the Emoji for the first time, then the count of the score should be incremented by 1 and the list of emoji cards should be shuffled.',
  'This process should be repeated every time the user clicks on an emoji card that has not been clicked yet.',
  'When the user clicks on all the emojis exactly once, then the user will win the game',
  'When the user clicks on the same emoji that was clicked earlier, then the user will lose the game.',
  'Once the game is over, the user will be redirected to the results page.',
]

class EmojiGame extends React.Component {
  state = {
    view: 'rules',
    score: 0,
    topScore: localStorage.getItem('emojiTopScore')
      ? parseInt(localStorage.getItem('emojiTopScore'), 10)
      : 0,
    clickedEmojis: [],
    emojis: [...emojisList],
    isModalOpen: false,
    gameStatus: '',
  }

  shuffleEmojis = () => {
    this.setState(prevState => ({
      emojis: [...prevState.emojis].sort(() => Math.random() - 0.5),
    }))
  }

  startPlaying = () => {
    window.scrollTo(0, 0)
    this.setState({
      view: 'playing',
      score: 0,
      clickedEmojis: [],
      emojis: [...emojisList].sort(() => Math.random() - 0.5),
    })
  }

  handleEmojiClick = id => {
    const {clickedEmojis, score, topScore} = this.state
    if (clickedEmojis.includes(id)) {
      const finalScore = score
      if (finalScore > topScore) {
        localStorage.setItem('emojiTopScore', finalScore)
        this.setState({topScore: finalScore})
      }
      this.setState({view: 'result', gameStatus: 'lost'})
    } else {
      const newClickedEmojis = [...clickedEmojis, id]
      const newScore = score + 1
      if (newScore === 12) {
        if (newScore > topScore) {
          localStorage.setItem('emojiTopScore', newScore)
          this.setState({topScore: newScore})
        }
        this.setState({
          score: newScore,
          clickedEmojis: newClickedEmojis,
          view: 'result',
          gameStatus: 'won',
        })
      } else {
        this.setState(
          {score: newScore, clickedEmojis: newClickedEmojis},
          this.shuffleEmojis,
        )
      }
    }
  }

  openModal = () => this.setState({isModalOpen: true})

  closeModal = () => this.setState({isModalOpen: false})

  renderRulesView = () => (
    <div className="EmojiRulesMainContainer">
      <div className="EmojiHomeBack">
        <div className="rulesBackWidth">
          <Link to="/">
            <button type="button" className="BackButton">
              <BiArrowBack className="BackIcon white" />
              Back
            </button>
          </Link>
        </div>
      </div>
      <div className="initialRules">
        <div className="InitialRulesContainer">
          <div className="InitialRulesFirstContainer">
            <img
              src="https://assets.ccbp.in/frontend/react-js/game-logo-img.png"
              alt="emoji game"
              className="InitialEmojiRulesImage"
            />
            <h1
              className="white"
              style={{
                fontFamily: 'Bree Serif',
                fontSize: '28px',
                marginTop: '16px',
                textAlign: 'center',
              }}
            >
              Emoji Game
            </h1>
          </div>
          <div className="InitialRulesSecondContainer">
            <h1 className="InitialRulesHeading">Rules</h1>
            <ul className="emojigameUnorderedList">
              {rulesText.map(rule => (
                <li key={rule} className="InitialrulesListItem">
                  {rule}
                </li>
              ))}
            </ul>
            <div className="InitialRulesPlayContainer">
              <button
                type="button"
                onClick={this.startPlaying}
                className="EmojiStartPlayingButton"
              >
                Start playing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  renderPlayingView = () => {
    const {score, topScore, emojis, isModalOpen} = this.state
    return (
      <div className="EmojiGameMainContainer">
        <nav className="navbarContainer">
          <div className="insideNavBarContainer">
            <div className="navbarInsideContainer">
              <img
                src="https://assets.ccbp.in/frontend/react-js/game-logo-img.png"
                alt="emoji logo"
                className="logoImg"
              />
              <h1 className="emojiLogoPara">Emoji Game</h1>
            </div>
            <div className="navbarInsideContainer">
              <p className="EmojiNavbarPara">Score: {score}</p>
              <p className="EmojiNavbarPara">Top Score: {topScore}</p>
            </div>
          </div>
        </nav>
        <div className="EmojiHomeBack">
          <Link to="/">
            <button type="button" className="BackButton">
              <BiArrowBack className="BackIcon white" />
              Back
            </button>
          </Link>
          <button
            type="button"
            onClick={this.openModal}
            className="trigger-button white"
          >
            Rules
          </button>
        </div>
        <div className="cardsContainer-emoji">
          <ul className="UnorderedList">
            {emojis.map(emoji => (
              <li key={emoji.id} className="eachEmojiContainer">
                <button
                  type="button"
                  onClick={() => this.handleEmojiClick(emoji.id)}
                  className="ButtonEmoji"
                >
                  <img
                    src={emoji.emojiUrl}
                    alt={emoji.emojiName.toLowerCase()}
                    aria-label={emoji.emojiName}
                    className="emojiImg"
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <Modal
          isOpen={isModalOpen}
          onRequestClose={this.closeModal}
          className="modal-content popup-content"
          overlayClassName="modal-overlay"
        >
          <div className="closeContainer">
            <button
              data-testid="close"
              type="button"
              onClick={this.closeModal}
              className="closeButton"
              aria-label="close rules"
            >
              <CgClose />
            </button>
          </div>
          <h1 className="emoji-rules-heading-popup">Rules</h1>
          <ul className="emoji-rules-list-popup">
            {rulesText.map(rule => (
              <li key={rule} className="emoji-rule-item-popup">
                {rule}
              </li>
            ))}
          </ul>
        </Modal>
      </div>
    )
  }

  renderResultView = () => {
    const {score, gameStatus} = this.state
    const isWon = gameStatus === 'won'
    return (
      <div className="EmojiGameMainContainer">
        <div className="EmojiHomeBack">
          <Link to="/">
            <button type="button" className="BackButton">
              <BiArrowBack className="BackIcon white" />
              Back
            </button>
          </Link>
        </div>
        <div className="rContainer">
          <div className="ResultContainer">
            <div className="result">
              {isWon ? (
                <>
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/won-game-img.png"
                    alt="won"
                    className="resultImg"
                  />
                  <h1 className="resultHeading">You Won</h1>
                  <p className="resultPara">Best Score</p>
                  <p className="resultPara1">12/12</p>
                </>
              ) : (
                <>
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/lose-game-img.png"
                    alt="lose"
                    className="resultImg"
                  />
                  <h1 className="resultHeading">You Lose</h1>
                  <p className="resultPara">Score</p>
                  <p className="resultPara1">{score}/12</p>
                </>
              )}
              <button
                type="button"
                onClick={this.startPlaying}
                className="playAgainButton"
              >
                Play Again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const {view} = this.state
    switch (view) {
      case 'rules':
        return this.renderRulesView()
      case 'playing':
        return this.renderPlayingView()
      case 'result':
        return this.renderResultView()
      default:
        return null
    }
  }
}

export default EmojiGame
