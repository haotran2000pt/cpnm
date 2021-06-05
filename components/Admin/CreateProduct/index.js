import classNames from "classnames";
import LoadingIcon from "../../common/LoadingIcon";
import BasicInfo from "./BasicInfo";
import SalesInfo from "./SalesInfo";
import SpecificationInfo from "./SpecificationInfo";
import Scroll from 'react-scroll'

export default function CreateProduct({ product, onSubmit, form, control, loading, images, setImages }) {
    return (
        <form onSubmit={onSubmit} className="flex space-x-8">
            <div className="flex-1">
                <Scroll.Element name="basic">
                    <BasicInfo form={form} control={control} images={images} setImages={setImages} />
                </Scroll.Element>
                <Scroll.Element name="sales">
                    <SalesInfo form={form} />
                </Scroll.Element>
                <Scroll.Element name="spec">
                    <SpecificationInfo form={form} control={control} defaultValues={product?.specifications} />
                </Scroll.Element>
            </div>
            <div className="w-60 self-start sticky top-10">
                <ul className="font-semibold text-sm space-y-2">
                    <li>
                        <Scroll.Link
                            offset={-80}
                            className="cursor-pointer"
                            activeClass="text-blue-700" to="basic"
                            spy={true} smooth={true} duration={400}
                        >
                            Thông tin cơ bản
                        </Scroll.Link>
                    </li>
                    <li>
                        <Scroll.Link
                            offset={-80}
                            className="cursor-pointer"
                            activeClass="text-blue-700" to="sales"
                            spy={true} smooth={true} duration={400}
                        >
                            Thông tin bán hàng
                        </Scroll.Link>
                    </li>
                    <li>
                        <Scroll.Link
                            offset={-80}
                            className="cursor-pointer"
                            activeClass="text-blue-700" to="spec"
                            spy={true} smooth={true} duration={400}
                        >
                            Thông số kỹ thuật
                        </Scroll.Link>
                    </li>
                </ul>
                <div>
                    <button disabled={loading}
                        className={classNames("py-3 px-5 mt-4 " +
                            "text-white transition-colors font-semibold rounded-lg text-sm shadow w-40", {
                            'bg-gray-400 cursor-not-allowed': loading,
                            'bg-blue-500 hover:bg-blue-700': !loading
                        })}>
                        {loading ? <LoadingIcon /> : product ? "Cập nhật" : "Đăng sản phẩm"}
                    </button>
                </div>
            </div>
        </form>
    )
}