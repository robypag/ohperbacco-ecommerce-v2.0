import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Badge, DataTableRowSelectionState, Heading, toast } from "@medusajs/ui";
import { WineProduct, WineSyncStatus, SyncronizedWineList } from "../../../../modules/wine-data/types";
import {
    createDataTableColumnHelper,
    createDataTableFilterHelper,
    createDataTableCommandHelper,
    DataTablePaginationState,
    DataTableFilteringState,
    DataTableSortingState,
    useDataTable,
    DataTable,
} from "@medusajs/ui";
import { useMemo, useState } from "react";
import { sdk } from "../../../lib/config";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SingleColumnLayout } from "../../../shared/widget-single-column-layout";
import { Container } from "../../../shared/widget-container";
import { Link } from "react-router-dom";

type WinesResponse = {
    wines: WineProduct[];
    count: number;
    limit: number;
    offset: number;
};

const columnHelper = createDataTableColumnHelper<SyncronizedWineList>();

const columns = [
    columnHelper.select(),
    columnHelper.accessor("id", {
        header: "Wine ID",
    }),
    columnHelper.accessor("product.title", {
        header: "Nome Prodotto Correlato",
    }),
    columnHelper.accessor("produttore", {
        header: "Produttore",
        // Enables sorting for the column.
        enableSorting: true,
        // If omitted, the header will be used instead if it's a string,
        // otherwise the accessor key (id) will be used.
        sortLabel: "Produttore",
        // If omitted the default value will be "A-Z"
        sortAscLabel: "A-Z",
        // If omitted the default value will be "Z-A"
        sortDescLabel: "Z-A",
    }),
    columnHelper.accessor("product.id", {
        header: "ID Prodotto Correlato",
        cell: ({ getValue }) => (
            <Link
                to={{
                    pathname: `/products/${getValue()}`,
                }}
                className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover transition-fg"
            >
                {getValue()}
            </Link>
        ),
    }),
    columnHelper.accessor("synced", {
        header: "Sincronizzato",
        cell: ({ getValue }) => {
            const synced = getValue();
            return (
                <Badge color={synced === "synced" ? "green" : "red"} size="xsmall">
                    {synced === "synced" ? "Sincronizzato" : "Non sincronizzato"}
                </Badge>
            );
        },
    }),
];

const filterHelper = createDataTableFilterHelper<WineProduct>();
const filters = [
    filterHelper.accessor("synced", {
        type: "select",
        label: "Stato Sync",
        options: [
            {
                label: "Sincronizzato",
                value: "synced",
            },
            {
                label: "Non Sincronizzato",
                value: "not-synced",
            },
        ],
    }),
];

const limit = 15;

const NestedProductsPage = () => {
    const [pagination, setPagination] = useState<DataTablePaginationState>({
        pageSize: limit,
        pageIndex: 0,
    });
    const [search, setSearch] = useState<string>("");
    const [filtering, setFiltering] = useState<DataTableFilteringState>({});
    const [sorting, setSorting] = useState<DataTableSortingState | null>(null);
    const offset = useMemo(() => {
        return pagination.pageIndex * limit;
    }, [pagination]);
    const statusFilters = useMemo(() => {
        return (filtering.synced || []) as WineSyncStatus;
    }, [filtering]);
    const [rowSelection, setRowSelection] = useState<DataTableRowSelectionState>({});
    const queryClient = useQueryClient();

    // Create a mutation hook
    const syncMutation = useMutation({
        mutationFn: async (wineToSynchronize: string[]) => {
            // Show loading toast and store its ID
            const toastId = toast.loading("Sincronizzazione in corso...");

            try {
                const result = await sdk.client.fetch(`/admin/wines/sync`, {
                    method: "POST",
                    body: wineToSynchronize,
                });
                // Update the loading toast to success
                toast.success("Sincronizzazione completata con successo", {
                    id: toastId,
                });
                return result;
            } catch (error) {
                // Update the loading toast to error
                toast.error("Errore durante la sincronizzazione", {
                    id: toastId,
                });
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["wines"] });
            setRowSelection({});
        },
    });

    const commandHelper = createDataTableCommandHelper();
    const useCommands = () => {
        return [
            commandHelper.command({
                label: "Resync",
                shortcut: "R",
                action: async (selection) => {
                    const wineToSynchronize = Object.keys(selection);
                    syncMutation.mutate(wineToSynchronize);
                },
            }),
        ];
    };
    const commands = useCommands();

    // Data Fetching:
    const queryKey = [
        "wines",
        {
            limit,
            offset,
            search,
            statusFilters,
            sortId: sorting?.id,
            sortDesc: sorting?.desc,
        },
    ];
    const { data, isLoading } = useQuery<WinesResponse>({
        queryFn: () =>
            sdk.client.fetch(`/admin/wines`, {
                query: {
                    limit,
                    offset,
                    filters: {
                        synced: [statusFilters],
                    },
                },
            }),
        queryKey: queryKey,
    });

    const table = useDataTable({
        columns,
        data: data?.wines || [],
        getRowId: (row) => row.id,
        rowCount: data?.count || 0,
        isLoading,
        commands,
        pagination: {
            state: pagination,
            onPaginationChange: setPagination,
        },
        search: {
            state: search,
            onSearchChange: setSearch,
        },
        filtering: {
            state: filtering,
            onFilteringChange: setFiltering,
        },
        filters: filters,
        sorting: {
            // Pass the pagination state and updater to the table instance
            state: sorting,
            onSortingChange: setSorting,
        },
        rowSelection: {
            state: rowSelection,
            onRowSelectionChange: setRowSelection,
        },
    });

    return (
        <SingleColumnLayout>
            <Container>
                <DataTable instance={table}>
                    <DataTable.Toolbar className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
                        <Heading>Vini (VectorDB)</Heading>
                        <div className="flex gap-2">
                            <DataTable.FilterMenu tooltip="Filter" />
                            <DataTable.SortingMenu tooltip="Sort" />
                            <DataTable.Search placeholder="Search..." />
                        </div>
                    </DataTable.Toolbar>
                    <DataTable.Table />
                    <DataTable.Pagination />
                    <DataTable.CommandBar selectedLabel={(count) => `${count} selezionati`} />
                </DataTable>
            </Container>
        </SingleColumnLayout>
    );
};

export const config = defineRouteConfig({
    label: "Sync Vini (MongoDB)",
    nested: "/products",
});

export default NestedProductsPage;
