using System.Data.Common;

namespace Infrastructure.StoreProcedure;

public static class DbReaderExtensions
{
    public static int GetInt(this DbDataReader reader, string columnName)
    {
        return Convert.ToInt32(reader[columnName]);
    }

    public static string GetStringValue(this DbDataReader reader, string columnName)
    {
        return Convert.ToString(reader[columnName]) ?? string.Empty;
    }

    public static string? GetNullableString(this DbDataReader reader, string columnName)
    {
        var value = reader[columnName];

        return value == DBNull.Value
            ? null
            : Convert.ToString(value);
    }

    public static bool GetBoolValue(this DbDataReader reader, string columnName)
    {
        return Convert.ToBoolean(reader[columnName]);
    }

    public static DateTime GetDateTimeValue(this DbDataReader reader, string columnName)
    {
        return Convert.ToDateTime(reader[columnName]);
    }

    public static Guid GetGuidValue(this DbDataReader reader, string columnName)
    {
        var value = reader[columnName];

        if (value is Guid guid)
        {
            return guid;
        }

        return Guid.Parse(Convert.ToString(value)!);
    }
}
