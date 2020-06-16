const getShapeSize = ({ paths }) => {
    let top = 0
    let bottom = Infinity
    let right = 0
    let left = Infinity

    paths.forEach(c => {
        if (c.x > right) {
            right = c.x
        }

        if (c.x < left) {
            left = c.x
        }

        if (c.y < bottom) {
            bottom = c.y
        }

        if (c.y > top) {
            top = c.y
        }
    })

    const width = right - left
    const height = top - bottom

    return { width, height, left, right, top, bottom }
}

export const drawPath = ({ ctx, paths }) => {
    ctx.beginPath()
    ctx.moveTo(paths[0].x, paths[0].y)
    const { length } = paths
    for (let i = 1; i < length; i++) ctx.lineTo(paths[i].x, paths[i].y)
    ctx.closePath()
}

export const getMousePos = (e, rect) => {
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (x < 0 || y < 0) {
        return null
    }

    return {
        x,
        y,
    }
}

export const fillPath = ({ ctx, paths, fillStyle }) => {
    ctx.save()
    drawPath({ ctx, paths })
    if (fillStyle) ctx.fillStyle = fillStyle
    ctx.clip()
    ctx.fill()
    ctx.restore()
}

export const trimCanvas = ({ ctx, left, bottom, width, height }) => {
    const copy = document.createElement('canvas').getContext('2d')

    const trimmed = ctx.getImageData(left, bottom, width, height)

    copy.canvas.width = width
    copy.canvas.height = height

    copy.putImageData(trimmed, 0, 0)

    return copy.canvas
}

export const redrawPiece = ({ ctx, paths, image }) => {
    ctx.save()
    drawPath({ ctx, paths })
    ctx.clip()
    ctx.drawImage(image, 0, 0)
    ctx.restore()
}

export const cropPath = ({ width, height, paths, image }) => {
    const ctx = document.createElement('canvas').getContext('2d')

    ctx.canvas.width = width
    ctx.canvas.height = height

    fillPath({ ctx, paths })

    ctx.save()
    ctx.clip()

    // draw the image on the piece
    ctx.drawImage(image, 0, 0)

    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 5
    ctx.stroke()

    ctx.restore()

    const shapeSize = getShapeSize({ paths })

    const trimedCanvas = trimCanvas({ ctx, ...shapeSize })

    // piece position in <Pieces />
    const { x, y } = paths[0]

    return {
        id: `${x}${y}`,
        src: trimedCanvas.toDataURL(),
        x,
        y,
        width: shapeSize.width,
        height: shapeSize.height,
    }
}
