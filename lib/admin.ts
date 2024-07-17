/* este componente sirve para que solamente el administrador pueda ingresar al dashboard */

import { auth } from "@clerk/nextjs/server"

const adminId = [
    "user_2j4aiCfZxw2IDSodKTllq9w4dmb",
];

export const isAdmin = () => {
    const { userId } = auth();

    if (!userId) {
        return false;
    }

    return adminId.indexOf(userId) !== -1
}