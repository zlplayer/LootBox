using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Application.Dtos
{
    public class RarityDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Color { get; set; }
        public float Percent { get; set; }

    }
}
