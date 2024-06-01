import React, { PureComponent } from 'react'
import { Input, Spin, Pagination, Tabs } from 'antd'

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
      filmRateCards: [],
      isLoading: false,
      isError: false,
      // totalResults: 0,
      input: '',
      sessionId: '',
      pagination: 1,
      paginationRate: 1,
    }

    this.getSessionId = () => {
      const api = new ApiService()

      const guestSessionId = sessionStorage.getItem('tmdbGuestSessionId')

      if (!guestSessionId) {
        api.createGuestSession().then((response) => {
          sessionStorage.setItem('tmdbGuestSessionId', response.guest_session_id)
          this.setState({ sessionId: response.guest_session_id })
        })
      } else {
        this.setState({ sessionId: guestSessionId })
      }
    }

    this.sendRequest = (input, current = 1) => {
      this.setState({ isLoading: true })
      const { sessionId } = this.state
      this.setState({ filmCards: null })
      const api = new ApiService()
      api
        .getFilms(input, current)
        .then((responce) => {
          if (responce.results.length === 0) {
            if (input === '') return null
            return <p className="not-found-films">Извините, фильмов с таким названием не найдено</p>
          }
          console.log('Поисковый запрос')
          const filmCards = responce.results.map((item) => {
            const filmInfo = {
              id: item.id,
              title: item.title,
              overView: item.overview,
              posterPath: item.poster_path,
              releaseDate: item.release_date,
              voteAverage: item.vote_average,
              rating: sessionStorage.getItem(String(item.id)),
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
                  onChange={(event) => this.paginationChange(event)}
                />
              </div>
            </>
          )
        })
        .then((filmCards) => this.setState({ filmCards, isLoading: false }))
        .catch(() => this.setState({ filmCards: null, isLoading: false, isError: true }))
    }

    this.sendRateRequest = (current = 1) => {
      this.setState({ isLoading: true })
      const { sessionId } = this.state
      const api = new ApiService()
      api
        .getRateFilms(sessionId, current)
        .then((responce) => {
          const filmRateCards = responce.results.map((item) => {
            sessionStorage.setItem(String(item.id), String(item.rating))
            const filmInfo = {
              id: item.id,
              rating: item.rating,
              title: item.title,
              overView: item.overview,
              posterPath: item.poster_path,
              releaseDate: item.release_date,
              voteAverage: item.vote_average,
            }
            return <FilmCard key={item.id} filmInfo={filmInfo} sessionId={sessionId} />
          })
          return (
            <>
              {filmRateCards}
              <div className="pagination-wrapper">
                <Pagination
                  className="pagination"
                  current={current}
                  hideOnSinglePage="true"
                  total={responce.total_results}
                  defaultPageSize={20}
                  showSizeChanger={false}
                  onChange={(event) => this.paginationRateChange(event)}
                />
              </div>
            </>
          )
        })
        .then((filmRateCards) => this.setState({ filmRateCards, isLoading: false }))
        .catch(() => this.setState({ filmRateCards: null, isLoading: false }))
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
      this.sendRateRequest(event)
    }

    this.tabsOnChange = (event) => {
      if (event === '1') {
        const { input, pagination } = this.state
        this.sendRequest(input, pagination)
      }
      if (event === '2') {
        const { paginationRate } = this.state
        this.sendRateRequest(paginationRate)
      }
    }
  }

  componentDidMount() {
    this.getSessionId()
  }

  render() {
    const { filmCards, filmRateCards, isLoading, isError } = this.state

    const spin = isLoading ? <Spin className="spin" size="large" /> : null
    const errorMessage = isError ? <Error>Не удается загрузить фильмы! Видимо возникла ошибка</Error> : null
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
        <Tabs className="tabs" centered items={items} onChange={(event) => this.tabsOnChange(event)} />
      </section>
    )
  }
}
