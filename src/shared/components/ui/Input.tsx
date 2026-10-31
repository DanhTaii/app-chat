import type { InputHTMLAttributes } from 'react'
import './input.scss'

type InputProps = InputHTMLAttributes<HTMLInputElement>

function Input({ type = 'text', className = '', ...props }: InputProps) {
  const baseClass = type === 'checkbox' || type === 'radio'
    ? 'form-check-input'
    : 'form-control'

  return <input type={type} className={`${baseClass} ${className}`.trim()} {...props} />
}

export default Input
