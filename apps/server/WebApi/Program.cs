using WebApi.Routes;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGroup("api")
    .MapRoutes();

app.Run();