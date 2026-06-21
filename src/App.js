// eslint-disable-next-line
import React from 'react'
import {Switch, Route} from 'react-router-dom'
import Home from './components/Home'
import EmojiGame from './components/EmojiGame'
import RockPaperScissor from './components/RockPaperScissor'
import MemoryMatrix from './components/MemoryMatrix'
import CardFlipMemoryGame from './components/CardFlip'
import './App.css'

function App() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/emoji-game" component={EmojiGame} />
      <Route exact path="/rock-paper-scissor" component={RockPaperScissor} />
      <Route exact path="/memory-matrix" component={MemoryMatrix} />
      <Route exact path="/card-flip-memory-game" component={CardFlipMemoryGame} />
    </Switch>
  )
}

export default App
