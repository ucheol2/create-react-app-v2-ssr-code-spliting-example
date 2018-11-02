import React, { Component } from 'react';
import Loadable from 'react-loadable';

import Loading from './Loading';

const ByeLoadable = Loadable({
  loader: () => import('./Bye'),
  loading: Loading,
});

const GreeterLoadable = Loadable({
  loader: () => import('./Greeter'),
  loading: Loading,
});

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      bye: false,
    }
  }

  toggleBye() {
    this.setState(({bye}) => ({bye: !bye}))
  }

  render() {
    const { bye } = this.state;

    return (
      <div>
        <GreeterLoadable/>
        <button onClick={() => this.toggleBye()}>toggle</button>
        {bye && (
          <ByeLoadable/>
        )}
      </div>
    );
  }
}

export default App;
