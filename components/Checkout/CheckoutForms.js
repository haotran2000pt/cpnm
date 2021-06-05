import classNames from "classnames"
import Input from "../common/Input"

const SectionContainer = ({ children }) => {
    return (
        <div className="bg-gray-100 py-3 px-4 mb-4">
            {children}
        </div>
    )
}

const SectionHeading = ({ children }) => {
    return (
        <h3 className="font-semibold text-lg mb-3">
            {children}
        </h3>
    )
}

export const GuestInformationForm = ({ register, errors }) => {
    return (
        <SectionContainer>
            <SectionHeading>
                Thông tin khách hàng
            </SectionHeading>
            <div className="flex space-x-5">
                <div className="flex-1">
                    <Input
                        {...register('phone')}
                        error={errors?.phone && "Không hợp lệ"}
                        label="Số điện thoại"
                        id="phone_number"
                        labelClasses="font-semibold text-sm"
                    />
                </div>
                <div className="flex-1">
                    <Input
                        {...register('name')}
                        error={errors?.name && "Không thể trống"}
                        label="Tên"
                        id="name"
                        labelClasses="font-semibold text-sm"
                    />
                </div>
                <div className="flex-1">
                    <Input
                        {...register('email')}
                        error={errors?.email}
                        label="E-mail (tùy chọn)"
                        id="email"
                        labelClasses="font-semibold text-sm"
                    />
                </div>
            </div>
        </SectionContainer>
    )
}

export const GuestAddressForm = ({ register, errors }) => {
    return (
        <SectionContainer>
            <SectionHeading>
                Địa chỉ nhận hàng
        </SectionHeading>
            <div className="flex space-x-5">
                <div className="flex-1">
                    <Input
                        {...register('city')}
                        error={errors?.city && "Không thể trống"}
                        label="Tỉnh/Thành phố"
                        id="city"
                        labelClasses="font-semibold text-sm"
                    />
                </div>
                <div className="flex-1">
                    <Input
                        {...register('district')}
                        error={errors?.district && "Không thể trống"}
                        label="Quận/Huyện"
                        id="district"
                        labelClasses="font-semibold text-sm"
                    />
                </div>
                <div className="flex-1">
                    <Input
                        {...register('ward')}
                        error={errors?.ward && "Không thể trống"}
                        label="Phường/Xã"
                        id="ward"
                        labelClasses="font-semibold text-sm"
                    />
                </div>
            </div>
            <div className="flex mt-3 mb-2 items-center space-x-2">
                <label htmlFor="street"
                    className="text-sm font-semibold">
                    Tên đường, số nhà
            </label>
                <div className="flex-1">
                    <div>
                        <input
                            {...register('street')}
                            id="street"
                            className={classNames('w-full p-2 text-sm border border-black', {
                                'border-red-400': errors.street
                            })}
                        />
                    </div>
                    {errors.street && <div className="absolute text-red-500 text-xs font-semibold">Không thể trống</div>}
                </div>
            </div>
        </SectionContainer>
    )
}

export const PaymentForm = () => {

}