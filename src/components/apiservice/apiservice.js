export default class ApiService {
  constructor() {
    this.getFilms = async (input, current) => {
      const url = new URL('/3/search/movie', 'https://api.themoviedb.org')
      url.searchParams.set('query', input)
      url.searchParams.set('language', 'ru')
      url.searchParams.set('page', current)

      const responce = await fetch(url, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyOThhMjU1NGFlODJjNzI1OWIxODMwODZhZDIwYjQ2OSIsInN1YiI6IjY2NGEyM2IwNjRlMzQwODE4Zjc5MTlmNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Ljp_uBmt-7JNYlG7g3eIYjJIXP0ynR1UU3BlvTxKGQg',
        },
      })

      if (responce.ok) {
        const objectRespons = await responce.json()
        return objectRespons
      }
      throw new TypeError(responce.status)
    }

    this.getTopRatedFilms = async (page) => {
      const url = new URL('/3/movie/top_rated', 'https://api.themoviedb.org')
      url.searchParams.set('language', 'ru')
      url.searchParams.set('page', page)

      const responce = await fetch(url, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyOThhMjU1NGFlODJjNzI1OWIxODMwODZhZDIwYjQ2OSIsInN1YiI6IjY2NGEyM2IwNjRlMzQwODE4Zjc5MTlmNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Ljp_uBmt-7JNYlG7g3eIYjJIXP0ynR1UU3BlvTxKGQg',
        },
      })

      if (responce.ok) {
        const objectRespons = await responce.json()
        return objectRespons
      }
      throw new TypeError(responce.status)
    }

    this.createGuestSession = async () => {
      const url = new URL('/3/authentication/guest_session/new', 'https://api.themoviedb.org')

      const responce = await fetch(url, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyOThhMjU1NGFlODJjNzI1OWIxODMwODZhZDIwYjQ2OSIsInN1YiI6IjY2NGEyM2IwNjRlMzQwODE4Zjc5MTlmNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Ljp_uBmt-7JNYlG7g3eIYjJIXP0ynR1UU3BlvTxKGQg',
        },
      })

      if (responce.ok) {
        const objectRespons = await responce.json()
        return objectRespons
      }
      throw new TypeError(responce.status)
    }

    this.addRatingMovie = async (sessionId, movieId, rating) => {
      const url = new URL(`/3/movie/${movieId}/rating`, 'https://api.themoviedb.org')
      url.searchParams.set('guest_session_id', sessionId)

      const responce = await fetch(url, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json;charset=utf-8',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyOThhMjU1NGFlODJjNzI1OWIxODMwODZhZDIwYjQ2OSIsInN1YiI6IjY2NGEyM2IwNjRlMzQwODE4Zjc5MTlmNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Ljp_uBmt-7JNYlG7g3eIYjJIXP0ynR1UU3BlvTxKGQg',
        },
        body: JSON.stringify({ value: rating }),
      })

      if (responce.ok) {
        const objectRespons = await responce.json()
        return objectRespons
      }
      throw new TypeError(responce.status)
    }

    this.deleteRatingMovie = async (sessionId, movieId) => {
      const url = new URL(`/3/movie/${movieId}/rating`, 'https://api.themoviedb.org')
      url.searchParams.set('guest_session_id', sessionId)

      const responce = await fetch(url, {
        method: 'DELETE',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json;charset=utf-8',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyOThhMjU1NGFlODJjNzI1OWIxODMwODZhZDIwYjQ2OSIsInN1YiI6IjY2NGEyM2IwNjRlMzQwODE4Zjc5MTlmNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Ljp_uBmt-7JNYlG7g3eIYjJIXP0ynR1UU3BlvTxKGQg',
        },
      })

      if (responce.ok) {
        const objectRespons = await responce.json()
        return objectRespons
      }
      throw new TypeError(responce.status)
    }

    this.getRateFilms = async (sessionId, current) => {
      const url = new URL(`/3/guest_session/${sessionId}/rated/movies`, 'https://api.themoviedb.org')
      url.searchParams.set('guest_session_id', sessionId)
      url.searchParams.set('language', 'ru')
      url.searchParams.set('page', current)

      const responce = await fetch(url, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyOThhMjU1NGFlODJjNzI1OWIxODMwODZhZDIwYjQ2OSIsInN1YiI6IjY2NGEyM2IwNjRlMzQwODE4Zjc5MTlmNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Ljp_uBmt-7JNYlG7g3eIYjJIXP0ynR1UU3BlvTxKGQg',
        },
      })

      if (responce.ok) {
        const objectRespons = await responce.json()
        return objectRespons
      }
      throw new TypeError(responce.status)
    }

    this.getGenre = async () => {
      const url = new URL('/3/genre/movie/list', 'https://api.themoviedb.org')
      url.searchParams.set('language', 'ru')

      const responce = await fetch(url, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyOThhMjU1NGFlODJjNzI1OWIxODMwODZhZDIwYjQ2OSIsInN1YiI6IjY2NGEyM2IwNjRlMzQwODE4Zjc5MTlmNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Ljp_uBmt-7JNYlG7g3eIYjJIXP0ynR1UU3BlvTxKGQg',
        },
      })

      if (responce.ok) {
        const objectRespons = await responce.json()
        return objectRespons
      }
      throw new TypeError(responce.status)
    }
  }
}
