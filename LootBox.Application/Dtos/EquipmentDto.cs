﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Application.Dtos
{
    public class EquipmentDto
    {
        public string Name { get; set; }
        public string Image { get; set; }
        public float Price { get; set; }
        public string RarityColor { get; set; }
        public string WearRatingName { get; set; }
        public string TypeItemName { get; set; }
    }
}
