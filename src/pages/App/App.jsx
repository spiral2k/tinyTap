/* eslint-disable react/jsx-curly-brace-presence */
import React from 'react'

/* Components */
import Puzzle from '@components/Puzzle/Puzzle'

/* Image */
import spongebob from '@assets/spongebob.jpg'
import beatles from '@assets/beatles.jpg'
import beatles2 from '@assets/beatles2.jpg'

import './App.scss'

const App = () => {
    return (
        <div className="app-page">
            <div className="title">{`Please don't cut Lennon's head, spongebob is down there ↓ :) `}</div>

            <Puzzle imageSrc={beatles} />
            <Puzzle imageSrc={beatles2} />
            <Puzzle imageSrc={spongebob} />
        </div>
    )
}

export default App
