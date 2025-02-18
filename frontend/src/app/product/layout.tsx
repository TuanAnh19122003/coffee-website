import React from 'react';

const ProductLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">

        <main className="flex-grow">{children}</main>

    </div>
  );
};

export default ProductLayout;
