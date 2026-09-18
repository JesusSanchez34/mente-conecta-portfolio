import React, { useMemo, useState } from "react";
import DataTable from "react-data-table-component";
import { Filter } from '../../../ui';

export function TablePrincipalDashboard(props) {

    const columns = [
        {
            name: "Nombre",
            selector: (row) => row.nombre,
            sortable: true,
        },
        {
            name: "Registrado en",
            selector: (row) => row.hospital,
            sortable: true,
        },
        {
            name: "Correo",
            selector: (row) => row.correo,
        },
        {
            name: "Edad",
            selector: (row) => row.edad || "NO PROPORCIONADA",
            sortable: true,
        },
        {
            name: "Género",
            selector: (row) => row.genero || "NO PROPORCIONADO",
            sortable: true,
        },
        {
            name: "Ocupación",
            selector: (row) => row.ocupacion.toUpperCase() || "NO PROPORCIONADO",
            sortable: true,
        },
        {
            name: "Teléfono de casa",
            selector: (row) => row.telefono_casa || "NO PROPORCIONADO",
        },
        {
            name: "Teléfono móvil",
            selector: (row) => row.telefono_movil,
        },
    ];

    const [filterText, setFilterText] = useState("");
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

    const filteredItems = props.data
        ? props.data.filter(
            (item) =>
                JSON.stringify(item)
                    .toLowerCase()
                    .indexOf(filterText.toLowerCase()) !== -1
        )
        : "";

    const subHeaderComponent = useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText("");
            }
        };

        return (
            <Filter
                onFilter={(e) => setFilterText(e.target.value)}
                onClear={handleClear}
                filterText={filterText}
            />
        );
    }, [filterText, resetPaginationToggle]);

    return (
        <DataTable
            columns={columns}
            data={filteredItems}
            defaultSortField="nombre"
            striped
            pagination
            subHeader
            subHeaderComponent={subHeaderComponent}
        />
    );
}
