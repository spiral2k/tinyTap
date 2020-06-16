/* eslint-disable prettier/prettier */
import React, { useState, useRef, useEffect, memo } from 'react'
import PropTypes from 'prop-types'

import Canvas from '@components/Canvas/Canvas'
import Pieces from '@components/Pieces/Pieces'

import './Puzzle.scss'

function Puzzle({ imageSrc }) {
    const [pieces, setPieces] = useState([])
    const canvasRef = useRef(null)
    const imageRef = useRef(new Image())
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

    useEffect(() => {
        imageRef.current.onload = e => {
            const { width, height } = e.target
            setDimensions({ width, height })
        }
        imageRef.current.src = imageSrc
    }, [])

    const onPiece = piece => {
        setPieces([piece, ...pieces])
    }

    const onPieceChange = newPiece => {
        const newArr = pieces.map(piece => (piece.id === newPiece.id ? { ...piece, ...newPiece } : piece))
        setPieces(newArr)
    }

    const onPieceRemove = id => {
        const newPieces = pieces.filter(piece => piece.id !== id)
        setPieces(newPieces)
    }

    const { width, height } = dimensions

    if (!width || !height) return null

    return (
        <div className="puzzle-container">
            <Canvas
                ref={canvasRef}
                width={width}
                height={height}
                onPiece={onPiece}
                pieces={pieces}
                image={imageRef.current}
            />
            <Pieces
                pieces={pieces}
                onPieceChange={onPieceChange}
                onPieceRemove={onPieceRemove}
                canvasRef={canvasRef}
            />
        </div>
    )
}

Puzzle.propTypes = {
    imageSrc: PropTypes.string.isRequired,
}

export default memo(Puzzle)
