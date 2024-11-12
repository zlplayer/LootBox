using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LootBox.Application.Dtos
{
    public class CaseAndItemDto
    {
        public int Id { get; set; }
        public int CaseId { get; set; }
        public int ItemId { get; set; }
    }
}
