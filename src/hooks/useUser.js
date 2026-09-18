import { useState } from "react";
import { useAuth } from "./useAuth";

import {
    getMeApi,
} from "../api/user";

export function useUser() {
    const [loadingUser, setLoadingUser] = useState(undefined);
    const [errorUser, setErrorUser] = useState(undefined);
    const { auth } = useAuth();

    const getMe = async (token, typeLogin) => {
        try {
            setLoadingUser(true)
            const response = await getMeApi(token, typeLogin);
            setLoadingUser(false)
            return response;
        } catch (error) {
            setErrorUser(error)
            setLoadingUser(false)
            throw error;
        }
    }

    return {
        loadingUser,
        errorUser,
        getMe
    }
}