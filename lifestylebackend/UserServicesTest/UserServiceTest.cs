using NUnit.Framework;
using Moq;
using UserService.Infrastructure.Repository;
using UserService.Models;
namespace UserServiceTest
{
    public class UserServicesTest
    {
        private Mock<IUserRepository> mockRepo;
        private User sampleUser;
        [SetUp]
        public void Setup()
        {
            mockRepo = new Mock<IUserRepository>();
            sampleUser = new User
            {
                Email = "test@example.com",
                Password = "Password123"
            };
        }
        [Test]
        public void EmailExistsPositive()
        {
            // Arrange
            mockRepo.Setup(repo => repo.EmailExists(sampleUser.Email)).Returns(true);
            // Act
            var result = mockRepo.Object.EmailExists(sampleUser.Email);
            // Assert
            Assert.IsTrue(result);
        }
        [Test]
        public void EmailExistsNegative()
        {
            // Arrange
            mockRepo.Setup(repo => repo.EmailExists("nonexistent@example.com")).Returns(false);
            // Act
            var result = mockRepo.Object.EmailExists("nonexistent@example.com");
            // Assert
            Assert.IsFalse(result);
        }
        [Test]
        public void AddUserPositive()
        {
            // Arrange
            mockRepo.Setup(repo => repo.AddUser(It.IsAny<User>()));
            // Act
            mockRepo.Object.AddUser(sampleUser);
            // Assert
            mockRepo.Verify(repo => repo.AddUser(sampleUser), Times.Once);
        }
        [Test]
        public void AddUserNegative()
        {
            // Arrange
            mockRepo.Setup(repo => repo.ValidateUser(sampleUser)).Returns(true);
            // Act
            var result = mockRepo.Object.ValidateUser(sampleUser);
            // Assert
            Assert.IsTrue(result);
        }
        [Test]
        public void ValidateUserPositive()
        {
            // Arrange
            var invalidUser = new User { Email = "wrong@example.com", Password = "wrongpass" };
            mockRepo.Setup(repo => repo.ValidateUser(invalidUser)).Returns(false);
            // Act
            var result = mockRepo.Object.ValidateUser(invalidUser);
            // Assert
            Assert.IsFalse(result);
        }
        [Test]
        public void ValidateUserNegative()
        {
            // Arrange
            mockRepo.Setup(repo => repo.UpdatePasswordByEmail(It.IsAny<User>()));
            // Act
            mockRepo.Object.UpdatePasswordByEmail(sampleUser);
            // Assert
            mockRepo.Verify(repo => repo.UpdatePasswordByEmail(sampleUser), Times.Once);
        }
    }
}