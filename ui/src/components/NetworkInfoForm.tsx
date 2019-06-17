import * as React from 'react';
import { Flex, Box, Txt, Heading, Input, Button, Select } from 'rendition';
import { Network, NetworkInfo } from './App';
import styled from 'styled-components';

interface NetworkInfoFormProps {
  availableNetworks: Network[];
  onSubmit: (data: NetworkInfo) => void;
}

const CustomInput = styled(Input)`
  box-sizing: border-box;
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
  { formData: NetworkInfo }
> {
  state = {
    formData: {} as NetworkInfo
  };

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
              width={'100%'}
              placeholder={'Select SSID'}
              options={this.props.availableNetworks}
              valueKey="ssid"
              labelKey="ssid"
              onChange={({ option }) => this.change('ssid', option.ssid)}
            />
          </Box>

          {isSelectedNetworkEnterprise && (
            <Box width={['80%', '60%', '40%']} my={3}>
              <Txt>User</Txt>
              <CustomInput
                width={'100%'}
                onChange={e => this.change('identity', e.target.value)}
              />
            </Box>
          )}

          <Box width={['80%', '60%', '40%']} my={3}>
            <Txt>Passphrase</Txt>
            <CustomInput
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
