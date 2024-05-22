import React, { PureComponent } from 'react'
import { Input, ConfigProvider } from 'antd'

import FilmCard from '../film-card/film-card'
import ApiService from '../apiservice'

import './app.css'

export default class App extends PureComponent {
  constructor() {
    super()
    this.state = {
      filmCards: [],
    }

    const api = new ApiService()

    api.getFilms().then((result) => {
      // const { arrayFilms } = this.state
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
      this.setState({ filmCards })
    })
  }

  render() {
    const { filmCards } = this.state

    return (
      <ConfigProvider theme={{ token: { colorPrimary: '#1677ff' } }}>
        <section className="content">
          <Input className="input content__input" placeholder="Type to search" />
          {filmCards}
        </section>
      </ConfigProvider>
    )
  }
}
