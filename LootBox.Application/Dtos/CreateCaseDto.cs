using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Application.Dtos
{
    public class CreateCaseDto
    {
        public string Name { get; set; } = default!;
        public IFormFile? ImageFile { get; set; }
        public float Price { get; set; }
    }
}
