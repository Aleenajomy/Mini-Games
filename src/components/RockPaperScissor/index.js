import {Component} from 'react'
import {Link} from 'react-router-dom'
import Modal from 'react-modal'
import {CgClose} from 'react-icons/cg'
import {BiArrowBack} from 'react-icons/bi'
import './rps.css'

if (document.getElementById('root')) {
  Modal.setAppElement('#root')
}

const choices = [
  {
    id: 'rock',
    name: 'Rock',
    image:
      'https://assets.ccbp.in/frontend/react-js/rock-paper-scissor/rock-image.png',
  },
  {
    id: 'paper',
    name: 'Paper',
    image:
      'https://assets.ccbp.in/frontend/react-js/rock-paper-scissor/paper-image.png',
  },
  {
    id: 'scissor',
    name: 'Scissor',
    image:
      'https://assets.ccbp.in/frontend/react-js/rock-paper-scissor/scissor-image.png',
  },
]

const rulesText = [
  'The game result should be based on user and user opponent choices',
  'When the user choice is rock and his opponent choice is rock then the result will be IT IS DRAW',
  'When the user choice is paper and his opponent choice is rock then the result will be YOU WON',
  'When the user choice is scissors and his opponent choice is rock then the result will be YOU LOSE',
  'When the user choice is paper and his opponent choice is paper then the result will be IT IS DRAW',
  'When the user choice is scissors and his opponent choice is paper then the result will be YOU WON',
  'When the user choice is rock and his opponent choice is paper then the result will be YOU LOSE',
  'When the user choice is scissors and his opponent choice is scissors then the result will be IT IS DRAW',
  'When the user choice is rock and his opponent choice is scissors then the result will be YOU WON',
  'When the user choice is paper and his opponent choice is scissors then the result will be YOU LOSE',
  'When the result is YOU WON, then the count of the score should be incremented by 1',
  'When the result is IT IS DRAW, then the count of the score should be the same',
  'When the result is YOU LOSE, then the count of the score should be decremented by 1',
]

class RockPaperScissor extends Component {
  state = {
    view: 'rules',
    score: 0,
    userChoice: null,
    opponentChoice: null,
    result: null,
    isModalOpen: false,
    isPlayAgain: false,
  }

  getChoicesList = () => {
    const {choicesList} = this.props
    if (choicesList) return choicesList
    return [
      {
        id: 'ROCK',
        name: 'Rock',
        image:
          'https://assets.ccbp.in/frontend/react-js/rock-paper-scissor/rock-image.png',
        imageUrl:
          'https://assets.ccbp.in/frontend/react-js/rock-paper-scissor/rock-image.png',
      },
      {
        id: 'SCISSORS',
        name: 'Scissor',
        image:
          'https://assets.ccbp.in/frontend/react-js/rock-paper-scissor/scissor-image.png',
        imageUrl:
          'https://assets.ccbp.in/frontend/react-js/rock-paper-scissor/scissor-image.png',
      },
      {
        id: 'PAPER',
        name: 'Paper',
        image:
          'https://assets.ccbp.in/frontend/react-js/rock-paper-scissor/paper-image.png',
        imageUrl:
          'https://assets.ccbp.in/frontend/react-js/rock-paper-scissor/paper-image.png',
      },
    ]
  }

  getResult = (user, opponent) => {
    const u = user.toUpperCase()
    const o = opponent.toUpperCase()
    if (u === o) return 'draw'
    if (
      (u === 'ROCK' && o === 'SCISSORS') ||
      (u === 'PAPER' && o === 'ROCK') ||
      (u === 'SCISSORS' && o === 'PAPER')
    ) {
      return 'won'
    }
    return 'lost'
  }

  startPlaying = () => {
    window.scrollTo(0, 0)
    this.setState({view: 'playing', score: 0, isPlayAgain: false})
  }

  handleChoice = userChoice => {
    const list = this.getChoicesList()
    const opponentChoice = list[Math.floor(Math.random() * 3)]
    const result = this.getResult(userChoice.id, opponentChoice.id)

    let scoreChange = 0
    if (result === 'won') scoreChange = 1
    if (result === 'lost') scoreChange = -1

    this.setState(prevState => ({
      view: 'result',
      userChoice,
      opponentChoice,
      result,
      score: prevState.score + scoreChange,
    }))
  }

