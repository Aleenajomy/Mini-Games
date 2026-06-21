import React from 'react'
import {Link} from 'react-router-dom'
import Modal from 'react-modal'
import {CgClose} from 'react-icons/cg'
import {BiArrowBack} from 'react-icons/bi'
import {Line} from 'rc-progress'
import './memory.css'

const emojisArray = [
  'neutral face',
  'grimacing face',
  'slightly smiling face',
  'grinning face with big eyes',
  'grinning face with smiling eyes',
  'beaming face with smiling eyes',
  'grinning face',
  'smiling face with sunglasses',
]

const emojiImages = [
  'https://assets.ccbp.in/frontend/react-js/neutral-face-emoji.png',
  'https://assets.ccbp.in/frontend/react-js/grimacing-face-emoji.png',
  'https://assets.ccbp.in/frontend/react-js/slightly-smiling-face-emoji.png',
  'https://assets.ccbp.in/frontend/react-js/grinning-face-with-big-eyes-emoji.png',
  'https://assets.ccbp.in/frontend/react-js/grinning-face-with-smiling-eyes-emoji.png',
  'https://assets.ccbp.in/frontend/react-js/beaming-face-with-smiling-eyes-emoji.png',
  'https://assets.ccbp.in/frontend/react-js/grinning-face-emoji.png',
  'https://assets.ccbp.in/frontend/react-js/smiling-face-with-sunglasses-emoji.png',
]

const rulesText = [
  'In each level of the Game, Users should be able to see the Grid with (N X N) size starting from 3 and the grid will highlight N cells in Blue, the N highlighted cells will be picked randomly.',
  'The highlighted cells will remain N seconds for the user to memorize the cells. At this point, the user should not be able to perform any action.',
  'After N seconds, the grid will clear the N highlighted cells.',
  'At N seconds, the user can click on any cell. Clicking on a cell that was highlighted before it will turn blue. Clicking on the other cells that were not highlighted before then will turn to red.',
  'The user should be promoted to the next level if they guess all N cells correctly in one attempt.',
  'The user should be taken to the results page if the user clicks on the wrong cell.',
  'If the user completed all the levels, then the user should be taken to the results page.',
]

const MAX_LEVEL = 15

class MemoryMatrix extends React.Component {
  state = {
    view: 'rules',
    level: 1,
    gridSize: 3,
    highlightedCells: [],
    clickedCells: [],
    isShowingPattern: true,
    isModalOpen: false,
    isDisabled: true,
    reachedLevel: 0,
    maxLevel: localStorage.getItem('memoryMaxLevel')
      ? parseInt(localStorage.getItem('memoryMaxLevel'), 10)
      : 0,
  }

  componentWillUnmount() {
    this.clearTimeouts()
  }

  clearTimeouts = () => {
    if (this.showTimeout) clearTimeout(this.showTimeout)
    if (this.levelTimeout) clearTimeout(this.levelTimeout)
  }

  startPlaying = () => {
    window.scrollTo(0, 0)
    this.setState(
      {
        view: 'playing',
        level: 1,
        gridSize: 3,
        highlightedCells: [],
        clickedCells: [],
        isShowingPattern: true,
        isDisabled: true,
        reachedLevel: 0,
      },
      this.startLevel,
    )
  }

  startLevel = () => {
    this.clearTimeouts()
    const {level} = this.state
    const gridSize = level + 2
    const totalCells = gridSize * gridSize
    const highlightedCount = gridSize

    const highlightedCells = []
    while (highlightedCells.length < highlightedCount) {
      const randomIndex = Math.floor(Math.random() * totalCells)
      if (!highlightedCells.includes(randomIndex)) {
        highlightedCells.push(randomIndex)
      }
    }

    this.setState({
      gridSize,
      highlightedCells,
      clickedCells: [],
      isShowingPattern: true,
      isDisabled: true,
    })

    this.showTimeout = setTimeout(() => {
      this.setState({isShowingPattern: false, isDisabled: false})

      this.levelTimeout = setTimeout(() => {
        this.setState(prevState => {
          const {level: currentLevel, maxLevel} = prevState
          const completedLevels = currentLevel - 1
          let newMax = maxLevel
          if (completedLevels > newMax) {
            newMax = completedLevels
            localStorage.setItem('memoryMaxLevel', newMax)
          }
          return {
            view: 'result',
            reachedLevel: completedLevels,
            maxLevel: newMax,
          }
        })
      }, gridSize * 1000)
    }, 3000)
  }

