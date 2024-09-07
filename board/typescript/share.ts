'use strict'

export const shareTwitter = (succdef: 'SUCCESS' | 'DEFEAT', score: number) => {
    // https://developer.x.com/en/docs/x-for-websites/tweet-button/overview
    const intentUrl = 'https://twitter.com/intent/tweet'
    const text = `${succdef}! I scored ${score} in King Thirteen!`
    const url = 'https://js13kgames.com/2024/games/king-thirteen'
    const hashtags = 'KingThirteen,js13k'
    const via = 'mvasilkov'

    const finalUrl = `${intentUrl}?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=${hashtags}&via=${via}`
    window.open(finalUrl, '_blank')
}
