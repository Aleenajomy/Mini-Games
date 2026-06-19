import {Component} from 'react'
import {Link} from 'react-router-dom'
import './index.css'

const gamesData = [
  {
    id: 'emoji-game',
    title: 'Emoji Game',
    route: '/emoji-game',
    imageUrl:
      'https://res.cloudinary.com/dxdlkv7xq/image/upload/v1762185331/Group_7471_dw7mtc.png',
    alt: 'emoji game',
  },
  {
    id: 'memory-matrix',
    title: 'Memory Matrix',
    route: '/memory-matrix',
    imageUrl:
      'https://res.cloudinary.com/dxdlkv7xq/image/upload/v1762182616/memory_hkekcu.png',
    alt: 'memory matrix',
  },
  {
    id: 'rock-paper-scissor',
    title: 'Rock Paper Scissor',
    route: '/rock-paper-scissor',
    imageUrl:
      'https://res.cloudinary.com/dxdlkv7xq/image/upload/v1762182615/Group_7469_h13yau.png',
    alt: 'rock paper scissor',
  },
  {
    id: 'card-flip-memory-game',
    title: 'Card-Flip Memory Game',
    route: '/card-flip-memory-game',
    imageUrl:
      'https://res.cloudinary.com/dxdlkv7xq/image/upload/v1762182615/animals_jqjllq.png',
    alt: 'card flip memory game',
  },
]

class Home extends Component {
  render() {
    return (
      <div className="HomePageMainContainer">
        <h1 className="HomeHeading">Games</h1>
        <ul className="HomePageGamesUnorderedList">
          {gamesData.map(g => (
            <li key={g.id} className="HomePageListItem">
              <Link to={g.route} className="HomePageLinkElement">
                <img
                  src={g.imageUrl}
                  alt={g.alt}
                  className={`HomePageGameImages ${
                    g.id === 'card-flip-memory-game' ? 'LastGame' : ''
                  }`}
                />
                <p className="GameName">{g.title}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export default Home
