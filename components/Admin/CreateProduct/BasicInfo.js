import classNames from "classnames"
import { Editor } from '@tinymce/tinymce-react';
import { BiPlus } from "react-icons/bi"
import { categories } from "../../../constants/category"
import moveItem from "../../../utils/moveArrayItem"
import Input, { Error, Label } from "../common/Input"
import Container from "./Container"
import { useEffect, useRef, useState } from "react"
import { Controller, useFormContext } from "react-hook-form";

const ImageButton = ({ images, setImages }) => {
    const handleChange = (e) => {
        setImages([...images, ...e.target.files])
    }

    return (
        <div className="px-1">
            <label htmlFor="image"
                className="w-32 h-32 block border-2 border-admin-200 flex-center cursor-pointer">
                <BiPlus size={25} />
            </label>
            <input multiple onChange={handleChange} id="image" className="hidden" type="file"
                accept="image/png, image/gif, image/jpeg"
            />
        </div>
    )
}

const BasicInfo = ({ images, setImages }) => {
    const { register, formState: { errors }, watch } = useFormContext()
    const [editor, setEditor] = useState(null)
    const editorRef = useRef(null);

    const handleBringToFront = (position) => {
        if (position !== 0)
            setImages(moveItem(images, position, 0))
    }

    const handleToLeft = (position) => {
        if (position !== 0)
            setImages(moveItem(images, position, position - 1))
    }

    const handleToRight = (position) => {
        if (position !== images.length - 1)
            setImages(moveItem(images, position, position + 1))
    }

    const handleRemoveImage = (image) => {
        const newImageList = images.filter(item => item !== image)
        setImages(newImageList)
    }

    useEffect(() => {
        setEditor(watch('description') || "")
    }, [])

    return (
        <Container name="Thông tin cơ bản">
            <div className="mb-3 flex space-x-8">
                <div className="flex-1 space-y-2">
                    <Input htmlFor="name" label="Tên sản phẩm"
                        error={errors.name && "Vui lòng nhập tên sản phẩm"}
                        inputProps={register("name")}
                        placeholder="iPhone 12 256GB Blue, iPhone 11 Pro 128GB Black,..."
                    />
                </div>
                <div className="flex-1 space-y-2">
                    <Label>Danh mục sản phẩm</Label>
                    <div>
                        <select {...register("category")}
                            className="admin-input">
                            {Object.keys(categories).map(category => (
                                <option key={category} value={category}>
                                    {categories[category].name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <div className="mb-3 flex space-x-8">
                <div className="flex-1 flex-shrink-0 space-y-2">
                    <Input htmlFor="modelSeries" label="Dòng sản phẩm"
                        placeholder="iPhone 11, iPhone 11 Pro,..."
                        error={errors?.modelSeries?.message}
                        inputProps={register("modelSeries")}
                    />
                </div>
                <div className="flex-1 space-y-2">
                    <Input htmlFor="manufacturer" label="Hãng sản xuất"
                        placeholder="Apple, Samsung,..."
                        error={errors?.manufacturer?.message}
                        inputProps={register("manufacturer")}
                    />
                </div>
            </div>
            <div className="mb-3 space-y-2">
                <Label>Đường dẫn</Label>
                <div className="flex font-semibold">
                    <div className="py-2 text-gray-400">{window.location.origin}/san-pham/</div>
                    <div>
                        <input
                            {...register('slug')}
                            className={classNames('admin-input border w-96 text-gray-700 rounded-lg', {
                                'border-red-400': errors?.slug
                            })} />
                        {errors?.slug && (
                            <Error className="mt-1">
                                {errors.slug.type === 'required' && 'Đường dẫn không thể để trống'}
                                {errors.slug.type === 'min' && 'Đường dẫn phải ít nhất 5 ký tự'}
                            </Error>)}
                    </div>
                </div>
            </div>
            <div>
                <div className="space-y-2 mb-3">
                    <Label htmlFor="description">Mô tả</Label>
                    {editor !== null &&
                        <Controller
                            name="description"
                            render={({
                                field: { onChange },
                            }) => (
                                <Editor
                                    initialValue={editor}
                                    onChange={(e) => onChange(e.target.getContent())}
                                    apiKey="b9r8i99deo0udse2jp8msxye7gc5qfakqllxjzw0a1ccbqql"
                                    onInit={(evt, editor) => editorRef.current = editor}
                                    init={{
                                        height: 500,
                                        menubar: true,
                                        plugins: [
                                            'advlist autolink lists link image preview anchor',
                                            'visualblocks code fullscreen',
                                            'insertdatetime media table paste code help wordcount'
                                        ],
                                        toolbar: 'undo redo | formatselect | ' +
                                            'bold italic backcolor | link image | alignleft aligncenter ' +
                                            'alignright alignjustify | bullist numlist outdent indent | ' +
                                            'removeformat | help',
                                        content_style: 'body { font-family:"Quicksand", sans-serif; font-size:14px }'
                                    }}
                                />
                            )}
                        />
                    }
                    {/* <textarea
                        maxLength="2000"
                        {...register('description')}
                        id="description"
                        rows={6}
                        className={classNames('admin-input resize-none', {
                            'border-red-400': errors.description
                        })}
                    /> */}
                </div>
                <div className="flex justify-between">
                    <div>
                        {errors.description && <Error>Mô tả không được để trống và có ít nhất 50 kí tự.</Error>}
                    </div>
                </div>
            </div>
            <div>
                <Label>Hình ảnh sản phẩm</Label>
                <div className="flex flex-wrap mt-2 -mx-1">
                    <ImageButton images={images} setImages={setImages} />
                    {images.map((image, index) => {
                        let file = typeof image === 'string' ? image : URL.createObjectURL(image)
                        return (
                            <div key={image} className="px-1 mb-2">
                                <div
                                    className={classNames("w-32 h-32 block border-2 relative group select-none", {
                                        'border-blue-600': index === 0,
                                        'border-blue-300': index !== 0
                                    })}>
                                    <img className="h-full w-full object-contain" src={file} />
                                    <div className="absolute top-0 left-0 p-1 text-xs bg-white rounded-md">
                                        {index === 0 && "Ảnh bìa"}
                                    </div>
                                    <div className="absolute top-0 right-0 opacity-0
                                    group-hover:opacity-100 transition-opacity duration-75 bg-white">
                                        <button className="block" type="button" onClick={() => handleBringToFront(index)}>
                                            Làm ảnh bìa
                                        </button>
                                        <button className="block" type="button" onClick={() => handleToLeft(index)}>
                                            Sang trái
                                        </button>
                                        <button className="block" type="button" onClick={() => handleToRight(index)}>
                                            Sang phải
                                        </button>
                                        <button className="block" type="button" onClick={() => handleRemoveImage(image)}>
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </Container >
    )
}

export default BasicInfo