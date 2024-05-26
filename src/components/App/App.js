import React, { PureComponent } from 'react'
import { Input, ConfigProvider, Spin, Pagination } from 'antd'

import FilmCard from '../film-card/film-card'
import ApiService from '../apiservice'
import Error from '../error'

import './app.css'

const debounce = require('lodash.debounce')

export default class App extends PureComponent {
  constructor() {
    super()
    this.state = {
      filmCards: [],
      isLoading: false,
      isError: false,
      // totalResults: 0,
      input: '',
    }

    this.sendRequest = (input, current = 1) => {
      this.setState({ isLoading: true })
      const api = new ApiService()
      api
        .getFilms(input, current)
        .then((responce) => {
          console.log(responce)
          if (responce.results.length === 0) {
            if (input === '') return null
            return <p className="not-found-films">Извините, фильмов с таким названием не найдено</p>
          }

          const filmCards = responce.results.map((item) => {
            const filmInfo = {
              title: item.title,
              overView: item.overview,
              posterPath: item.poster_path,
              releaseDate: item.release_date,
              voteAverage: item.vote_average,
            }
            return <FilmCard key={item.id} filmInfo={filmInfo} />
          })
          // this.setState({ totalResults: responce.total_results })
          return (
            <>
              {filmCards}
              <div className="pagination-wrapper">
                <Pagination
                  className="pagination"
                  current={current}
                  hideOnSinglePage="true"
                  total={responce.total_results}
                  defaultPageSize={20}
                  showSizeChanger={false}
                  onChange={(event) => this.paginationChange(event)}
                />
              </div>
            </>
          )
        })
        .then((filmCards) => this.setState({ filmCards, isLoading: false }))
        .catch(() => this.setState({ filmCards: null, isLoading: false, isError: true }))
      // }
    }

    this.debounceSend = debounce(this.sendRequest, 700)

    this.onInputChange = (event) => {
      this.setState({ input: event.target.value })
      this.debounceSend(event.target.value)
    }

    this.paginationChange = (event) => {
      const { input } = this.state
      this.sendRequest(input, event)
    }
  }

  render() {
    const { filmCards, isLoading, isError } = this.state

    const spin = isLoading ? <Spin className="spin" size="large" /> : null
    const errorMessage = isError ? <Error>Не удается загрузить фильмы! Видимо возникла ошибка</Error> : null
    const films = !(isLoading && isError) ? filmCards : null

    return (
      <ConfigProvider theme={{ token: { colorPrimary: '#1677ff' } }}>
        <section className="content">
          <Input
            className="input content__input"
            onChange={(event) => this.onInputChange(event)}
            placeholder="Type to search"
          />
          {films}
          {spin}
          {errorMessage}
        </section>
      </ConfigProvider>
    )
  }
}
