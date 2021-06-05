import { AiOutlineCamera, AiOutlineTablet } from "react-icons/ai"
import { IoWatchOutline } from "react-icons/io5"
import { MdSmartphone } from "react-icons/md"
import { FiHeadphones } from "react-icons/fi"

export const categories = {
    'dien-thoai': {
        name: 'Điện thoại'
    },
    'may-tinh-bang': {
        name: 'Máy tính bảng'
    },
    'smartwatch': {
        name: 'Smartwatch'
    },
    'may-anh': {
        name: 'Máy ảnh'
    },
    'tai-nghe': {
        name: 'Tai nghe'
    }
}

export const categoryIcon = {
    'dien-thoai': MdSmartphone,
    'may-tinh-bang': AiOutlineTablet,
    'smartwatch': IoWatchOutline,
    'may-anh': AiOutlineCamera,
    'tai-nghe': FiHeadphones,
}