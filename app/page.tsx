import Container from "@/components/Container";
import OrderForm from "@/components/OrderForm";
import SectionCard from "@/components/SectionCard";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import Image from "next/image";

export default async function Home() {

    const { data } = await supabaseAdmin
        .from("settings")
        .select("*")
        .eq("id",1)
        .single();

    return(

        <Container>

            <SectionCard>

                <div className="relative h-72 w-full overflow-hidden rounded-xl">
                    <Image
                        src="/event-banner.jpeg"
                        alt="Briyani served with rice and curry"
                        fill
                        preload
                        sizes="(max-width: 1024px) 100vw, 896px"
                        className="object-cover object-center"
                    />
                </div>

                <div className="mt-8">

                    <h1
                        className="
                        text-5xl
                        font-bold
                        "
                    >
                        {data.event_title}
                    </h1>

                    <p
                        className="
                        mt-4
                        text-lg
                        text-slate-600
                        "
                    >
                        {data.event_description}
                    </p>

                </div>

            </SectionCard>

            <div className="h-8"/>

            <OrderForm unitPrice={Number(data.price)} />

        </Container>

    )

}
