using System.Data;
using System.Data.Common;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.StoreProcedure;

public class StoredProcedureExecutor
{
    private readonly AppDbContext context;

    public StoredProcedureExecutor(AppDbContext context)
    {
        this.context = context;
    }

    public async Task<List<T>> QueryAsync<T>(
        string procedureName,
        Func<DbDataReader, T> mapper,
        params StoredProcedureParameter[] parameters)
    {
        var results = new List<T>();
        var connection = context.Database.GetDbConnection();

        var shouldCloseConnection = connection.State != ConnectionState.Open;

        if (shouldCloseConnection)
        {
            await connection.OpenAsync();
        }

        await using var command = connection.CreateCommand();
        command.CommandText = procedureName;
        command.CommandType = CommandType.StoredProcedure;

        AddParameters(command, parameters);

        await using var reader = await command.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            results.Add(mapper(reader));
        }

        if (shouldCloseConnection)
        {
            await connection.CloseAsync();
        }

        return results;
    }

    public async Task<T?> QuerySingleOrDefaultAsync<T>(
        string procedureName,
        Func<DbDataReader, T> mapper,
        params StoredProcedureParameter[] parameters)
    {
        var results = await QueryAsync(procedureName, mapper, parameters);
        return results.FirstOrDefault();
    }

    public async Task<int> ExecuteAsync(
        string procedureName,
        params StoredProcedureParameter[] parameters)
    {
        var connection = context.Database.GetDbConnection();

        var shouldCloseConnection = connection.State != ConnectionState.Open;

        if (shouldCloseConnection)
        {
            await connection.OpenAsync();
        }

        await using var command = connection.CreateCommand();
        command.CommandText = procedureName;
        command.CommandType = CommandType.StoredProcedure;

        AddParameters(command, parameters);

        var affectedRows = await command.ExecuteNonQueryAsync();

        if (shouldCloseConnection)
        {
            await connection.CloseAsync();
        }

        return affectedRows;
    }

    private static void AddParameters(
        DbCommand command,
        StoredProcedureParameter[] parameters)
    {
        foreach (var parameter in parameters)
        {
            var dbParameter = command.CreateParameter();
            dbParameter.ParameterName = parameter.Name;
            dbParameter.Value = parameter.Value ?? DBNull.Value;

            command.Parameters.Add(dbParameter);
        }
    }

}
