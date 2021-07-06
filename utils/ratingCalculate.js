export default function ratingCalculate(ratingDetails) {
    let totalRating = 0
    let ratingCount = 0
    Object.keys(ratingDetails).forEach(key => {
        totalRating += parseInt(key) * ratingDetails[key]
        ratingCount += ratingDetails[key]
    })
    return [totalRating, ratingCount]
}