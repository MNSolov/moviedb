import React, { PureComponent } from 'react'

import './error.css'

export default class Error extends PureComponent {
  render() {
    const { children } = this.props
    return (
      <div className="error">
        <p className="error__text">{children}</p>
      </div>
    )
  }
}