  playAgain = () => {
    this.setState({
      view: 'playing',
      userChoice: null,
      opponentChoice: null,
      result: null,
      isPlayAgain: true,
    })
  }

  openModal = () => this.setState({isModalOpen: true})

  closeModal = () => this.setState({isModalOpen: false})

  getResultText = () => {
    const {result} = this.state
    switch (result) {
      case 'won':
        return 'YOU WON'
      case 'lost':
        return 'YOU LOSE'
      case 'draw':
        return 'IT IS DRAW'
      default:
        return 'IT IS DRAW'
    }
  }

  getResultEmojis = () => {
    const {result} = this.state
    switch (result) {
      case 'won':
        return {
          emoji:
            'https://assets.ccbp.in/frontend/react-js/rock-paper-scissor/won-emoji-img.png',
          emojiAlt: 'won emoji',
          face:
            'https://assets.ccbp.in/frontend/react-js/rock-paper-scissor/smiling-face-with-star-eyes-emoji.png',
          faceAlt: 'Smiling face with star eyes',
        }
      case 'lost':
        return {
          emoji:
            'https://assets.ccbp.in/frontend/react-js/rock-paper-scissor/lose-emoji-img.png',
          emojiAlt: 'lose emoji',
          face:
            'https://assets.ccbp.in/frontend/react-js/rock-paper-scissor/frowning-face-emoji.png',
          faceAlt: 'Frowning face',
        }
      case 'draw':
        return {
          emoji:
            'https://assets.ccbp.in/frontend/react-js/rock-paper-scissor/draw-emoji-img.png',
          emojiAlt: 'draw emoji',
          face:
            'https://assets.ccbp.in/frontend/react-js/rock-paper-scissor/face-without-mouth-emoji.png',
          faceAlt: 'Face without mouth',
        }
      default:
        return {
          emoji:
            'https://assets.ccbp.in/frontend/react-js/rock-paper-scissor/draw-emoji-img.png',
          emojiAlt: 'draw emoji',
          face:
            'https://assets.ccbp.in/frontend/react-js/rock-paper-scissor/face-without-mouth-emoji.png',
          faceAlt: 'Face without mouth',
        }
    }
  }

