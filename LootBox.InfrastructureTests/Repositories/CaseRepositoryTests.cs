using LootBox.Domain.Entities;
using LootBox.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using Xunit;
using Assert = Xunit.Assert;
using System.Linq;
using LootBox.Infrastructure;

namespace LootBox.Tests.Repositories
{
    public class CaseRepositoryTests
    {
        private LootBoxDbContext GetDbContext()
        {
            var options = new DbContextOptionsBuilder<LootBoxDbContext>()
                .UseInMemoryDatabase(databaseName: "LootBoxTestDb")
                .Options;

            return new LootBoxDbContext(options);
        }

        [Fact]
        public async Task Create_ShouldAddNewCase()
        {
            // Arrange
            var dbContext = GetDbContext();
            var repository = new CaseRepository(dbContext);
            var newCase = new Case {Name = "Test Case", Image = "TestCase.img", Price = 10 };

            // Act
            await repository.Create(newCase);
            var allCases = await repository.GetAllCase();

            // Assert
            Assert.Single(allCases);
            Assert.Equal("Test Case", allCases.First().Name);
        }

        [Fact]
        public async Task GetCaseById_ShouldReturnCase_WhenCaseExists()
        {
            // Arrange
            var dbContext = GetDbContext();
            var repository = new CaseRepository(dbContext);
            var newCase = new Case { Name = "Existing Case", Image = "TestCase.img", Price = 10 };
            await repository.Create(newCase);

            // Act
            var retrievedCase = await repository.GetCaseById(newCase.Id);

            // Assert
            Assert.NotNull(retrievedCase);
            Assert.Equal("Existing Case", retrievedCase.Name);
        }

        [Fact]
        public async Task Update_ShouldModifyCase()
        {
            // Arrange
            var dbContext = GetDbContext();
            var repository = new CaseRepository(dbContext);
            var newCase = new Case {Name = "Initial Case", Image = "TestCase.img", Price = 10 };
            await repository.Create(newCase);

            // Act
            newCase.Name = "Updated Case";
            await repository.Update(newCase);
            var updatedCase = await repository.GetCaseById(newCase.Id);

            // Assert
            Assert.NotNull(updatedCase);
            Assert.Equal("Updated Case", updatedCase.Name);
        }

        [Fact]
        public async Task Delete_ShouldRemoveCase()
        {
            // Arrange
            var dbContext = GetDbContext();
            var repository = new CaseRepository(dbContext);
            var newCase = new Case {Name = "Case to Delete", Image = "TestCase.img", Price = 10 };
            await repository.Create(newCase);

            // Act
            await repository.Delete(newCase.Id);
            var retrievedCase = await repository.GetCaseById(newCase.Id);

            // Assert
            Assert.Null(retrievedCase);
        }


        [Fact]
        public async Task DeleteItemInCase_ShouldRemoveItemFromCase()
        {
            // Arrange
            var dbContext = GetDbContext();
            var repository = new CaseRepository(dbContext);
            var newCase = new Case { Name = "Test Case", Image="TestCase.img", Price=10 };
            var newItem = new Item { Name = "Item to Remove",Image="ttestItem.img" };

            await dbContext.Cases.AddAsync(newCase);
            await dbContext.Items.AddAsync(newItem);
            await dbContext.SaveChangesAsync();

            await repository.AddItemToCase(newCase.Id, newItem.Id);
            var caseAndItem = await repository.GetItemsByCaseIdAndItemId(newCase.Id, newItem.Id);

            // Act
            await repository.DeleteItemInCase(caseAndItem);
            var items = await repository.GetItemsByCaseId(newCase.Id);

            // Assert
            Assert.Empty(items);
        }
    }
}
