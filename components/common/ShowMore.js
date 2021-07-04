import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import Button from "./Button";

function ShowMore({ height, children, className }) {
    const [open, setOpen] = useState(false)
    const containerRef = useRef(null)

    useEffect(() => {
        if (containerRef) {
            const containerHeight = containerRef.current.clientHeight
            if (containerHeight < height) {
                setOpen(true)
            }
        }
    }, [containerRef])

    return (
        <div
            ref={containerRef}
            style={{ maxHeight: open ? "unset" : height }}
            className={classNames("relative", className, {
                "overflow-y-hidden": !open
            })}>
            {children}
            {!open &&
                <>
                    <div className="absolute !mb-0 bottom-[40px] h-[50px] from-transparent via-gray-100 to-gray-100 bg-gradient-to-b w-full flex-center">
                    </div>
                    <div className="absolute !mb-0 bottom-0 h-[40px] bg-gray-100 flex-center w-full">
                        <Button onClick={() => setOpen(true)} className="!w-[200px] !py-1">Xem thêm</Button>
                    </div>
                </>
            }
        </div>
    )
}

export default React.memo(ShowMore)