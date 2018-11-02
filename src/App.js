import React, { Component } from 'react';
import Loadable from 'react-loadable';

import Loading from './Loading';
//import Bye from './Bye';
//import Greeter from './Greeter';

const Bye = Loadable({
  loader: () => import('./Bye'),
  loading: Loading,
});

const Greeter = Loadable({
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
        <Greeter/>
        <button onClick={() => this.toggleBye()}>toggle</button>
        {bye && (
          <Bye/>
        )}
      </div>
    );
  }
}

export default App;
