import StarRatings from "react-star-ratings";

export default function UserReview({ rating }) {
    return (
        <div className="py-2">
            <div className="flex bg-white shadow-md rounded">
                <div className="flex-shrink-0 p-2">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center select-none">
                        <span className="font-semibold text-gray-500">{rating.userFullName.slice(0, 1)}</span>
                    </div>
                </div>
                <div className="flex-1 p-2">
                    <div className="font-semibold leading-5">{rating.userFullName}</div>
                    <div className="leading-[15px]">
                        <StarRatings
                            rating={rating.rating}
                            starDimension="15px"
                            starSpacing="1.2px"
                            starRatedColor="rgb(255,208,85)"
                            starHoverColor="rgb(255,208,85)"
                            starEmptyColor="rgb(209,209,209)"
                        />
                    </div>
                    <div className="text-sm my-2 whitespace-pre-line">{rating.content}</div>
                </div>
            </div>
        </div>
    )
}