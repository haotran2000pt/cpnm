import classNames from "classnames"
import { useFormContext } from "react-hook-form"
import Input, { Error, Label } from "../common/Input"
import Container from "./Container"

const SalesInfo = () => {
    const { register, formState: { errors } } = useFormContext()

    return (
        <Container name="Thông tin bán hàng">
            <div className="space-y-4">
                <div className="flex items-center space-x-8 w-full">
                    <Label className="w-24 block text-right">Giá:</Label>
                    <div className="w-96">
                        <input
                            defaultValue="1000"
                            {...register('price')}
                            type="number"
                            className={classNames("admin-input w-full hide-number-type-arrow", {
                                'border-red-400': errors?.price
                            })}
                        />
                        {errors.price && (
                            <div className="mb-2">
                                <Error className="absolute">
                                    {errors.price.type === "typeError" && "Vui lòng nhập giá sản phẩm"}
                                    {errors.price.type === "min" && "Giá phải lớn hơn 1,000đ"}
                                    {errors.price.type === "other" && errors.price.message}
                                </Error>
                            </div>)}
                    </div>
                </div>
                <div className="flex items-center space-x-8 w-full">
                    <Label className="w-24 block text-right">Kho hàng:</Label>
                    <div className="w-96">
                        <input
                            defaultValue={0}
                            type="number"
                            {...register('quantity')}
                            className={classNames("admin-input w-full hide-number-type-arrow", {
                                'border-red-400': errors?.quantity
                            })}
                        />
                        {errors.quantity && (
                            <div className="mb-2">
                                <Error className="absolute">
                                    {errors.quantity.type === "typeError" && "Vui lòng nhập số lượng kho hàng"}
                                    {errors.quantity.type === "min" && "Số lượng phải lớn hơn 0"}
                                </Error>
                            </div>)}
                    </div>
                </div>
                <div className="flex items-center space-x-8 w-full">
                    <Label className="w-24 block text-right">Khuyến mãi:</Label>
                    <div className="w-96">
                        <input
                            defaultValue={0}
                            type="number"
                            {...register('discount')}
                            step={1000}
                            className={classNames("admin-input w-full hide-number-type-arrow", {
                                'border-red-400': errors?.discount
                            })}
                        />
                        {errors.discount && (
                            <div className="mb-2">
                                <Error className="absolute">
                                    {errors.discount.type === "typeError" && "Vui lòng nhập khuyến mãi"}
                                    {errors.discount.type === "min" && "Khuyến mãi phải là số dương"}
                                </Error>
                            </div>)}
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default SalesInfo