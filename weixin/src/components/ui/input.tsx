import { Input as TaroInput, View } from "@tarojs/components";
import { Search as SearchIcon, Close as CloseIcon } from "@nutui/icons-react-taro";
import {
  CSSProperties,
  ForwardRefRenderFunction,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";

// Matches zmp-ui's Input onChange shape: `(e) => ...e.currentTarget.value` /
// `...e.target.value` are both used across client/src, so both are populated.
export interface InputChangeEvent {
  currentTarget: { value: string };
  target: { value: string };
}

export interface InputProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
  maxLength?: number;
  clearable?: boolean;
  allowClear?: boolean;
  onChange?: (event: InputChangeEvent) => void;
  onFocus?: (event?: any) => void;
  onBlur?: (event?: any) => void;
  id?: string;
}

// Matches zmp-ui's InputRef shape: `ref.input.value` + `ref.focus()`.
export interface InputRefHandle {
  input: { value: string };
  focus: () => void;
}

const fireChange = (
  value: string,
  onChange: InputProps["onChange"],
) => onChange?.({ currentTarget: { value }, target: { value } });

const InputBaseImpl: ForwardRefRenderFunction<InputRefHandle, InputProps> = (
  {
    value,
    defaultValue,
    placeholder,
    className = "",
    style,
    disabled,
    maxLength,
    clearable,
    allowClear,
    onChange,
    onFocus,
    onBlur,
    id,
  },
  ref,
) => {
  const [internalValue, setInternalValue] = useState(defaultValue ?? value ?? "");
  const [focusFlag, setFocusFlag] = useState(false);
  const current = value !== undefined ? value : internalValue;
  const showClear = (clearable || allowClear) && !!current;

  useImperativeHandle(
    ref,
    () => ({
      input: { value: current },
      focus: () => setFocusFlag(true),
    }),
    [current],
  );

  const handleInput = (event: any) => {
    const nextValue = event?.detail?.value ?? "";
    if (value === undefined) setInternalValue(nextValue);
    fireChange(nextValue, onChange);
  };

  const handleClear = () => {
    if (value === undefined) setInternalValue("");
    fireChange("", onChange);
  };

  return (
    <View id={id} className={`flex items-center ${className}`} style={style}>
      <TaroInput
        className="flex-1 h-9 text-sm leading-9"
        value={current}
        placeholder={placeholder}
        disabled={disabled}
        focus={focusFlag}
        maxlength={maxLength ?? -1}
        onInput={handleInput}
        onFocus={(event) => {
          setFocusFlag(false);
          onFocus?.(event);
        }}
        onBlur={onBlur}
      />
      {showClear && (
        <View className="pl-1 text-gray" onClick={handleClear}>
          <CloseIcon size={14} />
        </View>
      )}
    </View>
  );
};

const InputBase = forwardRef(InputBaseImpl);

const InputSearchImpl: ForwardRefRenderFunction<InputRefHandle, InputProps> = (
  { className = "", ...rest },
  ref,
) => (
  <View className={`flex items-center bg-[#f4f5f6] rounded-full px-3 ${className}`}>
    <SearchIcon size={16} className="text-gray mr-1" />
    <InputBase ref={ref} {...rest} className="flex-1 bg-transparent" />
  </View>
);

const InputSearch = forwardRef(InputSearchImpl);

export const Input = Object.assign(InputBase, { Search: InputSearch });
