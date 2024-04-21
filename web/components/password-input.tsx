import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
  Button,
  Input,
  InputGroup,
  InputProps,
  InputRightElement,
} from '@chakra-ui/react';
import * as React from 'react';
import { useEffect, useState } from 'react';

interface PasswordInputProps extends InputProps {}

export const PasswordInput: React.FC<PasswordInputProps> = props => {
  const { type = 'password', ...rest } = props;
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    if (type === 'text') {
      setShowPassword(true);
    } else if (type === 'password') {
      setShowPassword(false);
    }
  }, [type]);

  return (
    <InputGroup>
      <Input type={showPassword ? 'text' : 'password'} {...rest} />
      <InputRightElement h="full">
        <Button variant="ghost" onClick={() => setShowPassword(p => !p)}>
          {showPassword ? <ViewIcon /> : <ViewOffIcon />}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
};
