'use strict'

export const shareTwitter = (succdef: 'SUCCESS' | 'DEFEAT', score: number) => {
    const year = new Date().getFullYear()
    const host = year > 2024 ? 'js13kgames.com' : 'dev.js13kgames.com'

    // https://developer.x.com/en/docs/x-for-websites/tweet-button/overview
    const intentUrl = 'https://twitter.com/intent/tweet'
    const text = `${succdef}! I scored ${score} in King Thirteen!`
    const url = `https://${host}/2024/games/king-thirteen`
    const hashtags = 'KingThirteen,js13k'
    const via = 'mvasilkov'

    const finalUrl = `${intentUrl}?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=${hashtags}&via=${via}`
    window.open(finalUrl, '_blank')
}
