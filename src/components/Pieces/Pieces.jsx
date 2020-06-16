import React from 'react'
import PropTypes from 'prop-types'

/* Components */
import Piece from '@components/Piece/Piece'

import './Pieces.scss'

const Pieces = ({ pieces, onPieceChange, onPieceRemove, canvasRef }) => {
    return pieces.map(({ id, ...props }) => (
        <Piece key={id} id={id} onPieceChange={onPieceChange} onPieceRemove={onPieceRemove} canvasRef={canvasRef} {...props} />
    ))
}

Pieces.propTypes = {
    pieces: PropTypes.arrayOf(PropTypes.object).isRequired,
    onPieceChange: PropTypes.func.isRequired,
    onPieceRemove: PropTypes.func.isRequired,
}

export default Pieces
