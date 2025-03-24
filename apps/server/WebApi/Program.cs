using WebApi.Routes;

var builder = WebApplication.CreateBuilder(args);

var logLevel = builder.Configuration["Logging:LogLevel:Default"] ?? string.Empty;

var app = builder.Build();

app.MapGroup("api")
    .MapRoutes();

app.Run();