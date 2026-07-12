import { ReactNode } from "react";

export default function Layout({
    children,
}:{
    children:ReactNode
}){

    return (

        <main
            style={{
                maxWidth:900,
                margin:"40px auto",
                padding:20
            }}
        >

            {children}

        </main>

    );

}