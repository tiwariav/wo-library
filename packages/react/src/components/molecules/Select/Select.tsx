import type { ReactNode } from "react";

import { clsx } from "clsx";
import { useCallback, useMemo, useState } from "react";

import type { COMPONENT_SIZES } from "../../../tools/constants/props.js";

import { getDynamicClassName } from "../../../tools/utils.js";
import InputWrapper from "../../atoms/InputWrapper.js";
import Label from "../../atoms/Label.js";
import Popover from "../Popover.js";
import * as styles from "./select.module.css";

export interface SelectOption<T = string | number> {
  label: string;
  value: T;
}

/**
 * Props for the `Select` component.
 *
 * @property options - Array of options to display.
 * @property value - Currently selected value(s).
 * @property onChange - Callback when selection changes.
 * @property multiple - Enable multi-select mode.
 * @property label - Label text or node.
 * @property placeholder - Placeholder text when no option is selected.
 * @property size - Size variant: `"small"` | `"large"`.
 * @property hasError - Applies error styling when `true`.
 * @property disabled - Disables the select input.
 */
export interface SelectProps<T = string | number> {
  className?: string;
  disabled?: boolean;
  hasError?: boolean;
  label?: ReactNode;
  multiple?: boolean;
  onChange?: (value: T | T[]) => void;
  options: SelectOption<T>[];
  placeholder?: string;
  size?: (typeof COMPONENT_SIZES)[number];
  value?: T | T[];
}

/**
 * A robust, accessible select component.
 *
 * Supports single and multi-select modes.
 *
 * @example
 * ```tsx
 * const options = [
 *   { label: 'Option 1', value: 1 },
 *   { label: 'Option 2', value: 2 },
 * ];
 * <Select options={options} onChange={setValue} label="Select an option" />
 * ```
 */
export default function Select<T = string | number>({
  className,
  disabled,
  hasError,
  label,
  multiple,
  onChange,
  options,
  placeholder = "Select...",
  size,
  value,
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOptions = useMemo(() => {
    if (multiple && Array.isArray(value)) {
      return options.filter((opt) => value.includes(opt.value));
    }
    return options.filter((opt) => opt.value === value);
  }, [multiple, options, value]);

  const displayText = useMemo(() => {
    if (selectedOptions.length === 0) {
      return placeholder;
    }
    if (multiple) {
      return selectedOptions.map((opt) => opt.label).join(", ");
    }
    return selectedOptions[0]?.label;
  }, [multiple, placeholder, selectedOptions]);

  const handleOptionClick = useCallback(
    (option: SelectOption<T>) => {
      if (multiple) {
        const currentValues = Array.isArray(value) ? value : [];
        const newValue = currentValues.includes(option.value)
          ? currentValues.filter((v) => v !== option.value)
          : [...currentValues, option.value];
        onChange?.(newValue);
      } else {
        onChange?.(option.value);
        setIsOpen(false);
      }
    },
    [multiple, onChange, value],
  );

  const isOptionSelected = useCallback(
    (option: SelectOption<T>) => {
      if (multiple && Array.isArray(value)) {
        return value.includes(option.value);
      }
      return value === option.value;
    },
    [multiple, value],
  );

  const content = (
    <div className={styles.optionsList} role="listbox">
      {options.map((option) => (
        <button
          aria-selected={isOptionSelected(option)}
          className={clsx(styles.option, {
            [styles.isSelected]: isOptionSelected(option),
          })}
          key={String(option.value)}
          onClick={() => handleOptionClick(option)}
          role="option"
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );

  return (
    <InputWrapper
      className={clsx(
        styles.root,
        size && getDynamicClassName(styles, `size-${size}`),
        hasError && styles.hasError,
        { [styles.isDisabled]: disabled },
        className,
      )}
      size={size}
    >
      {label && <Label className={styles.label}>{label}</Label>}
      <Popover
        content={content}
        innerClassNames={{ reference: styles.triggerWrapper }}
        onOpenChange={setIsOpen}
        open={isOpen}
        placement="bottom-start"
        trigger="click"
      >
        <button
          className={styles.trigger}
          disabled={disabled}
          type="button"
        >
          <span className={styles.displayText}>{displayText}</span>
          <span className={styles.arrow} />
        </button>
      </Popover>
    </InputWrapper>
  );
}
