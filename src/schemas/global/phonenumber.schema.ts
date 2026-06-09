import z from "zod";

/**
 * Reusable Algerian Phone Number Schema
 * Handles:
 * - Local mobile: 05XXXXXXXX, 06XXXXXXXX, 07XXXXXXXX
 * - Local landline: 02X..., 03X..., 04X...
 * - International: +213XXXXXXXXX or 213XXXXXXXXX
 */
export const PhoneNumberSchema = z
    .string()
    .regex(
        /^(\+213|213|0)([567]\d{8}|[123489]\d{7})$/,
        "Numéro de téléphone invalide"
    );