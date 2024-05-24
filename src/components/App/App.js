import React, { PureComponent } from 'react'
import { Input, ConfigProvider, Spin } from 'antd'

import FilmCard from '../film-card/film-card'
import ApiService from '../apiservice'
import Error from '../error'

import './app.css'

export default class App extends PureComponent {
  constructor() {
    super()
    this.state = {
      filmCards: [],
      isLoading: true,
      isError: false,
    }

    const api = new ApiService()

    api
      .getFilms()
      .then((result) => {
        console.log(result)
        const filmCards = result.map((item) => {
          const filmInfo = {
            title: item.title,
            overView: item.overview,
            posterPath: item.poster_path,
            releaseDate: item.release_date,
            voteAverage: item.vote_average,
          }
          return <FilmCard key={item.id} filmInfo={filmInfo} />
        })
        return filmCards
      })
      .then((filmCards) => this.setState({ filmCards, isLoading: false }))
      .catch(() => this.setState({ filmCards: null, isLoading: false, isError: true }))
  }

  render() {
    const { filmCards, isLoading, isError } = this.state

    const spin = isLoading ? <Spin className="spin" size="large" /> : null
    const errorMessage = isError ? <Error>Не удается загрузить фильмы! Видимо возникла ошибка</Error> : null
    const films = !(isLoading && isError) ? filmCards : null

    return (
      <ConfigProvider theme={{ token: { colorPrimary: '#1677ff' } }}>
        <section className="content">
          <Input className="input content__input" placeholder="Type to search" />
          {films}
          {spin}
          {errorMessage}
        </section>
      </ConfigProvider>
    )
  }
}
