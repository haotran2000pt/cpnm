const Container = ({ children, name }) => {
    return (
        <div className="bg-white border border-admin-200 p-4 rounded-lg text-blue-800
        font-semibold text-sm mb-4">
            <h2 className="mb-4 text-gray-600 text-lg font-bold">{name}</h2>
            {children}
        </div>
    )
}

export default Container