import { FC, memo } from "react"
import ReactMarkdown, { Options } from "react-markdown"
import remarkGfm from "remark-gfm"

export const MemoizedReactMarkdown: FC<Options> = memo(
    (props) => <ReactMarkdown {...props} remarkPlugins={[remarkGfm]} />,
    (prevProps, nextProps) =>
      prevProps.children === nextProps.children &&
      prevProps.className === nextProps.className
)
MemoizedReactMarkdown.displayName = "MemoizedReactMarkdown"
