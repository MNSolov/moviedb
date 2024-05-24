export default class ApiService {
  constructor() {
    this.getFilms = async () => {
      const url = new URL('/3/search/movie', 'https://api.themoviedb.org')
      url.searchParams.set('query', 'back')
      let responce = null
      responce = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyOThhMjU1NGFlODJjNzI1OWIxODMwODZhZDIwYjQ2OSIsInN1YiI6IjY2NGEyM2IwNjRlMzQwODE4Zjc5MTlmNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Ljp_uBmt-7JNYlG7g3eIYjJIXP0ynR1UU3BlvTxKGQg',
          accept: 'application/json',
        },
      })

      if (responce.ok) {
        const objectRespons = await responce.json()
        return objectRespons.results
      }
      throw new TypeError(responce.status)
    }
  }
}
