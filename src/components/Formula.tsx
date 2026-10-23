import { useMemo } from 'react'
import katex from 'katex'
import { cn } from '@/lib/utils'

export interface FormulaProps {
  tex: string
  /** render as a centered block instead of inline */
  block?: boolean
  className?: string
}

export function Formula({ tex, block = false, className }: FormulaProps) {
  const html = useMemo(
    () =>
      katex.renderToString(tex, {
        displayMode: block,
        throwOnError: false,
        output: 'html',
      }),
    [tex, block],
  )
  return block ? (
    <div
      className={cn('overflow-x-auto py-2 text-center', className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  ) : (
    <span
      className={cn('whitespace-nowrap', className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}