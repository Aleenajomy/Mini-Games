import React from 'react'
import {Link} from 'react-router-dom'
import Modal from 'react-modal'
import {CgClose} from 'react-icons/cg'
import {BiArrowBack} from 'react-icons/bi'
import cardsData from '../../data/cardsData'
import './cardflip.css'

if (document.getElementById('root')) {
  Modal.setAppElement('#root')
}

const rulesText = [
  'When the game is started, the users should be able to see the list of Cards that are shuffled and turned face down.',
  'When a user starts the game, the user should be able to see the Timer running.',
  'The Timer starts from 2 Minutes.',
  'If the two cards have the same image, they remain face up. If not, they should be flipped face down again after a short 2 seconds.',
  'Users should be able to compare only two cards at a time.',
  'When the user is not able to find all the cards before the timer ends then the game should end and redirect to the Time Up Page.',
  'If the user finds all the matching cards before the timer ends, then the user should be redirected to the results page.',
]

class CardFlipMemoryGame extends React.Component {
  state = {
    view: 'rules',
    cards: [],
    flippedCards: [],
    matchedCards: [],
    flipCount: 0,
    score: 0,
    timer: 120,
    isModalOpen: false,
    isProcessing: false,
    lowestFlipCount: localStorage.getItem('lowestFlipCount')
      ? parseInt(localStorage.getItem('lowestFlipCount'), 10)
      : 0,
  }

  componentWillUnmount() {
    if (this.timerInterval) clearInterval(this.timerInterval)
  }

  startPlaying = () => {
    if (this.timerInterval) clearInterval(this.timerInterval)
    window.scrollTo(0, 0)

    const cardsList = cardsData.flatMap((card, idx) => [
      {id: `${card.name}-${idx}-1`, name: card.name, image: card.image},
      {id: `${card.name}-${idx}-2`, name: card.name, image: card.image},
    ])

    const shuffledCards = cardsList.sort(() => Math.random() - 0.5)
    this.setState(
      {
        view: 'playing',
        cards: shuffledCards,
        flippedCards: [],
        matchedCards: [],
        flipCount: 0,
        score: 0,
        timer: 120,
        isProcessing: false,
      },
      this.startTimer,
    )
  }

  startTimer = () => {
    this.timerInterval = setInterval(() => {
      this.setState(prevState => {
        if (prevState.timer <= 1) {
          clearInterval(this.timerInterval)
          return {timer: 0, view: 'result'}
        }
        return {timer: prevState.timer - 1}
      })
    }, 1000)
  }

