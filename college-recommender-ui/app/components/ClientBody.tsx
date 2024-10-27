'use client';

import { useEffect, useState } from 'react';

export default function ClientBody({
  children
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <body className="__variable_1e4310 __variable_c3aa02 antialiased">
      {children}
    </body>
  );
}

