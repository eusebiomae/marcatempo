import { useEffect } from "react";

import AppRoutes from "./router/AppRoutes";

import { useApp } from "./lib/store";

export default function App() {

    const loadEntries = useApp(
        s => s.loadEntries
    );

    useEffect(() => {

        loadEntries();

    }, []);

    return <AppRoutes />;

}