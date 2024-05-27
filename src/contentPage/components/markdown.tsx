import ReactMarkdown from 'react-markdown';
import React from 'react';
import LoadingIcon from './three-dots.svg?react';

const MarkdownContent = React.memo((props: { content: string }) => {
  return <ReactMarkdown>{props.content}</ReactMarkdown>;
});

export function Markdown(props: { content: string; loading?: boolean }) {
  return (
    <>
      <MarkdownContent content={props.content} />
      {props.loading && <LoadingIcon />}
    </>
  );
}
