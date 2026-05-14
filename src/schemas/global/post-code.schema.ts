import z from "zod";

export const PostCodeSchema = z.string().nullable().refine((val) => {
    if (val === "" || val == null) return true;

    return /^\d{5}$/.test(val);
}, {
    message: "Le code postal doit contenir 5 chiffres",
});