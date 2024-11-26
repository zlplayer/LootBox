//using Xunit;
//using Assert = Xunit.Assert;
//using LootBox.Server.Controllers;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;
//using LootBox.Application.Interfaces;
//using Moq;
//using LootBox.Application.Dtos;
//using Microsoft.AspNetCore.Mvc;

//namespace LootBox.Server.Controllers.Tests
//{
//    public class CaseControllerTests
//    {
//        private readonly Mock<ICaseService> _caseServiceMock;
//        private readonly CaseController _controller;

//        public CaseControllerTests()
//        {
//            _caseServiceMock = new Mock<ICaseService>();
//            _controller = new CaseController(_caseServiceMock.Object);
//        }

//        [Fact]
//        public async Task Create_ShouldReturnOk()
//        {
//            // Arrange
//            var caseDto = new CaseDto { Name = "Test Case", Image="testcase.img", Price=10 };
//            _caseServiceMock.Setup(s => s.Create(caseDto)).Returns(Task.CompletedTask);

//            // Act
//            var result = await _controller.Create(caseDto);

//            // Assert
//            var actionResult = Assert.IsType<OkResult>(result);
//            Assert.Equal(200, actionResult.StatusCode);
//        }

//        [Fact]
//        public async Task GetAllCase_ShouldReturnOkWithCases()
//        {
//            // Arrange
//            var cases = new List<CaseDto>
//            {
//                new CaseDto { Id = 1, Name = "Case 1", Image = "testcase1.img" },
//                new CaseDto { Id = 2, Name = "Case 2", Image = "testcase2.img" }
//            };
//            _caseServiceMock.Setup(s => s.GetAllCase()).ReturnsAsync(cases);

//            // Act
//            var result = await _controller.GetAllCase();

//            // Assert
//            var actionResult = Assert.IsType<OkObjectResult>(result);
//            Assert.Equal(200, actionResult.StatusCode);
//            Assert.Equal(cases, actionResult.Value);
//        }

//        [Fact]
//        public async Task GetCaseById_ShouldReturnOkWithCase()
//        {
//            // Arrange
//            var caseId = 1;
//            var caseDto = new CaseDto { Id = caseId, Name = "Test Case", Image = "testcase.img" };
//            _caseServiceMock.Setup(s => s.GetCaseById(caseId)).ReturnsAsync(caseDto);

//            // Act
//            var result = await _controller.GetCaseById(caseId);

//            // Assert
//            var actionResult = Assert.IsType<OkObjectResult>(result);
//            Assert.Equal(200, actionResult.StatusCode);
//            Assert.Equal(caseDto, actionResult.Value);
//        }

//        [Fact]
//        public async Task Update_ShouldReturnOk()
//        {
//            // Arrange
//            var caseId = 1;
//            var caseDto = new CaseDto { Name = "Updated Case", Image = "testcase.img" };
//            _caseServiceMock.Setup(s => s.Update(caseId, caseDto)).Returns(Task.CompletedTask);

//            // Act
//            var result = await _controller.Update(caseId, caseDto);

//            // Assert
//            var actionResult = Assert.IsType<OkResult>(result);
//            Assert.Equal(200, actionResult.StatusCode);
//        }

//        [Fact]
//        public async Task Delete_ShouldReturnOk()
//        {
//            // Arrange
//            var caseId = 1;
//            _caseServiceMock.Setup(s => s.Delete(caseId)).Returns(Task.CompletedTask);

//            // Act
//            var result = await _controller.Delete(caseId);

//            // Assert
//            var actionResult = Assert.IsType<OkResult>(result);
//            Assert.Equal(200, actionResult.StatusCode);
//        }

//        [Fact]
//        public async Task AddItemToCase_ShouldReturnOk()
//        {
//            // Arrange
//            var caseId = 1;
//            var itemId = 2;
//            _caseServiceMock.Setup(s => s.AddItemToCase(caseId, itemId)).Returns(Task.CompletedTask);

//            // Act
//            var result = await _controller.AddItemToCase(caseId, itemId);

//            // Assert
//            var actionResult = Assert.IsType<OkResult>(result);
//            Assert.Equal(200, actionResult.StatusCode);
//        }

//        [Fact]
//        public async Task GetItemsByCaseId_ShouldReturnOkWithItems()
//        {
//            // Arrange
//            var caseId = 1;
//            var items = new List<ItemDto>
//            {
//                new ItemDto { Id = 1, Name = "Item 1", Image="Item1.img" },
//                new ItemDto { Id = 2, Name = "Item 2", Image="Item2.img" }
//            };
//            _caseServiceMock.Setup(s => s.GetItemsByCaseId(caseId)).ReturnsAsync(items);

//            // Act
//            var result = await _controller.GetItemsByCaseId(caseId);

//            // Assert
//            var actionResult = Assert.IsType<OkObjectResult>(result);
//            Assert.Equal(200, actionResult.StatusCode);
//            Assert.Equal(items, actionResult.Value);
//        }

//        [Fact]
//        public async Task DeleteItemInCase_ShouldReturnOk()
//        {
//            // Arrange
//            var caseId = 1;
//            var itemId = 2;
//            _caseServiceMock.Setup(s => s.DeleteItemInCase(caseId, itemId)).Returns(Task.CompletedTask);

//            // Act
//            var result = await _controller.DeleteItemInCase(caseId, itemId);

//            // Assert
//            var actionResult = Assert.IsType<OkResult>(result);
//            Assert.Equal(200, actionResult.StatusCode);
//        }

//        [Fact]
//        public async Task DrawItemFromCase_ShouldReturnOkWithItem()
//        {
//            // Arrange
//            var caseId = 1;
//            var item = new ItemDto { Id = 1, Name = "Winning Item", Image="winningitem.img" };
//            _caseServiceMock.Setup(s => s.DrawItemFromCase(caseId)).ReturnsAsync(item);

//            // Act
//            var result = await _controller.DrawItemFromCase(caseId);

//            // Assert
//            var actionResult = Assert.IsType<OkObjectResult>(result);
//            Assert.Equal(200, actionResult.StatusCode);
//            Assert.Equal(item, actionResult.Value);
//        }

//    }
//}