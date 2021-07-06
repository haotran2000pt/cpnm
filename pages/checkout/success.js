export async function getServerSideProps({ req }) {
    const headers = req.headers
    return {
        props: { headers, req }
    }
}

export default function SuccessPage({ headers, req }) {
    return (
        <div>
            <button onClick={() => console.log(headers)}>headers</button>
            <button onClick={() => console.log(req)}>req</button>
        </div>
    )
}