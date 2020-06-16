import { useRef, useEffect } from 'react'

export default (value, initial = {}) => {
    const ref = useRef()
    useEffect(() => {
        ref.current = value
    }, [value])
    return ref.current || initial
}
