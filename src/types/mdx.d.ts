declare module '*.mdx' {
  import type { ComponentType } from 'react'
  import type { MdxComponentMap } from './mdx-components'

  export interface MdxProps {
    components?: MdxComponentMap
  }

  const MDXContent: ComponentType<MdxProps>
  export default MDXContent
}