using NUnit.Framework;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using UserProfileService.Infrastructur.Repository;
using UserProfileService.Models;
namespace UserProfileServiceTest
{
    public class UserProfileServicesTest
    {
        private Mock<IUserProfileRepository> mockRepo;
        private UserProfile sampleProfile;
        [SetUp]
        public void Setup()
        {
            mockRepo = new Mock<IUserProfileRepository>();
            sampleProfile = new UserProfile
            {
                UserId = "1",
                Name = "Steve",
                Email = "steve@example.com",
                Password = "1234567890",
                Gender = "Male",
                Age = 30,
                Salary = 50000,
                PresentLivingCountry = "USA"
            };
        }
        [Test]
        public async Task GetAllAsync_ShouldReturnListOfProfiles()
        {
            // Arrange
            var profiles = new List<UserProfile> { sampleProfile };
            mockRepo.Setup(r => r.GetAllAsync()).ReturnsAsync(profiles);
            // Act
            var result = await mockRepo.Object.GetAllAsync();
            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(1, ((List<UserProfile>)result).Count);
            Assert.AreEqual("Steve", ((List<UserProfile>)result)[0].Name);
        }
        [Test]
        public async Task GetByIdAsync_ShouldReturnProfile_WhenEmailExists()
        {
            // Arrange
            mockRepo.Setup(r => r.GetByIdAsync(sampleProfile.Email)).ReturnsAsync(sampleProfile);
            // Act
            var result = await mockRepo.Object.GetByIdAsync(sampleProfile.Email);
            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(sampleProfile.Email, result.Email);
        }
        [Test]
        public async Task GetByIdAsync_ShouldReturnNull_WhenEmailDoesNotExist()
        {
            // Arrange
            mockRepo.Setup(r => r.GetByIdAsync("notfound@example.com")).ReturnsAsync((UserProfile)null);
            // Act
            var result = await mockRepo.Object.GetByIdAsync("notfound@example.com");
            // Assert
            Assert.IsNull(result);
        }
        [Test]
        public async Task CreateAsync_ShouldCallMethodOnce()
        {
            // Arrange
            mockRepo.Setup(r => r.CreateAsync(It.IsAny<UserProfile>())).Returns(Task.CompletedTask);
            // Act
            await mockRepo.Object.CreateAsync(sampleProfile);
            // Assert
            mockRepo.Verify(r => r.CreateAsync(sampleProfile), Times.Once);
        }
        [Test]
        public async Task UpdateAsync_ShouldReturnTrue_WhenSuccessful()
        {
            // Arrange
            mockRepo.Setup(r => r.UpdateAsync(sampleProfile)).ReturnsAsync(true);
            // Act
            var result = await mockRepo.Object.UpdateAsync(sampleProfile);
            // Assert
            Assert.IsTrue(result);
        }
        [Test]
        public async Task UpdateAsync_ShouldReturnFalse_WhenFailed()
        {
            // Arrange
            mockRepo.Setup(r => r.UpdateAsync(sampleProfile)).ReturnsAsync(false);
            // Act
            var result = await mockRepo.Object.UpdateAsync(sampleProfile);
            // Assert
            Assert.IsFalse(result);
        }
        [Test]
        public async Task DeleteAsync_ShouldReturnTrue_WhenDeleted()
        {
            // Arrange
            mockRepo.Setup(r => r.DeleteAsync(sampleProfile.UserId)).ReturnsAsync(true);
            // Act
            var result = await mockRepo.Object.DeleteAsync(sampleProfile.UserId);
            // Assert
            Assert.IsTrue(result);
        }
        [Test]
        public async Task DeleteAsync_ShouldReturnFalse_WhenNotDeleted()
        {
            // Arrange
            mockRepo.Setup(r => r.DeleteAsync(sampleProfile.UserId)).ReturnsAsync(false);
            // Act
            var result = await mockRepo.Object.DeleteAsync(sampleProfile.UserId);
            // Assert
            Assert.IsFalse(result);
        }
        [Test]
        public void EmailExists_ShouldReturnTrue_WhenEmailFound()
        {
            // Arrange
            mockRepo.Setup(r => r.EmailExists(sampleProfile.Email)).Returns(true);
            // Act
            var result = mockRepo.Object.EmailExists(sampleProfile.Email);
            // Assert
            Assert.IsTrue(result);
        }
        [Test]
        public void EmailExists_ShouldReturnFalse_WhenEmailNotFound()
        {
            // Arrange
            mockRepo.Setup(r => r.EmailExists("fake@example.com")).Returns(false);
            // Act
            var result = mockRepo.Object.EmailExists("fake@example.com");
            // Assert
            Assert.IsFalse(result);
        }
        [Test]
        public void AddProfile_ShouldBeCalledOnce()
        {
            // Arrange
            mockRepo.Setup(r => r.AddProfile(It.IsAny<UserProfile>()));
            // Act
            mockRepo.Object.AddProfile(sampleProfile);
            // Assert
            mockRepo.Verify(r => r.AddProfile(sampleProfile), Times.Once);
        }
    }
}

        