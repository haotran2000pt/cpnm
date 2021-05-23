import { useEffect } from "react"

const useOnClickOutside = (ref, handler) => {
    useEffect(() => {
        const event = e => {
            if (ref.current && !ref.current.contains(e.target)) {
                handler();
            }
        }
        document.addEventListener('click', event)
        return () => {
            document.addEventListener('click', event)
        }
    }, [ref, handler])
}

export default useOnClickOutside