  handleCellClick = index => {
    const {
      highlightedCells,
      clickedCells,
      level,
      maxLevel,
      isDisabled,
    } = this.state

    if (isDisabled || clickedCells.includes(index)) return

    if (!highlightedCells.includes(index)) {
      this.clearTimeouts()
      const completedLevels = level - 1
      let newMax = maxLevel
      if (completedLevels > newMax) {
        newMax = completedLevels
        localStorage.setItem('memoryMaxLevel', newMax)
      }
      this.setState({
        view: 'result',
        reachedLevel: completedLevels,
        maxLevel: newMax,
      })
      return
    }

    const newClickedCells = [...clickedCells, index]

    if (newClickedCells.length === highlightedCells.length) {
      this.clearTimeouts()
      if (level >= MAX_LEVEL) {
        let newMax = maxLevel
        if (MAX_LEVEL > newMax) {
          newMax = MAX_LEVEL
          localStorage.setItem('memoryMaxLevel', newMax)
        }
        this.setState({
          view: 'result',
          reachedLevel: MAX_LEVEL,
          maxLevel: newMax,
        })
      } else {
        this.setState({level: level + 1, clickedCells: []}, this.startLevel)
      }
    } else {
      this.setState({clickedCells: newClickedCells})
    }
  }

  openModal = () => this.setState({isModalOpen: true})

  closeModal = () => this.setState({isModalOpen: false})

  getEmojiIndex = level => {
    if (level === 0) return 0
    if (level <= 2) return 1
    if (level <= 4) return 2
    if (level <= 6) return 3
    if (level <= 8) return 4
    if (level <= 10) return 5
    if (level <= 12) return 6
    return 7
  }

  renderRulesView = () => (
    <div className="MMRulesMaincontainer">
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
              src="https://res.cloudinary.com/dxdlkv7xq/image/upload/v1762182616/memory_hkekcu.png"
              alt="memory matrix"
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
              Memory Matrix
            </h1>
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

  renderGrid = () => {
    const {
      gridSize,
      highlightedCells,
      isShowingPattern,
      clickedCells,
      isDisabled,
      level,
    } = this.state
    const totalCells = gridSize * gridSize
    const cells = []
    const levelIndex = Math.min(level, 10)

    for (let i = 0; i < totalCells; i += 1) {
      const isHighlightedCell = highlightedCells.includes(i)
      const isVisuallyHighlighted = isHighlightedCell && isShowingPattern
      const isClicked = clickedCells.includes(i)

      let cellClass = ''
      if (isVisuallyHighlighted || isClicked) {
        cellClass = 'Active'
      }

      cells.push(
        <li key={i} className={`MMListItemBox-level${levelIndex} ${cellClass}`}>
          <button
            type="button"
            data-testid={isHighlightedCell ? 'highlighted' : 'notHighlighted'}
            onClick={() => this.handleCellClick(i)}
            className="MMBoxButton"
            disabled={isDisabled}
            style={{
              width: '100%',
              height: '100%',
            }}
            aria-label={`cell ${i}`}
          />
        </li>,
      )
    }
    return cells
  }

  renderPlayingView = () => {
    const {level, maxLevel, isModalOpen} = this.state
    const levelIndex = Math.min(level, 10)
    return (
      <div className="MMGameMainContainer">
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
        <h1 className="MMGameHeading">Memory Matrix</h1>
        <div className="MMLevelContainer">
          <div className={`MMLevelMainContainer-level${levelIndex}`}>
            <p className="MMLevel">Level - {level}</p>
            <p className="MMMaxLevel">Max Level - {maxLevel}</p>
          </div>
        </div>
        <ul className={`MMUnorderedBox-level${levelIndex}`}>
          {this.renderGrid()}
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
    const {reachedLevel} = this.state
    const emojiIndex = this.getEmojiIndex(reachedLevel)
    const progressPercentage = Math.round((reachedLevel / MAX_LEVEL) * 100)

    return (
      <div className="MMGameResultContainer">
        <div className="EmojiHomeBack" style={{width: '100%'}}>
          <div className="rulesBackWidth">
            <Link to="/">
              <button type="button" className="BackButton">
                <BiArrowBack className="BackIcon white" />
                Back
              </button>
            </Link>
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: 1,
            width: '100%',
          }}
        >
          <ul className="MMGameResultUnorderedList">
            <li className="MMResultEmojisListItem">
              <img
                src={emojiImages[emojiIndex]}
                alt={emojisArray[emojiIndex]}
                className="MMemojis"
              />
            </li>
          </ul>
          <h1 className="MMResultCongratsHeading">Congratulations</h1>
          <h1 className="MMResultLevelHeading">
            You have reached level {reachedLevel}
          </h1>
          <p className="MMResultPara">Level {reachedLevel}</p>
          <div className="ProgressBar">
            <Line
              percent={progressPercentage}
              strokeWidth={1}
              strokeColor="#467aff"
              trailWidth={1}
              trailColor="#e2e8f0"
            />
            <p className="MMResultLevel">{progressPercentage}%</p>
          </div>
          <button
            type="button"
            onClick={this.startPlaying}
            className="MMResultButton"
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

export default MemoryMatrix
