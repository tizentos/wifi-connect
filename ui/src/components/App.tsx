import React from 'react';
import logo from '../img/logo.svg';
import { Navbar, Provider } from 'rendition';
import { NetworkInfoForm } from './NetworkInfoForm';
import { Notifications } from './Notifications';

export interface NetworkInfo {
  ssid?: string;
  identity?: string;
  passphrase?: string;
}

export interface Network {
  ssid: string;
  security: string;
}

interface AppState {
  isConnecting: boolean;
  isFetchingNetworks: boolean;
  availableNetworks: Network[];
  error: string;
}

class App extends React.PureComponent<{}, AppState> {
  state = {
    isConnecting: false,
    isFetchingNetworks: true,
    availableNetworks: [],
    error: ''
  };

  componentDidMount() {
    fetch('/networks')
      .then(data => {
        if (data.status !== 200) {
          throw new Error();
        }

        console.log(data);

        return data.json();
      })
      .then((data: Network[]) => {
        this.setState({ availableNetworks: data });
      })
      .catch((e: Error) => {
        this.setState({
          error: `Failed to fetch available networks. ${e.message || e}`
        });
      })
      .finally(() => {
        this.setState({
          isFetchingNetworks: false
        });
      });
  }

  onConnect = (data: NetworkInfo) => {
    this.setState({ isConnecting: true });
    fetch('/connect', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(resp => {
        if (resp.status !== 200) {
          throw new Error();
        }
      })
      .catch((e: Error) => {
        this.setState({
          error: `Failed to connect to the network. ${e.message || e}`
        });
      })
      .finally(() => {
        this.setState({ isConnecting: false });
      });
  };

  render() {
    return (
      <Provider>
        <Navbar brand={<img src={logo} style={{ height: 30 }} alt="logo" />} />
        <Notifications
          isConnecting={this.state.isConnecting}
          hasAvailableNetworks={
            this.state.isFetchingNetworks ||
            this.state.availableNetworks.length > 0
          }
          error={this.state.error}
        />
        <NetworkInfoForm
          availableNetworks={this.state.availableNetworks}
          onSubmit={this.onConnect}
        />
      </Provider>
    );
  }
}

export default App;
