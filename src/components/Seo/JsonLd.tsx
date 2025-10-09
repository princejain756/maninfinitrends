import React from 'react';

type Props = {
  data: Record<string, any> | Record<string, any>[];
};

export const JsonLd = ({ data }: Props) => {
  const json = Array.isArray(data) ? data : [data];
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
};

export default JsonLd;

