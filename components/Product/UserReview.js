import { AiFillStar } from "react-icons/ai";

export default function UserReview({ }) {
    return (
        <div className="mb-2 flex">
            <div className="flex-shrink-0 p-2">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center select-none">
                    <span className="font-semibold text-gray-500">V</span>
                </div>
            </div>
            <div className="flex-1 p-2">
                <div className="font-semibold">Phạm Nhật Vượng</div>
                <div className="text-sm mb-1">{'Lần đầu bước chân vào THEGIOIDIDONG, mà được nhân viên phục vụ tận răng như này ạ, làm việc hoạt bát các thứ rất là nhanh ạ, em chân thành cảm ơn THEGIOIDIDONG nhiều ạ <3, lần đầu mua máy ở đây mà em ưng ý nhất luôn đấy <3'}</div>
                <div className="flex space-x-0.5 align-middle text-yellow-400">
                    <AiFillStar />
                    <AiFillStar />
                    <AiFillStar />
                    <AiFillStar />
                    <AiFillStar className="text-gray-200" />
                </div>
            </div>
        </div>
    )
}