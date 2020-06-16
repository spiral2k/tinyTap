import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'

import './Piece.scss'

function Piece({ id, src, x, y, width, height, onPieceChange, onPieceRemove, canvasRef }) {
    const [tempPiecePos, setTempPiecePos] = useState({ x, y })
    const dragging = useRef(false)

    const setPiecePosition = e => {
        if (!dragging.current) return

        const rect = canvasRef.current.getBoundingClientRect()
        const { clientX, clientY } = e

        const pieceX = clientX - width / 2 - rect.left
        const pieceY = clientY - height / 2 - rect.top

        setTempPiecePos({
            x: pieceX,
            y: pieceY,
        })
    }

    const onMouseLeave = e => {
        if (!dragging.current) return

        // better UX on small piece
        setPiecePosition(e)
    }

    const onMouseUp = () => {
        dragging.current = false
        onPieceChange({ id, x: tempPiecePos.x || x, y: tempPiecePos.y || y })
        setTempPiecePos({ x: null, y: null })
    }

    const onMouseDown = () => {
        dragging.current = true
    }

    const handlePieceMove = e => {
        if (!dragging.current) return

        e.persist()

        window.requestAnimationFrame(() => setPiecePosition(e))
    }

    const handlePieceRemove = e => {
        e.stopPropagation()
        onPieceRemove(id)
    }

    return (
        <div
            className={`piece ${dragging.current ? 'dragging' : ''}`}
            style={{
                width,
                height,
                backgroundImage: `url(${src})`,
                left: tempPiecePos.x || x,
                top: tempPiecePos.y || y,
            }}
            onMouseMove={handlePieceMove}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
            alt=""
        >
            <span className="remove" onClick={handlePieceRemove} onMouseDown={e => e.stopPropagation()}>
                X
            </span>
        </div>
    )
}

Piece.propTypes = {
    id: PropTypes.string.isRequired,
    src: PropTypes.string.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    onPieceChange: PropTypes.func.isRequired,
    onPieceRemove: PropTypes.func.isRequired,
    canvasRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }).isRequired,
}

export default Piece
