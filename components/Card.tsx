import { ReactNode } from "react";

export default function Card({
    children,
}:{
    children:ReactNode
}){

    return(

        <div
            style={{
                background:"white",
                borderRadius:12,
                padding:24,
                boxShadow:"0 4px 15px rgba(0,0,0,.08)"
            }}
        >

            {children}

        </div>

    )

}