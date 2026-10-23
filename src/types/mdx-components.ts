import type { ComponentType } from 'react'

/* eslint-disable @typescript-eslint/no-explicit-any */
/** component map passed down into compiled MDX content */
export type MdxComponentMap = Record<string, ComponentType<any> | string>

/** default export shape of a compiled .mdx module */
export type MdxContentComponent = ComponentType<{
  components?: MdxComponentMap
}>