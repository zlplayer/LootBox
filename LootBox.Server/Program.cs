using LootBox.Infrastructure;
using Microsoft.EntityFrameworkCore;
using LootBox.Infrastructure.Extensions;
using LootBox.Infrastructure.Seeders;
using LootBox.Application.Extensions;
using Microsoft.OpenApi.Models;
using LootBox.Server;
using Microsoft.AspNetCore.Http.Features;



var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApplication();

var app = builder.Build();


var scope=app.Services.CreateScope();
var seeder=scope.ServiceProvider.GetRequiredService<LootBoxSeeder>();
seeder.Seed();


app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
