import * as React from 'react';
import { Txt, Alert } from 'rendition';

export const Notifications = ({
  hasAvailableNetworks,
  isConnecting,
  error
}: {
  hasAvailableNetworks: boolean;
  isConnecting: boolean;
  error: string;
}) => {
  return (
    <>
      {isConnecting && (
        <Alert m={1} info>
          <Txt.span>Applying changes... </Txt.span>
          <Txt.span>
            Your device will soon be online. If connection is unsuccessful, the
            Access Point will be back up in a few minutes, and reloading this
            page will allow you to try again.
          </Txt.span>
        </Alert>
      )}
      {!hasAvailableNetworks && (
        <Alert m={1} warning>
          <Txt.span>No wifi networks available.&nbsp;</Txt.span>
          <Txt.span>
            Please ensure there is a network within range and reboot the device.
          </Txt.span>
        </Alert>
      )}
      {error && (
        <Alert m={1} danger>
          <Txt.span>{error}</Txt.span>
        </Alert>
      )}
    </>
  );
};
