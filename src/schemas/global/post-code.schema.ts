import z from "zod";

export const PostCodeSchema = z
    .string()
    .regex(/^\d{5}$/, "Le code postal doit contenir 5 chiffres")