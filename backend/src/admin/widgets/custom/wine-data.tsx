import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Container } from "../../shared/widget-container";
import { Header } from "../../shared/widget-header";
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types";
import { sdk } from "../../lib/config";
import { useQuery } from "@tanstack/react-query";
import { EditForm } from "./edit-wine-form";
import { Spinner } from "@medusajs/icons";
import { AdditionalWineData } from "./edit-wine-form";

type FetchAdminProductWithWineData = AdminProduct & AdditionalWineData;

const CustomDetailWidget = ({ data: productData }: DetailWidgetProps<AdminProduct>) => {
    // * Load Product:
    const { data, isLoading } = useQuery({
        queryFn: () =>
            sdk.admin.product.retrieve(productData.id, {
                fields: "id, description, *wine",
            }),
        queryKey: ["product", productData.id],
    });

    // * Return Container
    return (
        <Container>
            <Header
                title="Dati del Vino"
                subtitle="Aggiorna gli attributi del vino qui"
                actions={[
                    {
                        type: "custom",
                        children: isLoading ? (
                            <Spinner className="animate animate-spin" />
                        ) : (
                            <EditForm product={data!.product as FetchAdminProductWithWineData} />
                        ),
                    },
                ]}
            />
        </Container>
    );
};

// * Export Widget Configuration:
export const config = defineWidgetConfig({
    zone: "product.details.side.before",
});

// * Export default Form:
export default CustomDetailWidget;
