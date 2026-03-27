import z from "zod";

export const inputNumberFieldSchema = (
    min: number = 0,
    max: number = 999999999999
) => {
    return z
        .string()
        .regex(/^[0-9]\d*$/, {
            message: "Veuillez saisir un entier positif",
        })
        .transform((v) => Number(v))
        .refine((val) => val >= min, {
            message: `La valeur doit être supérieure ou égale à ${min}`,
        })
        .refine((val) => val <= max, {
            message: `La valeur doit être inférieure ou égale à ${max}`,
        });
};