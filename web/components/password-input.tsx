import { Button, Input, InputProps } from '@chakra-ui/react';
import { InputGroup, InputGroupProps } from '@/components/ui/input-group';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { ViewIcon, ViewOffIcon } from '@/components/icons';

interface PasswordInputProps extends InputProps {
  group?: InputGroupProps;
}

export const PasswordInput: React.FC<PasswordInputProps> = props => {
  const { type = 'password', group, ...rest } = props;
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    if (type === 'text') {
      setShowPassword(true);
    } else if (type === 'password') {
      setShowPassword(false);
    }
  }, [type]);

  return (
    <InputGroup
      flex={1}
      w="full"
      endElement={
        <Button variant="ghost" onClick={() => setShowPassword(p => !p)}>
          {showPassword ? <ViewIcon /> : <ViewOffIcon />}
        </Button>
      }
      {...group}
    >
      <Input type={showPassword ? 'text' : 'password'} {...rest} />
    </InputGroup>
  );
};
