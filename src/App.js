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
      <Route path="/emoji-game" component={EmojiGame} />
      <Route path="/rock-paper-scissor" component={RockPaperScissor} />
      <Route path="/memory-matrix" component={MemoryMatrix} />
      <Route path="/card-flip-memory-game" component={CardFlipMemoryGame} />
    </Switch>
  )
}

export default App
