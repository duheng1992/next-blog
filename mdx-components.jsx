import * as mdxComponents from './src/components/mdx'

export function useMDXComponents(components) {
  return {
    ...components,
    ...mdxComponents,
  }
}
