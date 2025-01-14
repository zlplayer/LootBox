//using AutoMapper;
//using LootBox.Application.Dtos;
//using LootBox.Application.Services;
//using LootBox.Domain.Entities;
//using LootBox.Domain.Interfaces;
//using Moq;
//using System.Collections.Generic;
//using System.Threading.Tasks;
//using Xunit;
//using FluentAssertions;

//namespace LootBox.Tests.Application.Services
//{
//    public class EquipmentServiceTests
//    {
//        private readonly Mock<IEquipmentRepository> _equipmentRepositoryMock;
//        private readonly Mock<IMapper> _mapperMock;
//        private readonly EquipmentService _equipmentService;

//        public EquipmentServiceTests()
//        {
//            _equipmentRepositoryMock = new Mock<IEquipmentRepository>();
//            _mapperMock = new Mock<IMapper>();
//            _equipmentService = new EquipmentService(_mapperMock.Object, _equipmentRepositoryMock.Object);
//        }

//        [Fact]
//        public async Task GetEquipmentById_ShouldReturnNull_WhenEquipmentDoesNotExist()
//        {
//            // Arrange
//            int equipmentId = 1;

//            _equipmentRepositoryMock.Setup(repo => repo.GetEquipmentById(equipmentId)).ReturnsAsync((Equipment)null);

//            // Act
//            var result = await _equipmentService.GetEquipmentById(equipmentId);

//            // Assert
//            result.Should().BeNull();
//            _equipmentRepositoryMock.Verify(repo => repo.GetEquipmentById(equipmentId), Times.Once);
//        }

//        [Fact]
//        public async Task Create_ShouldCallRepositoryCreate_WhenCalled()
//        {
//            // Arrange
//            int itemId = 2;
//            int userId = 1;

//            _equipmentRepositoryMock.Setup(repo => repo.Create(itemId, userId)).Returns(Task.CompletedTask);

//            // Act
//            await _equipmentService.Create(itemId, userId);

//            // Assert
//            _equipmentRepositoryMock.Verify(repo => repo.Create(itemId, userId), Times.Once);
//        }

//        [Fact]
//        public async Task Delete_ShouldCallRepositoryDelete_WhenEquipmentExists()
//        {
//            // Arrange
//            int equipmentId = 1;
//            var equipment = new Equipment { Id = equipmentId, ItemId = 2, UserId = 1 };

//            _equipmentRepositoryMock.Setup(repo => repo.GetEquipmentById(equipmentId)).ReturnsAsync(equipment);
//            _equipmentRepositoryMock.Setup(repo => repo.Delete(equipmentId)).Returns(Task.CompletedTask);

//            // Act
//            await _equipmentService.Delete(equipmentId);

//            // Assert
//            _equipmentRepositoryMock.Verify(repo => repo.Delete(equipmentId), Times.Once);
//        }

//        [Fact]
//        public async Task Delete_ShouldThrowException_WhenEquipmentDoesNotExist()
//        {
//            // Arrange
//            int equipmentId = 1;

//            _equipmentRepositoryMock.Setup(repo => repo.GetEquipmentById(equipmentId)).ReturnsAsync((Equipment)null);

//            // Act
//            var act = async () => await _equipmentService.Delete(equipmentId);

//            // Assert
//            await act.Should().ThrowAsync<Exception>().WithMessage("Equipment not found");
//            _equipmentRepositoryMock.Verify(repo => repo.Delete(equipmentId), Times.Never);
//        }
//    }
//}
