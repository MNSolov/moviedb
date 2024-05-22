import React, { PureComponent } from 'react'
import { format } from 'date-fns'

import './film-card.css'

export default class FilmCard extends PureComponent {
  constructor() {
    super()

    this.textOverviewClamp = (
      textHeader,
      headerFontSize,
      lineHeightHeader,
      textOverview,
      overviewFontSize,
      lineHeightOverview,
      widthHeader,
      heightCard,
      widthOverview
    ) => {
      let result = ''
      if (textOverview) {
        const headerLength = textHeader.length * headerFontSize
        const countStringHeader = headerLength / widthHeader
        const headerHight = countStringHeader * lineHeightHeader
        const overviewHeight = heightCard - headerHight

        const wordsOverview = textOverview.split(/\s/g)
        const countStringOverview = overviewHeight / lineHeightOverview
        const overviewStringLength = widthOverview / overviewFontSize
        const lengthOverview = overviewStringLength * countStringOverview

        result += wordsOverview[0]
        let i = 1
        while (i < wordsOverview.length && result.length + wordsOverview[i].length < lengthOverview) {
          result += ` ${wordsOverview[i]}`
          i += 1
        }
        return i < wordsOverview.length ? `${result}...` : `${result}`
      }
      return result
    }
  }

  render() {
    const { filmInfo } = this.props

    const textOverviewClamp = this.textOverviewClamp(
      filmInfo.title,
      20,
      28,
      filmInfo.overView,
      12,
      22,
      450 * 0.45,
      280,
      450 * 0.5
    )

    let date = ''
    if (filmInfo.releaseDate) {
      date = format(new Date(filmInfo.releaseDate), 'MMMM dd, yyyy')
    }

    const rating = Number(filmInfo.voteAverage).toFixed(1)

    return (
      <div className="film-card">
        <img className="film-card__image" src={`https://image.tmdb.org/t/p/w500${filmInfo.posterPath}`} alt="Poster" />
        <div className="film-card__header">
          <h5 className="film-card__title">{filmInfo.title}</h5>
          <p className="film-card__release">{date}</p>
        </div>
        <p className="film-card__overview">{textOverviewClamp}</p>
        <p className="film-card__rating">{rating}</p>
      </div>
    )
  }
}
