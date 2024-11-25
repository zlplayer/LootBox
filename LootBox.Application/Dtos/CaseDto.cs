﻿using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Application.Dtos
{
    public class CaseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } =default!;
        public string Image { get; set; }
        public float Price { get; set; }

    }
}