  renderRulesView = () => (
    <div className="RPSRulesMainContainer">
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
              src="https://assets.ccbp.in/frontend/react-js/rock-paper-scissor/rock-paper-scissor-img.png"
              alt="rock paper scissor"
              className="InitialEmojiRulesImage"
            />
            <h1 className="white">Rock Paper Scissor</h1>
          </div>
          <div className="InitialRulesSecondContainer">
            <h1 className="InitialRulesHeading white">Rules</h1>
            <ul className="emojigameUnorderedList">
              {rulesText.map(rule => (
                <li key={rule} className="InitialrulesListItem white">
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
    const {score, isModalOpen, isPlayAgain} = this.state
    const list = this.getChoicesList()
    const rockChoice = list.find(c => c.id.toUpperCase() === 'ROCK')
    const paperChoice = list.find(c => c.id.toUpperCase() === 'PAPER')
    const scissorChoice = list.find(
      c => c.id.toUpperCase() === 'SCISSORS' || c.id.toUpperCase() === 'SCISSOR',
    )

    return (
      <div className="rpsMainContainer">
        <h1
          className="white"
          style={{
            position: 'absolute',
            left: '-9999px',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
          }}
        >
          Rock Paper Scissor
        </h1>
        <div className="EmojiHomeBack">
          <div className="EmojiBackIconContainer">
            <Link to="/">
              <button type="button" className="BackButton">
                <BiArrowBack className="BackIcon white" />
                Back
              </button>
            </Link>
          </div>
          <button
            type="button"
            onClick={this.openModal}
            className="trigger-button"
          >
            Rules
          </button>
        </div>

        <div className="rpsscoreContainer">
          <div className="rpsheading">
            <h1>Rock Paper Scissor</h1>
          </div>
          <div className="ScoreValueContainer">
            <p className="ScorePara">Score</p>
            <p className="Score">{score}</p>
          </div>
        </div>

        <h1
          className="PlayingViewHeading"
          style={{
            color: '#ffffff',
            fontFamily: 'Bree Serif',
            fontSize: '28px',
            margin: '20px 0',
          }}
        >
          {isPlayAgain ? 'Lets pick' : 'Let’s pick'}
        </h1>

        <div className="PlayingView">
          {rockChoice && (
            <button
              data-testid="rockButton"
              type="button"
              onClick={() => this.handleChoice(rockChoice)}
              className="EachItem"
            >
              <img
                src={rockChoice.imageUrl || rockChoice.image}
                alt="rock"
                className="ImageElement"
              />
            </button>
          )}
          {scissorChoice && (
            <button
              data-testid="scissorButton"
              type="button"
              onClick={() => this.handleChoice(scissorChoice)}
              className="EachItem"
            >
              <img
                src={scissorChoice.imageUrl || scissorChoice.image}
                alt="scissor"
                className="ImageElement"
              />
            </button>
          )}
          {paperChoice && (
            <button
              data-testid="paperButton"
              type="button"
              onClick={() => this.handleChoice(paperChoice)}
              className="EachItem"
            >
              <img
                src={paperChoice.imageUrl || paperChoice.image}
                alt="paper"
                className="ImageElement"
              />
            </button>
          )}
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
          <h1 className="rulesHeading">Rules</h1>
          <ul className="RpsUnorderedList" style={{margin: 0, padding: '15px'}}>
            {rulesText.map(rule => (
              <li
                key={rule}
                className="RPSRULESLIST"
                style={{listStyleType: 'disc'}}
              >
                {rule}
              </li>
            ))}
          </ul>
        </Modal>
      </div>
    )
  }

  renderResultView = () => {
    const {score, userChoice, opponentChoice} = this.state
    const resultEmojis = this.getResultEmojis()

    return (
      <div className="rpsMainContainer">
        <h1
          className="white"
          style={{
            position: 'absolute',
            left: '-9999px',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
          }}
        >
          Rock Paper Scissor
        </h1>
        <div className="EmojiHomeBack">
          <div className="EmojiBackIconContainer">
            <Link to="/">
              <button type="button" className="BackButton">
                <BiArrowBack className="BackIcon white" />
                Back
              </button>
            </Link>
          </div>
        </div>

        <div className="rpsscoreContainer">
          <div className="rpsheading">
            <h1>Rock Paper Scissor</h1>
          </div>
          <div className="ScoreValueContainer">
            <p className="ScorePara">Score</p>
            <p className="Score">{score}</p>
          </div>
        </div>

        <div className="ResultView">
          <div className="OneItem">
            <p className="Person">You</p>
            <img
              src={userChoice.imageUrl || userChoice.image}
              alt={
                userChoice.id.toLowerCase() === 'scissors'
                  ? 'scissor'
                  : userChoice.id.toLowerCase()
              }
              className="rpsResultEmoji"
            />
          </div>
          <div className="OneItem">
            <p className="Person">Opponent</p>
            <img
              src={opponentChoice.imageUrl || opponentChoice.image}
              alt={
                opponentChoice.id.toLowerCase() === 'scissors'
                  ? 'scissor'
                  : opponentChoice.id.toLowerCase()
              }
              className="rpsResultEmoji"
            />
          </div>
          <div className="RPSResultContainer">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '10px',
              }}
            >
              <img
                src={resultEmojis.emoji}
                alt={resultEmojis.emojiAlt}
                className="result-emoji"
                style={{width: '50px', height: '50px', margin: '5px'}}
              />
              <img
                src={resultEmojis.face}
                alt={resultEmojis.faceAlt}
                className="result-face"
                style={{width: '50px', height: '50px', margin: '5px'}}
              />
            </div>
            <p className="ResultPara">{this.getResultText()}</p>
            <button
              type="button"
              onClick={this.playAgain}
              className="RPSPlayAgainButton"
            >
              Play Again
            </button>
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

export default RockPaperScissor
