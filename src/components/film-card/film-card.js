import React, { PureComponent } from 'react'
import { format } from 'date-fns'
import { Rate } from 'antd'

import ApiService from '../apiservice'
import { Consumer } from '../context'

import './film-card.css'

export default class FilmCard extends PureComponent {
  constructor(props) {
    super(props)

    const { filmInfo } = props

    this.state = { rating: filmInfo.rating }

    this.textHeaderClamp = (textHeader, headerFontSize, widthHeader, stringCount = 2) => {
      if (textHeader.length > 40) {
        const countSymbolString = widthHeader / headerFontSize
        const lengthHeader = countSymbolString * stringCount

        const wordsHeader = textHeader.split(/\s/g)

        let result = wordsHeader[0]
        let i = 1
        while (i < wordsHeader.length && result.length < lengthHeader) {
          result += ` ${wordsHeader[i]}`
          i += 1
        }
        return `${result}...`
      }
      return textHeader
    }

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

    this.onRateChange = (event, filmId) => {
      const { sessionId } = this.props
      this.setState({ rating: event })
      const api = new ApiService()
      if (event > 0) {
        api.addRatingMovie(sessionId, filmId, event)
        sessionStorage.setItem(String(filmId), String(event))
      } else {
        api.deleteRatingMovie(sessionId, filmId)
        sessionStorage.removeItem(String(filmId))
      }
    }

    this.firstUpperSymbol = (str) => str.slice(0, 1).toUpperCase() + str.slice(1)

    this.createGenreList = (genreArr, genreId) => {
      const result = genreId.map((itemId) => {
        const numberGenreArr = genreArr.findIndex((item) => {
          return item.id === itemId
        })
        return (
          <li className="film-card__genre-item" key={itemId}>
            {this.firstUpperSymbol(genreArr[numberGenreArr].name)}
          </li>
        )
      })
      return result
    }
  }

  render() {
    const { filmInfo } = this.props
    const { rating } = this.state

    const textHeaderClamp = this.textHeaderClamp(filmInfo.title, 20, 450 * 0.45)
    const textOverviewClamp = this.textOverviewClamp(
      textHeaderClamp,
      20,
      28,
      filmInfo.overView,
      12,
      22,
      450 * 0.45,
      200,
      450 * 0.5
    )

    let date = ''
    if (filmInfo.releaseDate) {
      date = format(new Date(filmInfo.releaseDate), 'MMMM dd, yyyy')
    }

    const voteRating = Number(filmInfo.voteAverage).toFixed(1)

    return (
      <div className="film-card">
        <img className="film-card__image" src={`https://image.tmdb.org/t/p/w500${filmInfo.posterPath}`} alt="Poster" />
        <div className="film-card__header">
          <h5 className="film-card__title">{textHeaderClamp}</h5>
          <p className="film-card__release">{date}</p>
        </div>
        <Consumer>
          {(genre) => <ul className="film-card__genre-list">{this.createGenreList(genre, filmInfo.genreId)}</ul>}
        </Consumer>
        <p className="film-card__overview">{textOverviewClamp}</p>
        <p className="film-card__rating">{voteRating}</p>
        <Rate
          className="film-card__stars"
          count={10}
          value={rating}
          onChange={(event) => this.onRateChange(event, filmInfo.id)}
        />
      </div>
    )
  }
}
