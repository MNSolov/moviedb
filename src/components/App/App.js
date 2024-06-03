import React, { PureComponent } from 'react'
import { Input, Spin, Pagination, Tabs } from 'antd'

import FilmCard from '../film-card/film-card'
import ApiService from '../apiservice'
import Error from '../error'
import { Provider } from '../context'

import './app.css'

const debounce = require('lodash.debounce')

export default class App extends PureComponent {
  constructor() {
    super()
    this.state = {
      filmCards: [],
      filmRateCards: [],
      isLoading: false,
      isError: false,
      // totalResults: 0,
      input: '',
      sessionId: '',
      pagination: 1,
      paginationRate: 1,
      genre: 0,
    }

    this.getSessionId = () => {
      const api = new ApiService()

      const guestSessionId = sessionStorage.getItem('tmdbGuestSessionId')

      if (!guestSessionId) {
        api
          .createGuestSession()
          .then((response) => {
            sessionStorage.setItem('tmdbGuestSessionId', response.guest_session_id)
            this.setState({ sessionId: response.guest_session_id })
          })
          .catch(() => this.setState({ isError: true }))
      } else {
        this.setState({ sessionId: guestSessionId })
      }
    }

    this.getGenreObj = () => {
      const api = new ApiService()
      api
        .getGenre()
        .then((response) => {
          console.log(response)
          this.setState({ genre: response.genres })
        })
        .catch(() => this.setState({ isError: true }))
    }

    this.createFilmcard = (responce, current, sessionId, paginationChange) => {
      const filmCards = responce.results.map((item) => {
        let rating = 0
        if (item.rating) {
          sessionStorage.setItem(String(item.id), String(item.rating))
          rating = item.rating
        } else {
          rating = sessionStorage.getItem(String(item.id))
        }
        const filmInfo = {
          id: item.id,
          rating,
          title: item.title,
          overView: item.overview,
          posterPath: item.poster_path,
          releaseDate: item.release_date,
          voteAverage: item.vote_average,
          genreId: item.genre_ids,
        }
        return <FilmCard key={item.id} filmInfo={filmInfo} sessionId={sessionId} />
      })
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
              onChange={(event) => paginationChange(event)}
            />
          </div>
        </>
      )
    }

    this.sendRequest = (input, current = 1) => {
      this.setState({ filmCards: null, isLoading: true })
      const { sessionId } = this.state
      const api = new ApiService()
      api
        .getFilms(input, current)
        .then((responce) => {
          if (responce.results.length === 0) {
            if (input === '') return null
            return <p className="not-found-films">Извините, фильмов с таким названием не найдено</p>
          }
          console.log('Поисковый запрос')
          return this.createFilmcard(responce, current, sessionId, this.paginationChange)
        })
        .then((filmCards) => this.setState({ filmCards, isError: false }))
        .catch(() => this.setState({ filmCards: null, isError: true }))
        .finally(() => this.setState({ isLoading: false }))
    }

    this.sendRateRequest = (current = 1) => {
      this.setState({ filmRateCards: null, isLoading: true })
      const { sessionId, paginationRate } = this.state
      const api = new ApiService()
      api
        .getRateFilms(sessionId, current)
        .then((responce) => {
          let result = 0
          if (responce.total_pages < paginationRate) {
            result = this.createFilmcard(responce, 1, sessionId, this.paginationRateChange)
            this.setState({ paginationRate: 1, filmRateCards: result, isLoading: false })
          } else {
            api.getRateFilms(sessionId, paginationRate).then((responceRepeat) => {
              result = this.createFilmcard(responceRepeat, paginationRate, sessionId, this.paginationRateChange)
              this.setState({ filmRateCards: result, isError: false })
            })
          }
        })
        .catch(() => this.setState({ filmRateCards: null }))
        .finally(() => this.setState({ isLoading: false }))
    }

    this.sendPaginationRateRequest = (current) => {
      this.setState({ filmRateCards: null, isLoading: true })
      const { sessionId } = this.state
      const api = new ApiService()
      api
        .getRateFilms(sessionId, current)
        .then((responce) => {
          const result = this.createFilmcard(responce, current, sessionId, this.paginationRateChange)
          this.setState({ filmRateCards: result, isError: false })
        })
        .catch(() => this.setState({ filmRateCards: null }))
        .finally(() => this.setState({ isLoading: false }))
    }

    this.debounceSend = debounce(this.sendRequest, 700)

    this.onInputChange = (event) => {
      this.setState({ input: event.target.value, pagination: 1 })
      this.debounceSend(event.target.value)
    }

    this.paginationChange = (event) => {
      const { input } = this.state
      this.setState({ pagination: event })
      this.sendRequest(input, event)
    }

    this.paginationRateChange = (event) => {
      this.setState({ paginationRate: event })
      this.sendPaginationRateRequest(event)
    }

    this.tabsOnChange = (event) => {
      if (event === '1') {
        const { input, pagination } = this.state
        this.sendRequest(input, pagination)
      }
      if (event === '2') {
        this.sendRateRequest()
      }
    }
  }

  componentDidMount() {
    this.getSessionId()
    this.getGenreObj()
  }

  render() {
    const { filmCards, filmRateCards, isLoading, isError, genre } = this.state

    const spin = isLoading ? <Spin className="spin" size="large" /> : null
    const errorMessage = isError ? (
      <Error>Не удается получить информацию от сервера! Видимо возникла ошибка</Error>
    ) : null
    const films = !(isLoading && isError) ? filmCards : null
    const filmsRate = !(isLoading && isError) ? filmRateCards : null

    const items = [
      {
        key: '1',
        label: 'Search',
        children: (
          <section className="tabs__content">
            <Input
              className="input content__input"
              onChange={(event) => this.onInputChange(event)}
              placeholder="Type to search"
            />
            {films}
            {spin}
            {errorMessage}
          </section>
        ),
      },
      {
        key: '2',
        label: 'Rate',
        children: (
          <section className="tabs__content">
            {filmsRate}
            {spin}
            {errorMessage}
          </section>
        ),
      },
    ]

    return (
      <section className="content">
        <Provider value={genre}>
          <Tabs className="tabs" centered items={items} onChange={(event) => this.tabsOnChange(event)} />
        </Provider>
      </section>
    )
  }
}
