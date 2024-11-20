using Xunit;
using Assert = Xunit.Assert;
using LootBox.Server.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LootBox.Application.Interfaces;
using Moq;
using LootBox.Application.Dtos;
using Microsoft.AspNetCore.Mvc;

namespace LootBox.Server.Controllers.Tests
{
    public class WearRatingControllerTests
    {
        private readonly Mock<IWearRatingService> _wearRatingServiceMock;
        private readonly WearRatingController _controller;

        public WearRatingControllerTests()
        {
            _wearRatingServiceMock = new Mock<IWearRatingService>();
            _controller = new WearRatingController(_wearRatingServiceMock.Object);
        }

        [Fact]
        public async Task GetAllWearRating_ShouldReturnOkWithWearRatings()
        {
            // Arrange
            var wearRatings = new List<WearRatingDto>
            {
                new WearRatingDto { Id = 1, Name = "Pristine" },
                new WearRatingDto { Id = 2, Name = "Worn" }
            };
            _wearRatingServiceMock.Setup(s => s.GetAllWearRating()).ReturnsAsync(wearRatings);

            // Act
            var result = await _controller.GetAllWearRating();

            // Assert
            var actionResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200, actionResult.StatusCode);
            var returnedWearRatings = Assert.IsType<List<WearRatingDto>>(actionResult.Value);
            Assert.Equal(wearRatings.Count, returnedWearRatings.Count);
            Assert.Equal("Pristine", returnedWearRatings[0].Name);
        }

        [Fact]
        public async Task GetWearRatingById_ShouldReturnOkWithWearRating()
        {
            // Arrange
            var wearRatingId = 1;
            var wearRating = new WearRatingDto { Id = wearRatingId, Name = "Pristine" };
            _wearRatingServiceMock.Setup(s => s.GetWearRatingById(wearRatingId)).ReturnsAsync(wearRating);

            // Act
            var result = await _controller.GetWearRatingById(wearRatingId);

            // Assert
            var actionResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(200, actionResult.StatusCode);
            var returnedWearRating = Assert.IsType<WearRatingDto>(actionResult.Value);
            Assert.Equal("Pristine", returnedWearRating.Name);
        }

        [Fact]
        public async Task CreateWearRating_ShouldReturnOk()
        {
            // Arrange
            var wearRatingDto = new WearRatingDto { Name = "Pristine" };
            _wearRatingServiceMock.Setup(s => s.Create(wearRatingDto)).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.CreateWearRating(wearRatingDto);

            // Assert
            var actionResult = Assert.IsType<OkResult>(result);
            Assert.Equal(200, actionResult.StatusCode);
        }

        [Fact]
        public async Task UpdateWearRating_ShouldReturnOk()
        {
            // Arrange
            var wearRatingId = 1;
            var wearRatingDto = new WearRatingDto { Name = "Updated Rating" };
            _wearRatingServiceMock.Setup(s => s.Update(wearRatingId, wearRatingDto)).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.UpdateWearRating(wearRatingId, wearRatingDto);

            // Assert
            var actionResult = Assert.IsType<OkResult>(result);
            Assert.Equal(200, actionResult.StatusCode);
        }

        [Fact]
        public async Task DeleteWearRating_ShouldReturnOk()
        {
            // Arrange
            var wearRatingId = 1;
            _wearRatingServiceMock.Setup(s => s.Delete(wearRatingId)).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.DeleteWearRating(wearRatingId);

            // Assert
            var actionResult = Assert.IsType<OkResult>(result);
            Assert.Equal(200, actionResult.StatusCode);
        }

    }
}