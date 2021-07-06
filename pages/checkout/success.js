export async function getServerSideProps({ req }) {
    const headers = req.headers
    return {
        props: { headers }
    }
}

export default function SuccessPage({ headers }) {
    return (
        <div>
            <button onClick={() => console.log(headers)}>headers</button>
        </div>
    )
}