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

    this.refOverview = React.createRef()

    this.borderColor = (rating) => {
      const borderStyle = { borderColor: 0 }
      if (rating >= 0 && rating <= 3) borderStyle.borderColor = '#E90000'
      if (rating > 3 && rating <= 5) borderStyle.borderColor = '#E97E00'
      if (rating > 5 && rating <= 7) borderStyle.borderColor = '#E9D100'
      if (rating > 7) borderStyle.borderColor = '#66E900'
      return borderStyle
    }

    this.textHeaderClamp = (textHeader, headerFontSize, widthHeader, stringCount = 2) => {
      if (textHeader.length > 30) {
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

    this.textOverviewClamp = (textOverview, overviewFontSize, lineHeightOverview, heightOverview, widthOverview) => {
      const result = []
      if (textOverview) {
        const wordsOverview = textOverview.split(/\s/g)
        const countStringOverview = Math.floor((heightOverview - 20) / (lineHeightOverview * 1.1))

        let i = 0
        let j = 0
        result[i] = wordsOverview[j]
        j += 1

        while (j < wordsOverview.length && i < countStringOverview) {
          const temp = result[i].length + wordsOverview[j].length
          if (temp * overviewFontSize * 0.7 < widthOverview) {
            result[i] += ` ${wordsOverview[j]}`
            j += 1
          } else {
            i += 1
            if (i < countStringOverview) {
              result[i] = wordsOverview[j]
              j += 1
            }
          }
        }
        return j < wordsOverview.length ? `${result.join(' ').trim()}...` : `${result.join(' ').trim()}`
      }
      return 'Описание фильма отсутствует'
    }

    this.onRateChange = (event, filmId) => {
      const { sessionId } = this.props

      this.setState({ rating: event })
      const api = new ApiService()
      if (event > 0) {
        api.addRatingMovie(sessionId, filmId, event)
        sessionStorage.setItem(String(filmId), event.toFixed(1))
      } else {
        api.deleteRatingMovie(sessionId, filmId)
        sessionStorage.removeItem(String(filmId))
      }
    }

    this.firstUpperSymbol = (str) => str.slice(0, 1).toUpperCase() + str.slice(1)

    this.createGenreList = (genreArr, genreId) => {
      if (!genreId || !genreArr) return null
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

    this.addOverview = () => {
      this.refOverview.current.textContent = this.textOverviewClamp(
        filmInfo.overView,
        12,
        22,
        this.refOverview.current.getBoundingClientRect().height,
        this.refOverview.current.getBoundingClientRect().width
      )
    }
  }

  componentDidMount() {
    this.addOverview()
    window.addEventListener('resize', this.addOverview)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.addOverview)
  }

  render() {
    const { filmInfo } = this.props
    const { rating } = this.state
    const textHeaderClamp = this.textHeaderClamp(filmInfo.title, 20, 450 * 0.45)

    let date = ''
    if (filmInfo.releaseDate) {
      date = format(new Date(filmInfo.releaseDate), 'MMMM dd, yyyy')
    }

    const voteRating = Number(filmInfo.voteAverage).toFixed(1)
    const imgPath = filmInfo.posterPath
      ? `https://image.tmdb.org/t/p/w500${filmInfo.posterPath}`
      : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJAAAACQCAYAAADnRuK4AAAACXBIWXMAAAsTAAALEwEAmpwYAAAMMklEQVR4nO2de2wUdQLHG+MZ4xljDDlzIeaCit02yuOqFrClPihCeQi1tVJKy0p88CgPMSIXPQSSw1wM6p0RRc/omROtVwTpbvc93fd2t7Xtbt8sfQLd0seW0hlKX3OZ4nLLdmZ3ZnYXWvr9JN8/2u7OTGc++f1+8/v95jcxMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMJX4pOoU9Z/aY3SoHHUd55VDFSoy2P722I2ew5UyOjAHy7XXkl3iSud7/CtU7tlvl5rpd+wmzuRb7VfCPU8LFG33pZW0b1+hazmyqqTp51VEk9w/S3VtgpKi9gjKAlW3oMwt7g+ZeYq+43OKL37xmOJSdgpB33nLCPSqpcLC9/iz9TXHgskTjkDxBdV3pOma/pahb+jOM7toqdnJmZcMDYKygmgRlKc1HkF5XOkVlDgZORYvJ5tji8jXp7xAex3G4X00fRuf43/D/OvFaAi0VNe2/mVDHRVMGumtJJCc8gvZ/bB8KGXKCsQkx1C/OdSxpxvcT4WSR4xAmfpG+cYQJY70lhZoXCKmVDo0ZQXabCl3hTr29YYaVaQFytLXl+VbHYLkkd6SAl1NbBH1adAT9rqlYuZOo/1BtrzjMB5jE2i7rbRwnal2IVuyLXWPRUKgdx360dfKzt0VbFtbLfbBSAqUoW8sZOSBQNR1JVG84rI0Rgy77eYv2QTaYbUfEbXBIALtLrWQgRJtMNa8z7WdTH19VqAoO6ylI7tstlExAq3SutO3WsrG5YFA1HWlkERGjiT8Qs+Y1AJtMlUoAgXaYnE0c20n1+i0B4qSa3A5dtqsogTKM7p6ffJAIGpCVSaRU+pJLdB6U+3S/eW66wTa5yDGcszuPwRuI4Ugbt9ps40EipKpb8gTI9BqrVvqLw8Eoia2h2TkmKSY/uOkFShL73pgl83mDSyF8syufwZuI9tQu4ul+hqKoenbxAi0Tl9XA4Go0CmiPprUAkmNzh8CBdphc3gCt7HFWl4XKMkGY7WJ+ZsYgV41VwxDICqkQExH46QWKIeofTSwGttfpqOzDGce8X0/k6i++z1HyVigJC8ZTq8RI9AabeNDgfKgCqNYBZIUk4OTWiDm72+yVGMbTZXf+76fa3AdYn7nL8g2S+k1QYQKtErrXgeBvKGrr/F2EDU26QV6xVT1Y6BAu2y2Pt/3t1kc7YECbTDWaMUKtJpofgMCefkJJKfoh+X0PZNaoJc19XMCq7ED5Vo601iflKlpmLmv7Orf/AVJL3GniRVohbY5DQJ5eQpE0oIu9s0QiGGXzdoXWAptMlfKc03Or3w/++TYYim/buhEsECatpkQyMuzCiOHp4RAUpOzIFCgt2zmyztttu5AgXIMtXL/7Yu6C7NU4i5MHlogiZxsmxICZRIN8wKrscD45FhDnEkKV6AsfV0V7sKo0AIVk99NCYEYmIZzKIE2W8v7A7cvRqC1JU3bIRAVsv0Tr+h7eMoI9IqpqjCUQNmGmuOB2xc7FpZrqsZYmDxY9UVVCL7YN1Ogl0sa5x/47Y6LLXtKTXSmzp0QKYFWEk0btlnQkRjHXvqMStSD1zpzp4RADG+WWi5yCfSGudzLtn2xAvlmIqInmpog0CMy8qCoi32zBXrFVHmcS6Bsfd213ulICcSQbag7jaEMyk+gAdbzPCUEeslc/wRbNXagXEenm+sl0RAohaBvzzLUl2JKK0nHyqkvY8LhZgvEsMtm7Z8wQm+1dXNtP1yBfCzTtO5ZZ6gbmo5zoiUy8lKsvD8jJlwmg0CbTFU/TxhcNbq+jrZADCmE996VRMu/soz1A9NCIBnVGSsj98dEii1E9d2+Cfab/cL8Xuw2NznP3C81Oh8MDNdzYHlE8505+vpZ/sksqL6Da/sv6E8/kKmsn3VdNG0zY8JkmaElPo1o+XAl0XxiNXHG/ELJGat/lmtb7ULytKZDUBYouwVlnqLPGipz5X3muYqLJ+YX9707+xQd9jkCAAAAAAAAADBp2Gj9dfZmkyN/q6Xs0Far/XCovGr+9SMh2WhyCso6Q52grClxHxYSZjGppdqzi5huhHDPXQrRP+M5deuD/klWdszyz0LlpQkPUIbLXMJ775yT3ll8wjxTF+n9x2yxliX9xU7oP6n85TLf1Tl8YessDJZgUzeCTSjjG7Zpq8Hi6yDMM7noF/Wn29O0LR+JlWk50VLNtyNxma51NFXbRj6jPd+Qou44nqz2vCD2+jF9PAJ7okfjZOSgRDbQzAxjiHoeniHfVPbQ+2U6579rfhS8vMutJpB/1hlqrywnWvdHUyC2pGrbBxNVPT+l/NI/I8oCTXicObaYmvBkcFC22Ry5n1WdGBa7PtCtLJAva0vcNamVHb+/UQL5hjKSNZ0jTyp7D90wgXwpJo/x2mG+zb71m5qCsBaYmg4CSc1OOtPY0LuSODfjRgrkywJlj5VPmyViAskoOk5JJoaQx5bxteunsXBXKJsuAknNTvpFQ2MHnwsZaYGuStRlFStQgsI7lKDwkr78WeG9wlRXQae0ygb0nDtiBkeZhnIklribTgJJzU56JdFUKFagFHXHyWRN52FfFqs7jyzWeE49pz3XzDSmQ43GP6nu/UCMQPMUvfsmfLiAviNOPviWRE5e4SiFOjl3tNdhUERqjcTpJlCuyTXGjNSLEShJ0zW+IAQbCWXn7kpWef7xvLZtmEugZI1nJNjtvyCBfkNS1J/OUQoNsH4h39Z4z1Hn8VEIJH51jtV6tyXSAvlgBHlOc7aHa95PorL3+0gKxDC+QuvEhwp7WT+8u9TycSRXaZ1uJZDU7KTXG6tHmamw0RCIYYGi774k9YVBNoGS1Bf6IylQbBG1SFAb6GC5tgEChb8+0LOa9oxoCcSQqOx+j02gFI2HXljU+6dICDTn1KVHmemsbP1B8UUD81gP7NOqk1cgUPgCLdGd/S6aAsV8Qf8uWe0ZYa3GVL07hAg0X9F3YZ6ir9aX+YqL7jgZ6R2/XWd5IjW2mORcLTfmm+oCzlt3VGH8BVqqazNEVSCmPaTuamMT6AlVz1fR6AeSyKlLjxRRGzgPiGlA85EHbaDQAi3TtTqjLdACVXcFewnUUxB5gUhSIif/Hl9AB5///k31/8e7IJD4Kux5bZst2gItVHbV3DiBrmWEEYnzoI5U/Txh3AslkHCBUrXtp6It0CJVVwdHG+jzKAr0W0Oa4wnVDyoUXRAo/Eb0M9qzb0VToIQy+q4UlWeMtUda2fO6EIHmFl9UzS3uf9sX5rEeiZz6WFJEaSUyaoBLotnywWtLCV7D/4UqKIHECZRndtHPWj33R1OgxxU9B7lu4+MVffdFtiNxoJBjlY6GCR/ebCtP+K7mBwgURgm0tuR0U7ALEq5AKQWddyepL1xmE4ip1ri+J1YgZoA4rogcntiZSI6wfv5AmSZkZyJ6orkFWk40S6MlEPMu02c159uDDGW8G3GBrg5nkGylEOvsA6YU+tZv9iEE4l8CpZe43aEuhliBnlJ5di7RtZNcg6mLVF3cI+RhCMS87lLwQuO77ZajEEhYFbbeWDu8lGiWiBUoWdXxbZKm821fkrWeDxarPD88rT5f/byubSjYdI7Fas9YgrI7MaIC0fRtEvngHomMHOLoWAz6NsqYv5YR5SiB+Am0weQaSyVaeC2BEukJZUzD+Qll7/ZITShjwkymj5OHmFQmp04E3SGzQsbeUoMZVVhwgXJMNSPLtK2ZfOSJtEBMyZOo6tnNZ7+R7AdiJprxXsHjTZvlw6OuwuvmCKERfVWeDH3juTRlM/vIdJQFekp1oftxRc8ivvuNlEASOTkkOXk5Vcj/PP4y3r12g+yI82pP9XQWiHkFeIa+0ZOmbckXdBIjIFAa0UIv0Z7zJPKosqIhkERGVc//L/t0Ed5ss1qzdtoshXvthur3HCXtfLKn1HheSLZbSwXlNXOFoOQYatqFZK3+dOMqwq1nFpVKVbbMCuf8Lecp0HJd69gybdvwEu3Z/mc0552L1Z7PFqsvzBe7X8ECMRPrZdRl5pUGzKr0j568NCec/xsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAxbPwPVFFgjc2CJY0AAAAASUVORK5CYII='

    return (
      <div className="film-card">
        <img className="film-card__image" src={imgPath} alt="Poster" />
        <div className="film-card__header">
          <h5 className="film-card__title">{textHeaderClamp}</h5>
          <p className="film-card__release">{date}</p>
          <Consumer>
            {(genre) => <ul className="film-card__genre-list">{this.createGenreList(genre, filmInfo.genreId)}</ul>}
          </Consumer>
        </div>
        <p className="film-card__overview" ref={this.refOverview} />
        <div style={this.borderColor(filmInfo.voteAverage)} className="film-card__rating">
          <span>{voteRating}</span>
        </div>
        <Rate
          className="film-card__stars"
          count={10}
          value={Number(rating)}
          allowHalf
          onChange={(event) => this.onRateChange(event, filmInfo.id)}
        />
      </div>
    )
  }
}