  formatTime = seconds => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    const mm = minutes.toString().padStart(2, '0')
    const ss = remainingSeconds.toString().padStart(2, '0')
    return `${mm}:${ss}`
  }

  handleCardClick = cardId => {
    const {
      flippedCards,
      matchedCards,
      isProcessing,
      cards,
      lowestFlipCount,
      flipCount,
      score,
    } = this.state

    if (
      isProcessing ||
      flippedCards.includes(cardId) ||
      matchedCards.includes(cardId)
    ) {
      return
    }

    const newFlippedCards = [...flippedCards, cardId]

    if (newFlippedCards.length === 1) {
      this.setState({flippedCards: newFlippedCards})
    } else if (newFlippedCards.length === 2) {
      const newFlipCount = flipCount + 1

      this.setState({
        flippedCards: newFlippedCards,
        flipCount: newFlipCount,
        isProcessing: true,
      })

      const card1 = cards.find(card => card.id === newFlippedCards[0])
      const card2 = cards.find(card => card.id === newFlippedCards[1])

      if (card1.name === card2.name) {
        const newMatchedCards = [...matchedCards, ...newFlippedCards]
        const newScore = score + 1

        this.setState({
          matchedCards: newMatchedCards,
          flippedCards: [],
          score: newScore,
          isProcessing: false,
        })

        if (newMatchedCards.length === cards.length) {
          clearInterval(this.timerInterval)
          let newLowest = lowestFlipCount
          if (newFlipCount < lowestFlipCount || lowestFlipCount === 0) {
            newLowest = newFlipCount
            localStorage.setItem('lowestFlipCount', newLowest)
          }
          this.setState({
            view: 'result',
            lowestFlipCount: newLowest,
            flipCount: newFlipCount,
          })
        }
      } else {
        setTimeout(() => {
          this.setState({flippedCards: [], isProcessing: false})
        }, 2000)
      }
    }
  }

  openModal = () => this.setState({isModalOpen: true})

  closeModal = () => this.setState({isModalOpen: false})

  isGameWon = () => {
    const {matchedCards, cards} = this.state
    return matchedCards.length === cards.length
  }

  renderRulesView = () => (
    <div className="CardFlipRulesMaincontainer">
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
      <div className="RPSRulesTopContainer">
        <img
          src="https://res.cloudinary.com/dktgcdgar/image/upload/v1713681999/animals_m6eudc.png"
          alt="card flip memory game"
          className="CardFlipRulesImage"
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
          Card-Flip Memory Game
        </h1>
      </div>
      <h1 className="RPSRulesName white">Rules</h1>
      <ul className="RpsUnorderedList">
        {rulesText.map(rule => (
          <li key={rule} className="CardFlipListItem">
            {rule}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={this.startPlaying}
        className="CardFlipPlayButton"
      >
        Start playing
      </button>
    </div>
  )

  renderPlayingView = () => {
    const {
      cards,
      flippedCards,
      matchedCards,
      flipCount,
      score,
      timer,
      isModalOpen,
      lowestFlipCount,
    } = this.state

    return (
      <div className="CardFlipMainContainer">
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

        <h1 className="CardFlipGameHeading">Card-Flip Memory Game</h1>
        <p className="CardFlipTimer" data-testid="timer">
          {this.formatTime(timer)}
        </p>

        <div className="CardFlipScoreContainer">
          <p className="CardFlipCount">Card flip count - {flipCount}</p>
          <p className="CardLowestFlip">
            Lowest Flip Count - {lowestFlipCount}
          </p>
          <p className="CardFlipScore">Score - {score}</p>
        </div>

        <ul className="CardFlipUnordered">
          {cards.map(card => {
            const isFlipped =
              flippedCards.includes(card.id) || matchedCards.includes(card.id)

            let cardClass = ''
            if (matchedCards.includes(card.id)) {
              cardClass = 'CorrectChoice'
            } else if (flippedCards.includes(card.id)) {
              if (flippedCards.length === 1) {
                cardClass = 'CorrectChoice'
              } else if (flippedCards.length === 2) {
                const card1 = cards.find(c => c.id === flippedCards[0])
                const card2 = cards.find(c => c.id === flippedCards[1])
                if (card1.name === card2.name) {
                  cardClass = 'CorrectChoice'
                } else {
                  cardClass = 'WrongChoice'
                }
              }
            }

            return (
              <li key={card.id} className={`CardsListItem ${cardClass}`}>
                <button
                  data-testid={card.name}
                  type="button"
                  onClick={() => this.handleCardClick(card.id)}
                  className="ButtonCardFlip"
                  style={{width: '100%', height: '100%'}}
                  aria-label={`card ${card.name}`}
                >
                  {isFlipped ? (
                    <img
                      src={card.image}
                      alt={card.name}
                      className="emojiImg"
                    />
                  ) : (
                    <img
                      src="https://res.cloudinary.com/dktgcdgar/image/upload/v1713775574/foot-print_1_v2i0ik.png"
                      alt="footprint"
                      className="FootPrintImg"
                    />
                  )}
                </button>
              </li>
            )
          })}
        </ul>

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
    const {flipCount} = this.state
    const won = this.isGameWon()

    return (
      <div className="CardFlipMainContainer">
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

        <div className="CardFlipResultContainer">
          {won ? (
            <>
              <img
                src="https://res.cloudinary.com/dktgcdgar/image/upload/v1713614304/grinning-face-with-big-eyes_1f603_ytzhjq.png"
                alt="grinning face with big eyes"
                className="CardFlipResultEmoji"
              />
              <h1 className="CardFlipResultCongrats">Congratulations</h1>
              <p className="CardFlipResultPara">No.of Flips - {flipCount}</p>
              <h1 className="CardFlipResultPara2">
                You matched all of the cards in record time
              </h1>
            </>
          ) : (
            <>
              <img
                src="https://res.cloudinary.com/dktgcdgar/image/upload/v1713612175/neutral-face_1f610_nfcmnd.png"
                alt="neutral face"
                className="CardFlipResultEmoji"
              />
              <h1 className="CardFlipResultCongrats">Better luck next time</h1>
              <p className="CardFlipResultPara">No.of Flips - {flipCount}</p>
              <h1 className="CardFlipResultPara2">
                You did not match all of the cards in record time
              </h1>
            </>
          )}
          <button
            type="button"
            onClick={this.startPlaying}
            className="CardFlipPlayAgainButton"
          >
            Play Again
          </button>
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

export default CardFlipMemoryGame
