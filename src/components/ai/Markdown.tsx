import { FC, memo } from "react";
import ReactMarkdown, { Options } from "react-markdown";

// className을 지원하도록 타입 확장
type MarkdownPropsWithClassName = Options & {
  className?: string;
};

export const MemoizedReactMarkdown: FC<MarkdownPropsWithClassName> = memo(
  (props) => {
    const { className, ...rest } = props;
    return (
      <div className={className}>
        <ReactMarkdown {...rest} />
      </div>
    );
  },
  (prev, next) =>
    prev.children === next.children && prev.className === next.className
);
