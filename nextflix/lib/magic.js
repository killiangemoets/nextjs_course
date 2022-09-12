// magic for server-side

import { Magic } from "@magic-sdk/admin";

export const magicAdmin = new Magic(process.env.MAGIC_PRIVATE_API_KEY); // ✨
