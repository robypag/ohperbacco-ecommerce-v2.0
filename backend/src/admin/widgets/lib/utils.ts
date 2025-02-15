import * as zod from "zod";

const createRequiredString = (fieldName: string, minLength = 1) => {
    return zod
        .string({
            required_error: `${fieldName} è obbligatorio`,
            invalid_type_error: `${fieldName} deve essere una stringa`,
        })
        .min(minLength, { message: `${fieldName} deve essere di almeno ${minLength} caratteri` })
        .nullable()
        .refine((val) => val !== null, { message: `${fieldName} è obbligatorio` });
};

const createRequiredNumber = (fieldName: string, min = 1, max?: number) => {
    return zod
        .number({
            required_error: `${fieldName} è obbligatorio`,
            invalid_type_error: `${fieldName} deve essere un numero`,
        })
        .min(min, { message: `${fieldName} deve essere almeno ${min}` })
        .max(max ?? 99, { message: `${fieldName} deve essere al massimo ${max}` })
        .nullable()
        .refine((val) => val !== null, { message: `${fieldName} è obbligatorio` });
};

export const editWineSchema = zod.object({
    vitigni: createRequiredString("Vitigni", 5),
    regione: createRequiredString("Regione", 3),
    gradazione_alcolica: createRequiredNumber("Gradazione Alcolica", 1, 99),
    colore: createRequiredString("Colore", 5),
    profumo: createRequiredString("Profumo", 5),
    gusto: createRequiredString("Gusto", 5),
    caratteristiche: createRequiredString("Caratteristiche", 50),
    abbinamenti: createRequiredString("Abbinamenti", 20),
    eventi: createRequiredString("Eventi", 20),
    vinificazione: createRequiredString("Vinificazione", 20),
    affinamento: createRequiredString("Affinamento", 20),
    ecosostenibile: zod.boolean().optional(),
});

type WineFormSchemaType = zod.infer<typeof editWineSchema>;
type FieldNames = keyof WineFormSchemaType;

const getFieldType = (fieldName: string): string => {
    if (fieldName === "gradazione_alcolica") return "number";
    if (
        fieldName === "abbinamenti" ||
        fieldName === "eventi" ||
        fieldName === "caratteristiche" ||
        fieldName === "vinificazione" ||
        fieldName === "affinamento"
    )
        return "textarea";
    if (fieldName === "ecosostenibile") return "switch";
    return "text";
};

export const fieldList = Object.entries(editWineSchema.shape).map(([key, _]) => ({
    name: key as FieldNames,
    label:
        key.charAt(0).toUpperCase() +
        key
            .slice(1)
            .replace(/([A-Z])/g, " $1")
            .replace(/_/g, " ")
            .trim(),
    type: getFieldType(key),
    placeholder: `Enter ${key
        .toLowerCase()
        .replace(/([A-Z])/g, " $1")
        .trim()}`,
}));

export const typedFieldList: Array<{
    name: FieldNames;
    label: string;
    type: string;
    placeholder: string;
}> = fieldList;
