//using Xunit;
//using LootBox.Application.Services;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;
//using FluentAssertions;
//using LootBox.Application.Dtos;
//using LootBox.Domain.Entities;
//using Moq;
//using LootBox.Domain.Exceptions;
//using AutoMapper;
//using LootBox.Domain.Interfaces;
//using LootBox.Application.Interfaces;
//using Assert = Xunit.Assert;

//namespace LootBox.Application.Services.Tests
//{
//    public class CaseServiceTests
//    {
//        private readonly Mock<IMapper> _mapperMock;
//        private readonly Mock<ICaseRepository> _caseRepositoryMock;
//        private readonly Mock<Random> _randomMock;
//        private readonly CaseService _caseService;
//        public CaseServiceTests()
//        {
//            _mapperMock = new Mock<IMapper>();
//            _caseRepositoryMock = new Mock<ICaseRepository>();
//            _randomMock = new Mock<Random>();

//            _caseService = new CaseService(_mapperMock.Object, _caseRepositoryMock.Object, _randomMock.Object);

//        }

//        [Fact]
//        public async Task GetCaseById_ShouldReturnCase_WhenCaseExists()
//        {
//            // Arrange
//            var caseId = 1;
//            var caseEntity = new Case
//            {
//                Id = caseId,
//                Name = "Test Case"
//            };
//            var caseDto = new CaseDto
//            {
//                Id = caseId,
//                Name = "Test Case"
//            };

//            _caseRepositoryMock
//                .Setup(repo => repo.GetCaseById(caseId))
//                .ReturnsAsync(caseEntity);

//            _mapperMock
//                .Setup(mapper => mapper.Map<CaseDto>(caseEntity))
//                .Returns(caseDto);

//            var caseService = new CaseService(_mapperMock.Object, _caseRepositoryMock.Object, _randomMock.Object);

//            // Act
//            var result = await caseService.GetCaseById(caseId);

//            // Assert
//            result.Should().BeEquivalentTo(caseDto);
//            _caseRepositoryMock.Verify(repo => repo.GetCaseById(caseId), Times.Once);
//            _mapperMock.Verify(mapper => mapper.Map<CaseDto>(caseEntity), Times.Once);
//        }
//        [Fact]
//        public async Task GetCaseById_ShouldThrowNotFoundException_WhenCaseDoesNotExist()
//        {
//            // Arrange
//            var caseId = 1;

//            _caseRepositoryMock
//                .Setup(repo => repo.GetCaseById(caseId))
//                .ReturnsAsync((Case)null);

//            var caseService = new CaseService(_mapperMock.Object, _caseRepositoryMock.Object, _randomMock.Object);

//            // Act & Assert
//            await Assert.ThrowsAsync<NotFoundException>(() => caseService.GetCaseById(caseId));

//            _caseRepositoryMock.Verify(repo => repo.GetCaseById(caseId), Times.Once);
//            _mapperMock.Verify(mapper => mapper.Map<CaseDto>(It.IsAny<Case>()), Times.Never);
//        }
//        [Fact]
//        public async Task DrawItemFromCase_ShouldThrowNotFoundException_WhenNoItemsInCase()
//        {
//            // Arrange
//            var caseId = 1;
//            var emptyItemsList = new List<Item>();

//            _caseRepositoryMock
//                .Setup(repo => repo.GetItemsByCaseId(caseId))
//                .ReturnsAsync(emptyItemsList);

//            var caseService = new CaseService(_mapperMock.Object, _caseRepositoryMock.Object, _randomMock.Object);

//            // Act & Assert
//            await Assert.ThrowsAsync<NotFoundException>(() => caseService.DrawItemFromCase(caseId));

//            _caseRepositoryMock.Verify(repo => repo.GetItemsByCaseId(caseId), Times.Once);
//        }
//        [Fact]
//        public async Task DrawItemFromCase_ShouldReturnItem_WhenItemsExist()
//        {
//            // Arrange
//            var caseId = 1;
//            var itemList = new List<Item>
//    {
//        new Item { Id = 1, Name = "Item1", Rarity = new Rarity { Id = 1, Percent = 50 } },
//        new Item { Id = 2, Name = "Item2", Rarity = new Rarity { Id = 2, Percent = 50 } }
//    };
//            var itemDto = new ItemDto { Id = 1, Name = "Item1" };

//            _caseRepositoryMock
//                .Setup(repo => repo.GetItemsByCaseId(caseId))
//                .ReturnsAsync(itemList);

//            _mapperMock
//                .Setup(mapper => mapper.Map<ItemDto>(It.IsAny<Item>()))
//                .Returns(itemDto);

//            _randomMock
//                .Setup(random => random.Next(It.IsAny<int>()))
//                .Returns(0); // Zawsze wybiera pierwszy element

//            var caseService = new CaseService(_mapperMock.Object, _caseRepositoryMock.Object, _randomMock.Object);

//            // Act
//            var result = await caseService.DrawItemFromCase(caseId);

//            // Assert
//            result.Should().BeEquivalentTo(itemDto);
//            _caseRepositoryMock.Verify(repo => repo.GetItemsByCaseId(caseId), Times.Once);
//            _mapperMock.Verify(mapper => mapper.Map<ItemDto>(itemList.First()), Times.Once);
//        }

//    }
//}