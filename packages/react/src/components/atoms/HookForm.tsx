import type {
  FieldValues,
  Path,
  Resolver,
  SubmitErrorHandler,
  SubmitHandler,
  UseFormProps,
} from "react-hook-form";

import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";

type ErrorKey<TFieldValues extends FieldValues> =
  | "root"
  | `root.${string}`
  | Path<TFieldValues>;

export interface HookFormProps<TFieldValues extends FieldValues>
  extends Omit<UseFormProps<TFieldValues>, "errors"> {
  children: React.ReactNode;
  className?: string;
  errors?: Record<ErrorKey<TFieldValues>, string>;
  onInvalid?: SubmitErrorHandler<TFieldValues>;
  onValid?: SubmitHandler<TFieldValues>;
}

export type ResolverFieldValues<TResolver extends Resolver> =
  TResolver extends Resolver<infer TField> ? TField : unknown;

export default function HookForm<TFieldValues extends FieldValues>({
  children,
  className,
  criteriaMode = "all",
  errors,
  mode = "onBlur",
  onInvalid,
  onValid,
  ...props
}: HookFormProps<TFieldValues>) {
  const methods = useForm({ criteriaMode, mode, ...props });

  useEffect(() => {
    if (errors) {
      for (const [key, value] of Object.entries(errors)) {
        methods.setError(key as ErrorKey<TFieldValues>, {
          message: value,
          type: "manual",
        });
      }
    }
  }, [errors, methods]);

  return (
    <FormProvider {...methods}>
      <form
        className={className}
        onSubmit={(event) =>
          onValid
            ? void methods.handleSubmit(onValid, onInvalid)(event)
            : undefined
        }
      >
        {children}
      </form>
    </FormProvider>
  );
}
