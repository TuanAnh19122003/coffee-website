import React, { Children } from "react";

const AboutLayout = ({children}: {children: React.ReactNode}) =>{
    return(
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow">{children}</main>
        </div>
    );
}

export default AboutLayout;