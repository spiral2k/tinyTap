import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

/* Utils */
import * as CanvasUtils from '@utils/canvas'

/* Hooks */
import usePrevProps from '@hooks/usePrevProps'

import './Canvas.scss'

const Canvas = React.forwardRef(({ width, height, onPiece, pieces, image }, canvasRef) => {
    const dragging = useRef(false)
    const paths = useRef([])
    const shapes = useRef([])
    const prevPieces = usePrevProps(pieces, [])

    const handleMouseMove = e => {
        // if not dragging
        if (!dragging.current) return

        const pos = CanvasUtils.getMousePos(e, canvasRef.current.getBoundingClientRect())
        // out of bounds
        if (!pos) return

        // we are not updating the UI so we dont need requestAnimationFrame here
        // just saving the position
        paths.current.push(pos)
    }

    const handleMouseDown = e => {
        dragging.current = true

        // if mouse up on out of bounds
        if (paths.current.length) {
            paths.current = []
        }

        const pos = CanvasUtils.getMousePos(e, canvasRef.current.getBoundingClientRect())
        // out of bounds
        if (!pos) return

        paths.current.push(pos)
    }

    const handleMouseUp = e => {
        dragging.current = false

        const pos = CanvasUtils.getMousePos(e, canvasRef.current.getBoundingClientRect())
        const ctx = canvasRef.current.getContext('2d')

        if (ctx.canvas.width === 0 || ctx.canvas.height === 0 || !pos || paths.current.length < 5) {
            paths.current = []
            return
        }

        // color the missing piece
        CanvasUtils.fillPath({ ctx, paths: paths.current, fillStyle: '#ababab' })

        // paint the missing piece
        const piece = CanvasUtils.cropPath({ width, height, paths: paths.current, image })

        // update the <Pieces /> component
        onPiece(piece)

        shapes.current.push({ id: piece.id, paths: paths.current })

        // reset paths
        paths.current = []
    }

    const loadImage = () => {
        const ctx = canvasRef.current.getContext('2d')

        ctx.canvas.width = width
        ctx.canvas.height = height

        ctx.clearRect(0, 0, width, height)
        ctx.drawImage(image, 0, 0)
    }

    // handle loading image
    useEffect(() => {
        if (canvasRef.current && image) loadImage()
    }, [image])

    // handle piece remove
    useEffect(() => {
        if (!canvasRef.current || pieces.length >= prevPieces.length) return

        // diff array to find the removed element
        const removedElement = shapes.current.filter(
            item1 => !pieces.some(item2 => item2.id === item1.id && item2.name === item1.name)
        )

        if (!removedElement[0]) return

        // update shapes array
        shapes.current = shapes.current.filter(shape => shape.id !== removedElement[0].id)

        // draw back the removed piece on the canvas
        const ctx = canvasRef.current.getContext('2d')
        CanvasUtils.redrawPiece({ ctx, paths: removedElement[0].paths, image })
    }, [pieces])

    return (
        <canvas
            ref={canvasRef}
            className="canvas"
            width={width}
            height={height}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        />
    )
})

Canvas.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    onPiece: PropTypes.func.isRequired,
    pieces: PropTypes.arrayOf(PropTypes.object).isRequired,
    image: PropTypes.shape({}).isRequired,
}

export default Canvas
