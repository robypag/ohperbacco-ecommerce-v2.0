import { Drawer, Heading, Label, Input, Button, Textarea, toast, Toaster, Switch, Text } from "@medusajs/ui";
import { useForm, FormProvider, Controller } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sdk } from "../../lib/config";
import { AdminProduct, AdminUpdateProduct } from "@medusajs/framework/types";
import { UpdateAdminProductWithWineData } from "../../lib/types";
import { editWineSchema, fieldList } from "../../lib/utils";

export type AdditionalWineData = {
    wine: {
        id: string;
        vitigni?: string;
        regione?: string;
        caratteristiche?: string;
        abbinamenti?: string;
        gradazione_alcolica?: number;
        vinificazione?: string;
        affinamento?: string;
        eventi?: string;
        colore?: string;
        profumo?: string;
        gusto?: string;
        ecosostenibile?: boolean;
        temperatura_servizio?: string;
        bicchiere?: string;
    };
};

export type UpdateWineFormProps = {
    product: AdminProduct & AdditionalWineData;
};

export const EditForm = ({ product }: UpdateWineFormProps) => {
    const form = useForm<zod.infer<typeof editWineSchema>>({
        resolver: zodResolver(editWineSchema),
        defaultValues: product.wine,
    });

    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMutation({
        mutationFn: (updateProduct: AdminUpdateProduct) =>
            sdk.admin.product.update(product.id, updateProduct, {
                fields: "*wine",
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["product", product.id] });
            toast.success("Le informazioni del vino sono state aggiornate con successo");
        },
        onError: (error) => toast.error(error.message || "Errore durante l'aggiornamento"),
    });

    const handleSubmit = form.handleSubmit(
        async (data: zod.infer<typeof editWineSchema>) => {
            const payload: UpdateAdminProductWithWineData = {
                additional_data: {
                    id: product.wine.id,
                    ...(data as Required<typeof data>),
                },
            };
            try {
                console.log(payload);
                await mutateAsync(payload);
            } catch (error: any) {
                //throw new MedusaError(MedusaError.Types.INVALID_DATA, error.message);
            }
        },
        (errors) => {
            console.log(errors);
            toast.error("Errore di validazione", {
                description: "Per favore, correggi le informazioni del vino o riempie i campi obbligatori",
            });
        },
    );

    return (
        <>
            <Toaster />
            <Drawer>
                <Drawer.Trigger asChild>
                    <Button>Aggiorna</Button>
                </Drawer.Trigger>
                <Drawer.Content>
                    <FormProvider {...form}>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSubmit();
                            }}
                            className="flex flex-1 flex-col overflow-hidden"
                        >
                            <Drawer.Header>
                                <Heading className="capitalize">Aggiorna Vino</Heading>
                                <Drawer.Description>
                                    <Heading level="h3">
                                        Al salvataggio di queste informazioni, la descrizione del prodotto verrà
                                        generata da ChatGPT
                                    </Heading>
                                </Drawer.Description>
                            </Drawer.Header>
                            <Drawer.Body className="flex max-w-full flex-1 flex-col gap-y-8 overflow-y-auto">
                                {fieldList.map((field) => (
                                    <Controller
                                        key={field.name}
                                        control={form.control}
                                        name={field.name as keyof zod.infer<typeof editWineSchema>}
                                        render={({ field: fieldProps, fieldState: { error } }) => (
                                            <>
                                                <div className="flex flex-col space-y-2">
                                                    <div className="flex items-center gap-x-1">
                                                        <Label size="small" weight="plus">
                                                            {field.label}
                                                        </Label>
                                                    </div>
                                                    {(() => {
                                                        switch (field.type) {
                                                            case "number":
                                                                return (
                                                                    <Input
                                                                        type="number"
                                                                        value={fieldProps.value as number}
                                                                        onChange={(e) =>
                                                                            fieldProps.onChange(Number(e.target.value))
                                                                        }
                                                                        step={0.5}
                                                                    />
                                                                );
                                                            case "textarea":
                                                                return (
                                                                    <Textarea
                                                                        value={(fieldProps.value as string) || ""}
                                                                        onChange={(e) =>
                                                                            fieldProps.onChange(e.target.value)
                                                                        }
                                                                    />
                                                                );
                                                            case "switch":
                                                                return (
                                                                    <Switch
                                                                        checked={Boolean(fieldProps.value)}
                                                                        onCheckedChange={fieldProps.onChange}
                                                                    />
                                                                );
                                                            case "text":
                                                            default:
                                                                return (
                                                                    <Input
                                                                        value={(fieldProps.value as string) || ""}
                                                                        onChange={(e) =>
                                                                            fieldProps.onChange(e.target.value)
                                                                        }
                                                                    />
                                                                );
                                                        }
                                                    })()}
                                                    {error && (
                                                        <Text size="small" weight="plus" className="text-red-500">
                                                            {error.message}
                                                        </Text>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    />
                                ))}
                            </Drawer.Body>
                            <Drawer.Footer>
                                <Drawer.Close asChild>
                                    <Button size="small" variant="secondary">
                                        Cancel
                                    </Button>
                                </Drawer.Close>
                                <Button type="submit" size="small" isLoading={isPending}>
                                    Save
                                </Button>
                            </Drawer.Footer>
                        </form>
                    </FormProvider>
                </Drawer.Content>
            </Drawer>
        </>
    );
};
