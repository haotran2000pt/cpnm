import { AiFillStar } from "react-icons/ai";
import StarRatings from "react-star-ratings";

export default function UserReview({ rating }) {
    return (
        <div className="mb-2 flex">
            <div className="flex-shrink-0 p-2">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center select-none">
                    <span className="font-semibold text-gray-500">{rating.userFullName.slice(0, 1)}</span>
                </div>
            </div>
            <div className="flex-1 p-2">
                <div className="font-semibold">{rating.userFullName}</div>
                <div className="text-sm mb-1">{rating.content}</div>
                <div className="flex space-x-0.5 align-middle text-yellow-400">
                    <StarRatings
                        rating={rating.rating}
                        starDimension="15px"
                        starSpacing="2px"
                        starRatedColor="rgb(255,208,85)"
                        starHoverColor="rgb(255,208,85)"
                        starEmptyColor="rgb(209,209,209)"
                    />
                </div>
            </div>
        </div>
    )
}