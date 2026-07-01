namespace Api.Security;

public static class AuthorizationPolicies
{
    public const string CanManageUsers = "CanManageUsers";

    // Clientes
    public const string CanReadClients = "CanReadClients";
    public const string CanCreateClients = "CanCreateClients";
    public const string CanUpdateClients = "CanUpdateClients";
    public const string CanDeleteClients = "CanDeleteClients";

    // Productos
    public const string CanReadProducts = "CanReadProducts";
    public const string CanCreateProducts = "CanCreateProducts";
    public const string CanUpdateProducts = "CanUpdateProducts";
    public const string CanDeleteProducts = "CanDeleteProducts";

    // Recepciones
    public const string CanCreateReceptions = "CanCreateReceptions";
    public const string CanReadReceptions = "CanReadReceptions";

    // Despachos
    public const string CanCreateDispatches = "CanCreateDispatches";
    public const string CanProcessDispatches = "CanProcessDispatches";
    public const string CanReadDispatches = "CanReadDispatches";

    // Reportes / auditoría
    public const string CanReadReports = "CanReadReports";
    public const string CanReadAudit = "CanReadAudit";
}
