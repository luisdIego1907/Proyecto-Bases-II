import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
    User,
    Phone,
    Mail,
    MapPin,
    BadgeCheck,
} from "lucide-react";

import type { ClientListItem } from "../../data/client";
import { getClientes } from "../../services/ClientService";

import BackButton from "../../shared/BackButton";

export default function ClientProfile() {
    const { id } = useParams();

    const [client, setClient] = useState<ClientListItem>();

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    useEffect(() => {
        async function loadClient() {
            if (!id) {
                setLoading(false);
                return;
            }

            try {
                const clients = await getClientes();

                const found = clients.find(
                    (c) => c.clienteResourceId === id
                );

                if (!found) {
                    setError("Cliente no encontrado.");
                    return;
                }

                setClient(found);
            } catch (err) {
                console.error(err);

                setError(
                    "No se pudo cargar la información del cliente."
                );
            } finally {
                setLoading(false);
            }
        }

        void loadClient();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-24">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-600 border-t-transparent" />

                <h2 className="mt-6 text-xl font-semibold text-slate-700">
                    Cargando cliente...
                </h2>
            </div>
        );
    }

    if (error || !client) {
        return (
            <div className="flex justify-center py-24">
                <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
                    <h2 className="text-xl font-semibold text-red-700">
                        {error}
                    </h2>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 px-6 py-8">
            <div className="mx-auto max-w-5xl">

                <BackButton />

                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">

                    <div className="bg-gradient-to-r from-cyan-600 to-cyan-500 px-10 py-10">

                        <div className="flex flex-col items-center gap-5 md:flex-row">

                            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white text-4xl font-bold text-cyan-600 shadow-lg">
                                {client.nombre.charAt(0).toUpperCase()}
                            </div>

                            <div className="flex-1 text-white">

                                <h1 className="text-4xl font-bold">
                                    {client.nombre}
                                </h1>

                                <div className="mt-4 flex flex-wrap gap-3">

                                    <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur">
                                        {client.rolCliente}
                                    </span>

                                    {client.activo ? (
                                        <span className="rounded-full bg-green-500 px-4 py-2 text-sm font-semibold text-white">
                                            Activo
                                        </span>
                                    ) : (
                                        <span className="rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white">
                                            Inactivo
                                        </span>
                                    )}

                                </div>

                            </div>

                        </div>

                    </div>

                    <div className="p-10">

                        <h2 className="mb-8 text-2xl font-bold text-slate-800">
                            Información del cliente
                        </h2>

                        <div className="grid gap-6 md:grid-cols-2">

                            <InfoCard
                                icon={<User size={20} />}
                                title="Nombre"
                                value={client.nombre}
                            />

                            <InfoCard
                                icon={<BadgeCheck size={20} />}
                                title="Rol"
                                value={client.rolCliente}
                            />

                            <InfoCard
                                icon={<Mail size={20} />}
                                title="Correo electrónico"
                                value={client.correo || "-"}
                            />

                            <InfoCard
                                icon={<Phone size={20} />}
                                title="Teléfono"
                                value={client.telefono || "-"}
                            />

                            <div className="md:col-span-2">
                                <InfoCard
                                    icon={<MapPin size={20} />}
                                    title="Dirección"
                                    value={client.direccion || "-"}
                                />
                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}

type CardProps = {
    icon: React.ReactNode;
    title: string;
    value: string;
};

function InfoCard({
    icon,
    title,
    value,
}: CardProps) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:border-cyan-300 hover:shadow-md">

            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600">
                {icon}
            </div>

            <p className="text-sm font-medium text-slate-500">
                {title}
            </p>

            <p className="mt-2 break-words text-lg font-semibold text-slate-800">
                {value}
            </p>

        </div>
    );
}