using LootBox.Domain.Entities;
using LootBox.Infrastructure;
using LootBox.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Moq;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using Assert = Xunit.Assert;

public class EquipmentRepositoryTests
{
    private readonly DbContextOptions<LootBoxDbContext> _dbContextOptions;

    public EquipmentRepositoryTests()
    {
        // Configure mock DbContext
        _dbContextOptions = new DbContextOptionsBuilder<LootBoxDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDatabase")
            .Options;
    }


    [Fact]
    public async Task GetEquipmentById_ShouldReturnCorrectEquipment()
    {
        // Arrange
        using var dbContext = new LootBoxDbContext(_dbContextOptions);
        var repository = new EquipmentRepository(dbContext);

        var equipmentId = 1;

        // Dodaj przykładowe dane
        dbContext.Equipments.Add(new Equipment { Id = equipmentId, ItemId = 1, UserId = 1 });
        await dbContext.SaveChangesAsync();

        // Act
        var result = await repository.GetEquipmentById(equipmentId);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(equipmentId, result.Id);
    }


    [Fact]
    public async Task Create_ShouldAddNewEquipment()
    {
        // Arrange
        using var dbContext = new LootBoxDbContext(_dbContextOptions);
        var repository = new EquipmentRepository(dbContext);
        var itemId = 1;
        var userId = 1;

        // Act
        await repository.Create(itemId, userId);

        // Assert
        var equipment = await dbContext.Equipments.FirstOrDefaultAsync();
        Assert.NotNull(equipment);
        Assert.Equal(itemId, equipment.ItemId);
        Assert.Equal(userId, equipment.UserId);
    }

    [Fact]
    public async Task Delete_ShouldRemoveEquipment()
    {
        // Arrange
        using var dbContext = new LootBoxDbContext(_dbContextOptions);
        var repository = new EquipmentRepository(dbContext);

        var equipmentId = 1;

        // Dodaj przykładowe dane
        dbContext.Equipments.Add(new Equipment { Id = equipmentId, ItemId = 1, UserId = 1 });
        await dbContext.SaveChangesAsync();

        // Act
        await repository.Delete(equipmentId);

        // Assert
        var equipment = await dbContext.Equipments.FirstOrDefaultAsync(e => e.Id == equipmentId);
        Assert.Null(equipment);
    }

}
