import Link from 'next/link';
import Drawer from 'rc-drawer';
import 'rc-drawer/assets/index.css'
import { AiOutlineClose } from 'react-icons/ai';
import { IoCloseOutline } from 'react-icons/io5';
import CheckoutEmpty from './CheckoutEmpty'

export default function CheckoutDrawer({ isOpen, onClose, width, placement }) {
    return (
        <Drawer
            open={isOpen}
            onClose={onClose}
            width={width}
            level={null}
            handler={false}
            placement={placement}
        >
            <div className="h-full flex flex-col">
                <div className="px-6 pt-6">
                    <button onClick={onClose}><IoCloseOutline size={25} /></button>
                </div>
                <h3 className="px-6 text-2xl font-semibold">Giỏ hàng</h3>
                <div className="px-6 flex-1 flex justify-center items-center">
                    <CheckoutEmpty />
                </div>
                <div></div>
                <div className="p-6">
                    <Link href='/checkout'>
                        <a className="block text-center w-full p-2 bg-black text-white border border-transparent
                        font-medium hover:border-black hover:bg-white hover:text-black transition-colors">
                            THANH TOÁN
                        </a>
                    </Link>
                </div>
            </div>
        </Drawer>
    )
}