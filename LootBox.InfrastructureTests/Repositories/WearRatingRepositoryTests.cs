using Xunit;
using Assert = Xunit.Assert;
using LootBox.Infrastructure.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using LootBox.Domain.Entities;

namespace LootBox.Infrastructure.Repositories.Tests
{
    public class WearRatingRepositoryTests
    {
        private readonly DbContextOptions<LootBoxDbContext> _dbContextOptions;
        public WearRatingRepositoryTests()
        {
            _dbContextOptions = new DbContextOptionsBuilder<LootBoxDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDatabase")
            .Options;
        }

        [Fact]
        public async Task GetAllWearRating_ShouldReturnAllWearRatings()
        {
            // Arrange
            using var dbContext = new LootBoxDbContext(_dbContextOptions);
            var repository = new WearRatingRepository(dbContext);

            dbContext.WearRatings.AddRange(
                new WearRating { Id = 1, Name = "Pristine" },
                new WearRating { Id = 2, Name = "Used" }
            );
            await dbContext.SaveChangesAsync();

            // Act
            var result = await repository.GetAllWearRating();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task GetWearRatingById_ShouldReturnCorrectWearRating()
        {
            // Arrange
            using var dbContext = new LootBoxDbContext(_dbContextOptions);
            var repository = new WearRatingRepository(dbContext);

            var wearRatingId = 1;
            dbContext.WearRatings.Add(new WearRating { Id = wearRatingId, Name = "Damaged" });
            await dbContext.SaveChangesAsync();

            // Act
            var result = await repository.GetWearRatingById(wearRatingId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(wearRatingId, result.Id);
            Assert.Equal("Damaged", result.Name);
        }

        [Fact]
        public async Task Create_ShouldAddNewWearRating()
        {
            // Arrange
            using var dbContext = new LootBoxDbContext(_dbContextOptions);
            var repository = new WearRatingRepository(dbContext);

            var wearRating = new WearRating { Name = "Mint" };

            // Act
            await repository.Create(wearRating);

            // Assert
            var result = await dbContext.WearRatings.FirstOrDefaultAsync(w => w.Name == "Mint");
            Assert.NotNull(result);
            Assert.Equal("Mint", result.Name);
        }

        [Fact]
        public async Task Update_ShouldModifyExistingWearRating()
        {
            // Arrange
            using var dbContext = new LootBoxDbContext(_dbContextOptions);
            var repository = new WearRatingRepository(dbContext);

            var wearRating = new WearRating { Id = 1, Name = "Average" };
            dbContext.WearRatings.Add(wearRating);
            await dbContext.SaveChangesAsync();

            // Act
            wearRating.Name = "Above Average";
            await repository.Update(wearRating);

            // Assert
            var result = await dbContext.WearRatings.FirstOrDefaultAsync(w => w.Id == 1);
            Assert.NotNull(result);
            Assert.Equal("Above Average", result.Name);
        }

        [Fact]
        public async Task Delete_ShouldRemoveWearRating()
        {
            // Arrange
            using var dbContext = new LootBoxDbContext(_dbContextOptions);
            var repository = new WearRatingRepository(dbContext);

            var wearRating = new WearRating { Id = 1, Name = "Poor" };
            dbContext.WearRatings.Add(wearRating);
            await dbContext.SaveChangesAsync();

            // Act
            await repository.Delete(wearRating.Id);

            // Assert
            var result = await dbContext.WearRatings.FirstOrDefaultAsync(w => w.Id == 1);
            Assert.Null(result);
        }

    }
}