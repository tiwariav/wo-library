import type { ChangeEvent, ComponentPropsWithoutRef, ElementType } from "react";

import { useEffect, useRef, useState } from "react";

import type { InputFormValue } from "../atoms/TextInput/TextInput.js";

export function InputTemplate<TComponent extends ElementType>({
  as,
  width = 240,
  ...props
}: {
  as: TComponent;
  width?: number | string;
} & ComponentPropsWithoutRef<TComponent>) {
  const [eventValue, setEventValue] = useState("");
  const [refValue, setRefValue] = useState("");
  const [parsedValue, setParsedValue] = useState<InputFormValue>("");
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      setRefValue(ref.current.value);
    }
  }, [eventValue]);

  const Element = as;

  return (
    <div style={{ width }}>
      {/* @ts-expect-error 2322 because of generic type */}
      <Element
        onChange={(event: ChangeEvent<HTMLInputElement>, value: string) => {
          setEventValue(event.target.value);
          setParsedValue(value);
        }}
        placeholder="Enter your text"
        ref={ref}
        {...props}
      />
      <div style={{ fontSize: "0.875rem" }}>
        <p>
          Event Value: <strong>{eventValue}</strong>{" "}
          <em>({typeof eventValue})</em>
        </p>
        <div>
          <p>
            Ref Value: <strong>{refValue}</strong> <em>({typeof refValue})</em>
          </p>
          <button
            onClick={() => {
              if (ref.current) {
                setRefValue(ref.current.value);
              }
            }}
          >
            Get latest Ref value
          </button>
        </div>
        <p>
          Parsed Value: <strong>{parsedValue}</strong>{" "}
          <em>({typeof parsedValue})</em>
        </p>
      </div>
    </div>
  );
}
