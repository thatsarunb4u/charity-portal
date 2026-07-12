export default function SectionCard({
    children,
}:{
    children:React.ReactNode
}){

    return(

        <div
            className="
            rounded-2xl
            bg-white
            shadow-lg
            border
            border-slate-200
            p-8
            "
        >

            {children}

        </div>

    )

}