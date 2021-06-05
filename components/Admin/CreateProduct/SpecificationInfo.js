import { useFieldArray } from "react-hook-form"
import Container from "./Container"

const SpecificationInfo = ({ control, form, defaultValues }) => {
    const { register, watch } = form

    const { fields, append, remove } = useFieldArray({
        control,
        name: "specifications",
    })

    return (
        <Container name="Thông số kỹ thuật">
            <ul>
                {fields.length !== 0 && (
                    <div className="flex space-x-4 mb-2">
                        <div className="w-52">
                            Tên thông số
                        </div>
                        <div className="w-52">
                            Thông tin
                        </div>
                    </div>
                )}
                {fields.map((field, index) => (
                    <li key={field.id}
                        className="flex mb-3 space-x-4"
                    >
                        <div className="w-52">
                            <input
                                {...register(`specifications.${index}.name`)}
                                defaultValue={defaultValues ? defaultValues[index]?.name || '' : ''}
                                className="admin-input"
                            />
                        </div>
                        <div className="flex-auto">
                            <input
                                {...register(`specifications.${index}.info`)}
                                defaultValue={defaultValues ? defaultValues[index]?.info || '' : ''}
                                className="mr-2 admin-input"
                            />
                        </div>
                        <button type="button" onClick={() => remove(index)}>Xóa</button>
                    </li>
                ))}
            </ul>
            <button type="button"
                className="font-semibold"
                onClick={() => append({ name: "", info: "" })}
            >
                + Thêm mới
            </button>
        </Container>
    )
}

export default SpecificationInfo