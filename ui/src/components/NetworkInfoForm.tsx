import * as React from 'react';
import { Flex, Box, Txt, Heading, Input, Button, Select } from 'rendition';
import { Network, NetworkInfo } from './App';
import styled from 'styled-components';

interface NetworkInfoFormProps {
  availableNetworks: Network[];
  onSubmit: (data: NetworkInfo) => void;
}

interface NetworkInfoFormState {
  formData: NetworkInfo;
}

const CustomInput = styled(Input)`
  box-sizing: border-box;
  border: 1px solid #d1d8f2;
`;

const isEnterpriseNetwork = (
  networks: Network[],
  selectedNetworkSsid?: string
) => {
  const selectedNetwork = networks.filter(
    x => selectedNetworkSsid === x.ssid
  )[0];
  if (!selectedNetwork) {
    return false;
  }

  return selectedNetwork.security === 'enterprise';
};

export class NetworkInfoForm extends React.PureComponent<
  NetworkInfoFormProps,
  NetworkInfoFormState
> {
  state = {
    formData: {} as NetworkInfo
  };

  static getDerivedStateFromProps(
    nextProps: NetworkInfoFormProps,
    prevState: NetworkInfoFormState
  ) {
    if (!prevState.formData.ssid && nextProps.availableNetworks.length > 0) {
      return {
        formData: {
          ...prevState,
          ssid: nextProps.availableNetworks[0].ssid
        }
      };
    }

    return null;
  }

  change = (field: string, val: string) => {
    this.setState({ formData: { ...this.state.formData, [field]: val } });
  };

  submit = () => {
    this.props.onSubmit(this.state.formData);
  };

  render() {
    const isSelectedNetworkEnterprise = isEnterpriseNetwork(
      this.props.availableNetworks,
      this.state.formData.ssid
    );

    return (
      <form onSubmit={this.submit} style={{ width: '100%' }}>
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          m={3}
          mt={80}
        >
          <Heading.h3 mb={4}>
            Hi! Please choose your WiFi from the list
          </Heading.h3>

          <Box width={['80%', '60%', '40%']} my={3}>
            <Txt>SSID</Txt>
            <Select<Network>
              emphasized
              width={'100%'}
              placeholder={'Select SSID'}
              options={this.props.availableNetworks}
              valueKey="ssid"
              labelKey="ssid"
              value={
                this.props.availableNetworks.find(
                  network => network.ssid === this.state.formData.ssid
                ) || 'Select SSID'
              }
              onChange={({ option }) => this.change('ssid', option.ssid)}
            />
          </Box>

          {isSelectedNetworkEnterprise && (
            <Box width={['80%', '60%', '40%']} my={3}>
              <Txt>User</Txt>
              <CustomInput
                emphasized
                width={'100%'}
                onChange={e => this.change('identity', e.target.value)}
              />
            </Box>
          )}

          <Box width={['80%', '60%', '40%']} my={3}>
            <Txt>Passphrase</Txt>
            <CustomInput
              emphasized
              type="password"
              width={'100%'}
              onChange={e => this.change('passphrase', e.target.value)}
            />
          </Box>

          <Button type="submit" primary>
            Connect
          </Button>
        </Flex>
      </form>
    );
  }
}
