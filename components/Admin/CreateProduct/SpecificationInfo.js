import classNames from "classnames"
import { useState } from "react"
import { Controller, useFieldArray, useFormContext } from "react-hook-form"
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai"
import { BiTrash } from "react-icons/bi"
import TextareaAutosize from "react-textarea-autosize"
import Container from "./Container"

const SpecificationSectionRow = ({ field, index, remove }) => {
    const [open, setOpen] = useState(true)

    return (
        <div className="relative">
            <div className="flex mb-3 space-x-4 z-10 relative">
                <button type="button" className="font-semibold" onClick={() => setOpen(!open)}>
                    {open ? <AiOutlineMinus /> : <AiOutlinePlus />}
                </button>
                <div className="w-[500px]">
                    <Controller
                        name={`specifications.${index}.name`}
                        defaultValue={field.name}
                        render={({ field, formState: { errors } }) => (
                            <input
                                placeholder="Tên loại thông số, ví dụ: màn hình, camera sau,..."
                                {...field}
                                className={classNames("admin-input", {
                                    "border-red-500": errors?.specifications && errors.specifications[index]?.name
                                })}
                            />
                        )}
                    />
                </div>
                <button type="button" className="font-semibold" onClick={() => remove(index)}>
                    <BiTrash size={20} />
                </button>
            </div>
            {open &&
                <div className="absolute top-0 left-0 w-[14px] h-full z-0 flex justify-center pt-[19px] pb-[49px]">
                    <div className="h-full w-[1.5px] bg-admin-200 relative space-y-[50px]" />
                </div>
            }
            <div className={classNames("z-20", {
                "hidden": !open
            })}>
                <SpecificationRow index={index} parentRemove={remove} />
            </div>
        </div>
    )
}

const SpecificationRow = ({ index, parentRemove }) => {
    const { fields, append, remove } = useFieldArray({ name: `specifications[${index}].specs` })

    const onAppend = () => {
        append({ title: "", detail: "" })
    }

    const onRemove = (index) => {
        if (fields.length === 1) {
            parentRemove()
        } else {
            remove(index)
        }
    }

    return <div className="pl-16 relative">
        {fields.map((field, rowIndex) => (
            <div key={field.id}>
                <div className="h-[1.5px] w-16 bg-admin-200 absolute left-[7px] translate-y-[19px] z-0" />
                <div className="flex mb-3 space-x-4">
                    <Controller
                        name={`specifications[${index}].specs[${rowIndex}].title`}
                        defaultValue={field.title}
                        render={({ field, formState: { errors } }) => (
                            <input
                                placeholder="Tên thông số (Độ phân giải, hệ điều hành...)"
                                {...field}
                                className={classNames("admin-input max-w-[320px] z-10 h-[38px]", {
                                    "border-red-500": errors.specifications && errors.specifications[index]?.specs && errors.specifications[index].specs[rowIndex]?.title
                                })}
                            />
                        )}
                    />
                    <Controller
                        name={`specifications[${index}].specs[${rowIndex}].detail`}
                        defaultValue={field.name}
                        render={({ field, formState: { errors } }) => (
                            <TextareaAutosize
                                minRows={1}
                                maxRows={10}
                                placeholder="Nội dung thông số (Liquid Retina LCD, 1792 x 828 Pixels,...)"
                                {...field}
                                className={classNames("admin-input resize-none", {
                                    "border-red-500": errors.specifications && errors.specifications[index]?.specs && errors.specifications[index].specs[rowIndex]?.detail
                                })}
                            />
                        )}
                    />
                    <button type="button" className="font-semibold h-[38px]" onClick={() => onRemove(rowIndex)}><BiTrash size={20} /></button>
                </div>
            </div>
        ))}
        <div className="mb-3">
            <button type="button" className="font-semibold" onClick={onAppend}>+ Thêm thông số</button>
        </div>
    </div >
}

const SpecificationInfo = () => {
    const { formState: { errors } } = useFormContext()
    const { fields, append, remove } = useFieldArray({ name: "specifications" })

    return (
        <Container name="Thông số kỹ thuật">
            {errors?.specifications?.message &&
                <div className="mb-3 text-red-600">{errors.specifications.message}</div>
            }
            <button type="button"
                className="font-semibold mb-2"
                onClick={() => append({ name: "", specs: [{ title: "", detail: "" }] })}
            >
                + Thêm loại thông số
            </button>
            <ul>
                {fields.map((field, index) => (
                    <li key={field.id}>
                        <SpecificationSectionRow field={field} index={index} remove={() => remove(index)} />
                    </li>
                ))}
            </ul>
        </Container>
    )
}

export default SpecificationInfo