import Container from "@/components/Container";
import OrderForm from "@/components/OrderForm";
import SectionCard from "@/components/SectionCard";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function Home() {

    const { data } = await supabaseAdmin
        .from("settings")
        .select("*")
        .eq("id",1)
        .single();

    return(

        <Container>

            <SectionCard>

                <img
                    src={data.banner_url}
                    className="
                    h-72
                    w-full
                    rounded-xl
                    object-cover
                    "
                />

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