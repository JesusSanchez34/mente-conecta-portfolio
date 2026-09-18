import React from 'react';

export function NoLayout(props) {
  const { children } = props;
  return (
    <>
      {children}
    </>
  );
}
