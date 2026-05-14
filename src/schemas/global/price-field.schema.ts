import z from "zod";

export const inputNumberFieldSchema = (
    min: number = 0,
    max: number = 999999999999,
) => {
    return z.string().nullable().refine((val) => {
        // allow empty string
        if (val === "" || val == null) return true;

        // validate only if not empty
        if (!/^[0-9]\d*$/.test(val)) return false;

        const num = Number(val);

        return num >= min && num <= max;
    }, {
        message: `Veuillez saisir un entier positif entre ${min} et ${max}`,
    });
};