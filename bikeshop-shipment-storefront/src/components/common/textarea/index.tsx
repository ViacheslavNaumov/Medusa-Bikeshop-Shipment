import { forwardRef, TextareaHTMLAttributes } from "react"
import { clx } from "@medusajs/ui"

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  errors?: Record<string, unknown>
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, errors, ...props }, ref) => {
    return (
      <div className="flex flex-col w-full">
        {label && (
          <label className="text-sm font-medium mb-2" htmlFor={props.id}>
            {label}
          </label>
        )}
        <textarea
          className={clx(
            "flex w-full rounded-md border border-ui-border-base bg-ui-bg-field px-4 py-2.5 focus:border-ui-border-interactive focus:outline-none",
            className
          )}
          ref={ref}
          {...props}
        />
        {errors && errors[props.name || ""] && (
          <div className="pt-1 pl-2 text-rose-500 text-sm">
            {errors[props.name || ""]?.message as string}
          </div>
        )}
      </div>
    )
  }
)

Textarea.displayName = "Textarea"

export { Textarea }