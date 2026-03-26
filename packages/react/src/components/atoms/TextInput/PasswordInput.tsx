import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useState } from "react";

import type { TextInputProps } from "./TextInput.js";

import Button from "../Button/Button.js";
import TextInput from "./TextInput.js";

export default function PasswordInput(props: TextInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <TextInput
      iconAfter={
        <Button spacing="none" variant="borderless">
          {showPassword ? (
            <IconEye
              onClick={() => {
                setShowPassword(false);
              }}
            />
          ) : (
            <IconEyeOff
              onClick={() => {
                setShowPassword(true);
              }}
            />
          )}
        </Button>
      }
      type={showPassword ? "text" : "password"}
      {...props}
    />
  );
}
