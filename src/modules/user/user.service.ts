import { pool } from "../../db";
import type { Iuser } from "./user.interface";

const createUserOnDB = async(payLoad: Iuser) => {
    const { name, email, password, age } = payLoad;
    const result = await pool.query(
      `
        INSERT INTO users(name, email, password, age) VALUES($1, $2, $3, $4)
        RETURNING *
        `,
      [name, email, password, age],
    );

    return result;
}

export const userService = {
    createUserOnDB,
}