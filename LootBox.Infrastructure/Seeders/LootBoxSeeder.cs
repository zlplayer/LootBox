using LootBox.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Infrastructure.Seeders
{
    public class LootBoxSeeder
    {
        private readonly LootBoxDbContext _dbContext;

        public LootBoxSeeder(LootBoxDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void Seed()
        {
            if (_dbContext.Database.CanConnect())
            {
                if(!_dbContext.Rarities.Any())
                {
                    var rarities = GetRarity();
                    _dbContext.Rarities.AddRange(rarities);
                    _dbContext.SaveChanges();
                }
                if(!_dbContext.WearRatings.Any())
                {
                    var wearRatings = GetWearRatings();
                    _dbContext.WearRatings.AddRange(wearRatings);
                    _dbContext.SaveChanges();
                }
                if(!_dbContext.TypeItems.Any())
                {
                    var typeItems = GetTypeItems();
                    _dbContext.TypeItems.AddRange(typeItems);
                    _dbContext.SaveChanges();
                }
            }
        }

        private IEnumerable<Rarity> GetRarity()
        {
            return new List<Rarity>
            {
                new Rarity
                {
                    Name = "Mil-Spec",
                    Color = "Blue",
                    Percent = 79.92f
                },
                new Rarity
                {
                    Name = "Restricted",
                    Color = "Purple",
                    Percent = 15.98f
                },
                new Rarity
                {
                    Name = "Classified",
                    Color = "Pink",
                    Percent = 3.2f
                },
                new Rarity
                {
                    Name = "Covert",
                    Color = "Red",
                    Percent = 0.64f
                },
                new Rarity
                {
                    Name = "Special Item",
                    Color = "Yellow",
                    Percent = 0.26f
                }
            };
        }

        private IEnumerable<WearRating> GetWearRatings() 
        {
            return new List<WearRating>
            {
                new WearRating
                {
                    Name = "Factory New"
                },
                new WearRating
                {
                    Name = "Minimal Wear"
                },
                new WearRating
                {
                    Name = "Field-Tested"
                },
                new WearRating
                {
                    Name = "Well-Worn"
                }
            };
        }
        private IEnumerable<TypeItem> GetTypeItems()
        {
            return new List<TypeItem>
            {
                new TypeItem
                {
                    Name = "Pistol"
                },
                new TypeItem
                {
                    Name = "Rifle"
                },
                new TypeItem
                {
                    Name = "SMG"
                },
                new TypeItem
                {
                    Name = "Sniper Rifle"
                },
                new TypeItem
                {
                    Name = "Shotgun"
                },
                new TypeItem
                {
                    Name = "Machinegun"
                },
                new TypeItem
                {
                    Name = "Knife"
                }
            };
        }
    }
}
