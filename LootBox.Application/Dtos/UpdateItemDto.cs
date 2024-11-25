using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Application.Dtos
{
    public class UpdateItemDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public IFormFile? ImageFile { get; set; }
        public float Price { get; set; }
        public int RarityId { get; set; }
        public int TypeItemId { get; set; }
        public int WearRatingId { get; set; }
    }
}
